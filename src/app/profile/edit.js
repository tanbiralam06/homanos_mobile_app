import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import useProfileStore from "../../store/profileStore";
import useAuthStore from "../../store/authStore";
import {
  colors,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
} from "../../utils/theme";

export default function EditProfile() {
  const router = useRouter();
  const { profile, updateProfile, isLoading } = useProfileStore();
  const updateUser = useAuthStore((state) => state.updateUser);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    bio: "",
    locationName: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.owner?.username || "",
        fullName: profile.fullName || "",
        bio: profile.bio || "",
        locationName: profile.locationName || "",
      });
    }
  }, [profile]);
  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    // Clear error when user types
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: null }));
    }
  };

  const handleSave = async () => {
    try {
      const updatedProfile = await updateProfile(formData);
      // Sync with auth store if username changed
      if (updatedProfile?.owner) {
        updateUser({ username: updatedProfile.owner.username });
      } else if (formData.username) {
        // Fallback if owner not populated fully in response (though controller does populate it)
        updateUser({ username: formData.username });
      }

      Alert.alert("Success", "Profile updated successfully");
      router.back();
    } catch (error) {
      console.error("Update profile error:", error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update profile";

      if (error.response?.status === 409) {
        setErrors((prev) => ({ ...prev, username: message }));
      } else {
        Alert.alert("Error", message);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Text style={styles.saveButton}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={formData.username}
            onChangeText={(text) => handleChange("username", text)}
            placeholder="Enter your username"
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="none"
          />
          {errors.username && (
            <Text style={styles.errorText}>{errors.username}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={formData.fullName}
            onChangeText={(text) => handleChange("fullName", text)}
            placeholder="Enter your full name"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.bio}
            onChangeText={(text) => handleChange("bio", text)}
            placeholder="Tell us about yourself"
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            value={formData.locationName}
            onChangeText={(text) => handleChange("locationName", text)}
            placeholder="Where are you based?"
            placeholderTextColor={colors.textSecondary}
          />
        </View>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  saveButton: {
    fontSize: fontSize.lg,
    color: colors.primary,
    fontWeight: fontWeight.bold,
  },
  form: {
    padding: spacing.lg,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: fontSize.base,
    color: colors.textPrimary,
  },
  textArea: {
    height: 100,
  },
  errorText: {
    color: colors.error,
    fontSize: fontSize.xs,
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
});
