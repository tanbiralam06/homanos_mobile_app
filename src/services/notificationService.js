import api from "./api";

export const getNotifications = async (page = 1, limit = 15) => {
  const response = await api.get(`/notifications?page=${page}&limit=${limit}`);
  return response.data.data;
};

export const markAsRead = async (notificationId) => {
  const response = await api.patch(`/notifications/${notificationId}/read`);
  return response.data.data;
};

export const markAllAsRead = async () => {
  const response = await api.patch("/notifications/read-all");
  return response.data.data;
};
