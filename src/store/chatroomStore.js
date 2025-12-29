import { create } from "zustand";
import {
  getAllChatrooms,
  createChatroom as apiCreateChatroom,
} from "../services/chatroomService";

const useChatroomStore = create((set, get) => ({
  chatrooms: [],
  isLoading: false,
  error: null,

  // Fetch all chatrooms
  fetchChatrooms: async () => {
    set({ isLoading: true, error: null });
    try {
      const chatrooms = await getAllChatrooms();
      set({ chatrooms, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch chatrooms",
        isLoading: false,
      });
    }
  },

  // Create a new chatroom
  createChatroom: async (name, topic, description) => {
    set({ isLoading: true, error: null });
    try {
      const newRoom = await apiCreateChatroom(name, topic, description);
      set((state) => ({
        chatrooms: [newRoom, ...state.chatrooms],
        isLoading: false,
      }));
      return newRoom;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to create chatroom",
        isLoading: false,
      });
      return null;
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useChatroomStore;
