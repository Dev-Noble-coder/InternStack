import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { CsrfResponse } from "../types/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Always send cookies
});

let csrfToken: string | null = null;
let isFetchingCsrf = false;
let csrfSubscribers: ((token: string) => void)[] = [];

// Helper to fetch CSRF Token
const fetchCsrfToken = async (): Promise<string> => {
  if (csrfToken) return csrfToken;
  
  if (isFetchingCsrf) {
    return new Promise((resolve) => {
      csrfSubscribers.push(resolve);
    });
  }

  isFetchingCsrf = true;
  try {
    const { data } = await axios.get<CsrfResponse>(`${API_URL}/api/auth/csrf`, {
      withCredentials: true,
    });
    csrfToken = data.csrfToken;
    csrfSubscribers.forEach((cb) => cb(csrfToken as string));
    csrfSubscribers = [];
    return csrfToken;
  } finally {
    isFetchingCsrf = false;
  }
};

// Request Interceptor: Attach CSRF Token for non-GET requests
axiosInstance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const method = (config.method || "GET").toUpperCase();
  if (!["GET", "HEAD", "OPTIONS"].includes(method)) {
    const token = await fetchCsrfToken();
    if (token) {
      config.headers.set("X-CSRF-Token", token);
    }
  }
  return config;
});

let isRefreshing = false;
let refreshSubscribers: ((error: Error | null) => void)[] = [];

const onRefreshed = (error: Error | null) => {
  refreshSubscribers.forEach((cb) => cb(error));
  refreshSubscribers = [];
};

// Response Interceptor: Handle 401 and 403 CSRF_INVALID
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (!originalRequest) return Promise.reject(error);

    // Handle CSRF_INVALID (403)
    if (
      error.response?.status === 403 &&
      (error.response.data as any)?.error?.code === "CSRF_INVALID" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      csrfToken = null; // force fetch a new token
      const newToken = await fetchCsrfToken();
      originalRequest.headers.set("X-CSRF-Token", newToken);
      return axiosInstance(originalRequest);
    }

    // Handle UNAUTHENTICATED (401)
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshSubscribers.push((err) => {
            if (err) return reject(err);
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axios.post(`${API_URL}/api/auth/refresh`, undefined, {
          withCredentials: true,
          headers: csrfToken ? { "X-CSRF-Token": csrfToken } : undefined,
        });
        isRefreshing = false;
        onRefreshed(null);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        onRefreshed(refreshError as Error);
        // We'll let the application layer handle the logout (e.g. clearing Zustand store)
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
