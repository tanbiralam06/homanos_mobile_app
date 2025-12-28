import { create } from "zustand";
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getCurrentUser,
} from "../services/authService";

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  // Initialize: Check if user is already logged in
  init: async () => {
    try {
      const user = await getCurrentUser();
      if (user) {
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (e) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = await apiLogin(email, password);
      set({ user: data.user, isAuthenticated: true, isLoading: false });
      return true; // Success
    } catch (error) {
      set({
        error: error.response?.data?.message || "Login failed",
        isLoading: false,
      });
      return false;
    }
  },

  register: async (username, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = await apiRegister(username, email, password);
      // If backend sends token on signup
      if (data.accessToken) {
        set({ user: data.user, isAuthenticated: true, isLoading: false });
      } else {
        // If email verification is required and no token sent
        set({ isLoading: false });
      }
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Signup failed",
        isLoading: false,
      });
      return false;
    }
  },

  logout: async () => {
    await apiLogout();
    set({ user: null, isAuthenticated: false });
  },
}));

export default useAuthStore;
