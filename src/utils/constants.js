import Constants from "expo-constants";
import { Platform } from "react-native";

const getBaseUrl = () => {
  // If running in Expo Go (physical device), hostUri contains the computer's IP
  const debuggerHost = Constants.expoConfig?.hostUri;
  const localhost = debuggerHost?.split(":")[0];

  if (localhost) {
    return `http://${localhost}:8000/api/v1`;
  }

  // Fallback for Android Emulator
  if (Platform.OS === "android") {
    return "http://10.0.2.2:8000/api/v1";
  }

  // Fallback for iOS Simulator / Web
  return "http://localhost:8000/api/v1";
};

export const API_BASE_URL = getBaseUrl();
