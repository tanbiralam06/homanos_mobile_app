import { Stack, useRouter, useSegments } from "expo-router";
import { useState, useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import useAuthStore from "../store/authStore";
import { colors } from "../utils/theme";
import { ThemeProvider } from "../context/ThemeContext";
import socketService from "../services/socketService";
import ToastNotification from "../components/common/ToastNotification";

export default function Layout() {
  const { isAuthenticated, isLoading, init } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    // Global listener for private message notifications
    if (isAuthenticated) {
      socketService.onPrivateMessageNotification((data) => {
        // Don't show toast if we are already on the specific chat screen
        // segments might look like ['private-chat', '[userId]']
        // But we can check if the current path includes the private-chat
        // For simplicity, just show it. If user is in chat, they see the message anyway.
        // A better check would be seeing if current route params match senderId.

        // Basic implementation: Show toast
        setToastMessage(data);
      });
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "auth";

    if (isAuthenticated && inAuthGroup) {
      // If user is signed in and tries to access auth pages, redirect to home
      router.replace("/");
    } else if (!isAuthenticated && !inAuthGroup) {
      // If user is not signed in and tries to access restricted pages, redirect to login
      router.replace("/auth/login");
    }
  }, [isAuthenticated, segments, isLoading]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
      {toastMessage && (
        <ToastNotification
          message={toastMessage}
          onHide={() => setToastMessage(null)}
        />
      )}
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
});
