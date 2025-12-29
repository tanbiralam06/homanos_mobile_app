import { create } from "zustand";
import { getProfile, updateProfile } from "../services/profileService";

const useProfileStore = create((set) => ({
  profile: null,
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const profile = await getProfile();
      set({ profile, isLoading: false });
    } catch (error) {
      console.error("Fetch profile error:", error);
      set({ error: error.message, isLoading: false });
    }
  },

  updateProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const updatedProfile = await updateProfile(data);
      set({ profile: updatedProfile, isLoading: false });
      return updatedProfile;
    } catch (error) {
      console.error("Update profile error:", error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
}));

export default useProfileStore;
