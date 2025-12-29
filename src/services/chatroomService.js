import api from "./api";

// Create a new chatroom
export const createChatroom = async (name, topic, description = "") => {
  const response = await api.post("/chatrooms", {
    name,
    topic,
    description,
  });
  return response.data.data;
};

// Get all active chatrooms
export const getAllChatrooms = async () => {
  const response = await api.get("/chatrooms");
  return response.data.data;
};

// Get chatroom details
export const getChatroomDetails = async (roomId) => {
  const response = await api.get(`/chatrooms/${roomId}`);
  return response.data.data;
};

// Join a chatroom
export const joinChatroom = async (roomId, isAnonymous = false) => {
  const response = await api.post(`/chatrooms/${roomId}/join`, {
    isAnonymous,
  });
  return response.data.data;
};

// Leave a chatroom
export const leaveChatroom = async (roomId) => {
  const response = await api.post(`/chatrooms/${roomId}/leave`);
  return response.data.data;
};

// Get chatroom messages
export const getChatroomMessages = async (roomId, limit = 100) => {
  const response = await api.get(`/chatrooms/${roomId}/messages`, {
    params: { limit },
  });
  return response.data.data;
};

// Universal search
export const universalSearch = async (query) => {
  const response = await api.get("/search", {
    params: { q: query },
  });
  return response.data.data;
};
