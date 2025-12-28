import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  if (response.data?.data) {
    await AsyncStorage.setItem("accessToken", response.data.data.accessToken);
    await AsyncStorage.setItem("refreshToken", response.data.data.refreshToken);
    await AsyncStorage.setItem("user", JSON.stringify(response.data.data.user));
    return response.data.data;
  }
  throw new Error("Login failed");
};

export const register = async (username, email, password) => {
  const response = await api.post("/auth/signup", {
    username,
    email,
    password,
  });
  if (response.data?.data) {
    // Note: Depending on backend, signup might not return tokens immediately if email verification is strict
    // Assuming it does for MVP or we auto-login
    if (response.data.data.accessToken) {
      await AsyncStorage.setItem("accessToken", response.data.data.accessToken);
      await AsyncStorage.setItem(
        "refreshToken",
        response.data.data.refreshToken
      );
      await AsyncStorage.setItem(
        "user",
        JSON.stringify(response.data.data.user)
      );
    }
    return response.data.data;
  }
  throw new Error("Registration failed");
};

export const logout = async () => {
  await AsyncStorage.removeItem("accessToken");
  await AsyncStorage.removeItem("refreshToken");
  await AsyncStorage.removeItem("user");
};

export const getCurrentUser = async () => {
  const userStr = await AsyncStorage.getItem("user");
  if (userStr) return JSON.parse(userStr);
  return null;
};
