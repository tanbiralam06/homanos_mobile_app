import { create } from "zustand";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from "../services/notificationService";
import socketService from "../services/socketService";

const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  page: 1,
  hasMore: true,

  fetchNotifications: async (refresh = false) => {
    if (get().loading) return;

    set({ loading: true, error: null });
    try {
      const page = refresh ? 1 : get().page;
      const data = await getNotifications(page);

      set((state) => ({
        notifications: refresh
          ? data.notifications
          : [...state.notifications, ...data.notifications],
        unreadCount: data.unreadCount,
        page: page + 1,
        hasMore: data.notifications.length === 20, // Assuming limit 20
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  markRead: async (id) => {
    try {
      await markAsRead(id);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  },

  markAllRead: async () => {
    try {
      await markAllAsRead();
      set((state) => ({
        notifications: state.notifications.map((n) => ({
          ...n,
          isRead: true,
        })),
        unreadCount: 0,
      }));
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  },

  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  // Socket Listener
  initializeSocketListener: () => {
    const socket = socketService.getSocket();
    if (!socket) return;

    socket.off("notification"); // Clean up old listener
    socket.on("notification", (notification) => {
      get().addNotification(notification);
    });
  },
}));

export default useNotificationStore;
