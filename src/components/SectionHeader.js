import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { spacing, fontSize, fontWeight } from "../utils/theme";

export default function SectionHeader({ title, actionText, onActionDiff }) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
      {actionText && onActionDiff && (
        <TouchableOpacity onPress={onActionDiff}>
          <Text style={[styles.action, { color: colors.primary }]}>
            {actionText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  action: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
});
