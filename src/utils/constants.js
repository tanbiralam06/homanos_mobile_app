import { Platform } from "react-native";

// Detect local IP or use localhost depending on environment
// For Android Emulator, 10.0.2.2 points to host machine's localhost
// For physical device, you'll need the actual IP of your computer (hardcoded for now or use environment var)
const LOCALHOST_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:8000/api/v1"
    : "http://localhost:8000/api/v1";

// In production, we would use an environment variable
export const API_BASE_URL = LOCALHOST_URL;
