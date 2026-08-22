"use client";

import { useEffect } from "react";
import { authService } from "../services/auth.service";
import { useAuthStore } from "../stores/authStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setInitializing } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { user } = await authService.getMe();
        setUser(user);
      } catch (error) {
        // 401 is handled by interceptor which might refresh.
        // If it fully fails, interceptor throws here and we clear user.
        setUser(null);
      } finally {
        setInitializing(false);
      }
    };

    initAuth();
  }, [setUser, setInitializing]);

  return <>{children}</>;
}
