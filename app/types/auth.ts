export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  emailVerified: boolean;
  profilePicture: string | null;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
}

export interface MessageResponse {
  message: string;
}

export interface CsrfResponse {
  csrfToken: string;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
  };
}
