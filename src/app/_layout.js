import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import useAuthStore from "../store/authStore";
import { colors } from "../utils/theme";
import { ThemeProvider } from "../context/ThemeContext";

export default function Layout() {
  const { isAuthenticated, isLoading, init } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    init();
  }, []);

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
