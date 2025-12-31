import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  colors,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
} from "../../utils/theme";

export default function ToastNotification({ message, onHide }) {
  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    // Slide in
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      friction: 8,
    }).start();

    // Auto hide
    const timer = setTimeout(() => {
      handleHide();
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const handleHide = () => {
    Animated.timing(slideAnim, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onHide && onHide();
    });
  };

  const handlePress = () => {
    if (message?.senderId) {
      router.push({
        pathname: "/private-chat/[userId]",
        params: {
          userId: message.senderId,
          username: message.username,
        },
      });
      handleHide();
    }
  };

  if (!message) return null;

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateY: slideAnim }] }]}
    >
      <TouchableOpacity
        style={styles.content}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        <View style={styles.iconContainer}>
          <Ionicons
            name="chatbubble-ellipses"
            size={24}
            color={colors.primary}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>New message from {message.username}</Text>
          <Text style={styles.message} numberOfLines={1}>
            {message.content}
          </Text>
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={handleHide}>
          <Ionicons name="close" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 40,
    left: 20,
    right: 20,
    zIndex: 9999,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  content: {
    backgroundColor: "#fff", // Or use theme colors if imported dynamically
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  iconContainer: {
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  message: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  closeButton: {
    padding: 4,
    marginLeft: spacing.sm,
  },
});
