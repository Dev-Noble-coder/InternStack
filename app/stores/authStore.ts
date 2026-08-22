import { create } from "zustand";
import { User } from "../types/auth";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  setUser: (user: User | null) => void;
  setInitializing: (isInitializing: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isInitializing: true,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setInitializing: (isInitializing) => set({ isInitializing }),
  clearAuth: () => set({ user: null, isAuthenticated: false }),
}));
