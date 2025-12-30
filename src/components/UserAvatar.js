import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { spacing, fontSize, fontWeight } from "../utils/theme";

export default function UserAvatar({ user, isOwnProfile = false, onPress }) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View
        style={[
          styles.avatarContainer,
          { borderColor: isOwnProfile ? colors.border : colors.primary },
        ]}
      >
        {user?.avatar ? (
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
        ) : (
          <View
            style={[styles.placeholder, { backgroundColor: colors.secondary }]}
          >
            <Text style={styles.initials}>
              {user?.username?.substring(0, 2).toUpperCase() || "??"}
            </Text>
          </View>
        )}
        {isOwnProfile && (
          <View style={[styles.badge, { backgroundColor: colors.primary }]}>
            <Text style={styles.badgeText}>+</Text>
          </View>
        )}
      </View>
      <Text
        style={[styles.username, { color: colors.textPrimary }]}
        numberOfLines={1}
      >
        {isOwnProfile ? "Your Story" : user?.username}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginRight: spacing.md,
    width: 70,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    padding: 2,
    marginBottom: spacing.xs,
    position: "relative",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
  },
  placeholder: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    color: "#FFF",
    fontWeight: fontWeight.bold,
    fontSize: fontSize.lg,
  },
  username: {
    fontSize: fontSize.xs,
    textAlign: "center",
  },
  badge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  badgeText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
    lineHeight: 14,
  },
});
