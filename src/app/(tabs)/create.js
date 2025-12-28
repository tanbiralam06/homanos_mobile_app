import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  colors,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
} from "../../utils/theme";

export default function Create() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Post</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="What's on your mind?"
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={8}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.mediaButton}>
            <Ionicons name="image-outline" size={24} color={colors.primary} />
            <Text style={styles.mediaButtonText}>Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.mediaButton}>
            <Ionicons
              name="videocam-outline"
              size={24}
              color={colors.primary}
            />
            <Text style={styles.mediaButtonText}>Video</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.mediaButton}>
            <Ionicons
              name="location-outline"
              size={24}
              color={colors.primary}
            />
            <Text style={styles.mediaButtonText}>Location</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.postButton}>
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
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
    flex: 1,
    padding: spacing.lg,
  },
  inputContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    minHeight: 200,
  },
  textInput: {
    fontSize: fontSize.base,
    color: colors.textPrimary,
    flex: 1,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
  },
  mediaButton: {
    alignItems: "center",
    gap: spacing.xs,
  },
  mediaButtonText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: fontWeight.medium,
  },
  postButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
    alignItems: "center",
    marginTop: spacing.lg,
  },
  postButtonText: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
});
