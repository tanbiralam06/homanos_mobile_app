import api from "./api";

export const getProfile = async () => {
  const response = await api.get("/profile/me");
  return response.data.data;
};

export const updateProfile = async (data) => {
  const response = await api.patch("/profile/update", data);
  return response.data.data;
};
