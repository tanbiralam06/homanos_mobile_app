import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "../context/ThemeContext";
import { spacing, fontSize, fontWeight, borderRadius } from "../utils/theme";

export default function ChatroomCard({ room }) {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
      onPress={() => router.push(`/chatroom/${room._id}`)}
    >
      <View style={[styles.icon, { backgroundColor: colors.secondary }]}>
        <Ionicons name="chatbubbles" size={24} color={colors.white} />
      </View>
      <View style={styles.content}>
        <Text style={[styles.name, { color: colors.textPrimary }]}>
          {room.name}
        </Text>
        <Text style={[styles.topic, { color: colors.textSecondary }]}>
          {room.topic}
        </Text>
        <View style={styles.meta}>
          <Ionicons name="people" size={14} color={colors.textSecondary} />
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>
            {room.participantCount || 0} people
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.xs / 2,
  },
  topic: {
    fontSize: fontSize.sm,
    marginBottom: spacing.xs,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs / 2,
  },
  metaText: {
    fontSize: fontSize.xs,
  },
});
