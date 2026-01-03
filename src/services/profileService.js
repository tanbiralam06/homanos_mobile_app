import api from "./api";

export const getProfile = async () => {
  const response = await api.get("/profile/me");
  return response.data.data;
};

export const updateProfile = async (data) => {
  const response = await api.patch("/profile/update", data);
  return response.data.data;
};

export const getUserProfile = async (userId) => {
  const response = await api.get(`/profile/u/${userId}`);
  return response.data.data;
};

export const toggleFollow = async (userId) => {
  const response = await api.post(`/follows/c/${userId}`);
  return response.data.data;
};

export const toggleBlockUser = async (userId) => {
  const response = await api.post(`/blocks/${userId}`);
  return response.data.data;
};

export const getBlockedUsers = async () => {
  const response = await api.get("/blocks");
  return response.data.data;
};

export const getFollowStatus = async (userId) => {
  const response = await api.get(`/follows/s/${userId}`);
  return response.data.data;
};

export const getFollowingList = async (userId) => {
  const response = await api.get(`/follows/list/${userId}`);
  return response.data.data;
};

export const getFollowersList = async (userId) => {
  const response = await api.get(`/follows/followers/${userId}`);
  return response.data.data;
};

export const removeFollower = async (followerId) => {
  const response = await api.delete(`/follows/r/${followerId}`);
  return response.data;
};

export const updateLocation = async (data) => {
  const response = await api.patch("/profile/location", data);
  return response.data.data;
};

export const getNearbyProfiles = async ({ lat, long, radius }) => {
  const response = await api.get("/profile/nearby", {
    params: { lat, long, radius },
  });
  return response.data.data;
};
