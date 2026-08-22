import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { useAuthStore } from "../stores/authStore";

export const useAuth = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setUser(data.user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      setUser(data.user);
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: authService.verifyEmail,
    onSuccess: (data) => {
      setUser(data.user);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
    },
  });

  return {
    loginMutation,
    registerMutation,
    verifyEmailMutation,
    logoutMutation,
  };
};
