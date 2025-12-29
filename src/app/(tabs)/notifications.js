import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { spacing, fontSize, fontWeight, borderRadius } from "../../utils/theme";

export default function Notifications() {
  const { colors } = useTheme();
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <View
        style={[
          styles.header,
          { backgroundColor: colors.surface, borderBottomColor: colors.border },
        ]}
      >
        <Text style={[styles.title, { color: colors.primary }]}>
          Notifications
        </Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.emptyState}>
          <Ionicons
            name="notifications-outline"
            size={64}
            color={colors.border}
          />
          <Text
            style={[styles.emptyStateText, { color: colors.textSecondary }]}
          >
            No notifications yet
          </Text>
          <Text
            style={[styles.emptyStateSubtext, { color: colors.textSecondary }]}
          >
            We'll notify you when something happens
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
  },
  content: {
    flex: 1,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xl,
  },
  emptyStateText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    marginTop: spacing.lg,
  },
  emptyStateSubtext: {
    fontSize: fontSize.base,
    marginTop: spacing.xs,
    textAlign: "center",
  },
});
