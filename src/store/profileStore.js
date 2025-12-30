import { create } from "zustand";
import {
  getProfile,
  updateProfile,
  updateLocation,
  getNearbyProfiles,
} from "../services/profileService";

const useProfileStore = create((set) => ({
  profile: null,
  nearbyProfiles: [],
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

  updateUserLocation: async (lat, long, accuracy, isSharing) => {
    try {
      const locationData = { lat, long, accuracy, isSharing };
      await updateLocation(locationData);
      set((state) => ({
        profile: state.profile
          ? {
              ...state.profile,
              location: {
                ...state.profile.location,
                coordinates: [long, lat],
                accuracy,
                isSharing,
              },
            }
          : null,
      }));
    } catch (error) {
      console.error("Update location error:", error);
    }
  },

  fetchNearbyProfiles: async (lat, long, radius = 5) => {
    set({ isLoading: true, error: null });
    try {
      const profiles = await getNearbyProfiles({ lat, long, radius });
      set({ nearbyProfiles: profiles, isLoading: false });
    } catch (error) {
      console.error("Fetch nearby profiles error:", error);
      set({ error: error.message, isLoading: false });
    }
  },
}));

export default useProfileStore;
