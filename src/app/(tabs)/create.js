import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  colors,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
} from "../../utils/theme";

export default function Create() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Create</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>What would you like to create?</Text>

        {/* Create Room Option */}
        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => router.push("/create-room")}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="chatbubbles" size={32} color={colors.primary} />
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Create Chat Room</Text>
            <Text style={styles.optionDescription}>
              Start a conversation with people nearby
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={colors.textSecondary}
          />
        </TouchableOpacity>

        {/* Create Post Option */}
        <TouchableOpacity
          style={[styles.optionCard, styles.disabledCard]}
          disabled
        >
          <View style={styles.iconContainer}>
            <Ionicons name="create" size={32} color={colors.textSecondary} />
          </View>
          <View style={styles.optionContent}>
            <Text style={[styles.optionTitle, styles.disabledText]}>
              Create Post
            </Text>
            <Text style={styles.optionDescription}>Coming soon...</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.border} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  content: {
    padding: spacing.lg,
  },
  subtitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  disabledCard: {
    opacity: 0.5,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  disabledText: {
    color: colors.textSecondary,
  },
  optionDescription: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
});
