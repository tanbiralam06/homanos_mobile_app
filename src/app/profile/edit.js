import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
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
    birthday: "",
    occupation: "",
    gender: "",
    intent: "",
    educationLevel: "",
    interests: "",
    languages: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.owner?.username || "",
        fullName: profile.fullName || "",
        bio: profile.bio || "",
        locationName: profile.locationName || "",
        birthday: profile.birthday || "",
        occupation: profile.occupation || "",
        gender: profile.gender || "",
        intent: profile.intent || "",
        educationLevel: profile.educationLevel || "",
        interests: profile.interests || "",
        languages: profile.languages || "",
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

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
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

        {/* --- Algorithm Fields --- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>More About You</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Occupation</Text>
          <TextInput
            style={styles.input}
            value={formData.occupation}
            onChangeText={(text) => handleChange("occupation", text)}
            placeholder="What do you do?"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Birthday (YYYY-MM-DD)</Text>
          <TextInput
            style={styles.input}
            value={formData.birthday}
            onChangeText={(text) => handleChange("birthday", text)}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <ChipSelector
          label="Gender"
          options={[
            "Male",
            "Female",
            "Non-binary",
            "Other",
            "Prefer not to say",
          ]}
          value={formData.gender}
          onSelect={(val) => handleChange("gender", val)}
        />

        <ChipSelector
          label="Intent"
          options={[
            "Dating",
            "Friendship",
            "Networking",
            "Casual",
            "Something Serious",
          ]}
          value={formData.intent}
          onSelect={(val) => handleChange("intent", val)}
        />

        <ChipSelector
          label="Education Level"
          options={[
            "High School",
            "Bachelor",
            "Master",
            "Doctorate",
            "Trade School",
            "Other",
          ]}
          value={formData.educationLevel}
          onSelect={(val) => handleChange("educationLevel", val)}
        />

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Interests (comma separated)</Text>
          <TextInput
            style={styles.input}
            value={
              Array.isArray(formData.interests)
                ? formData.interests.join(", ")
                : formData.interests
            }
            onChangeText={(text) =>
              handleChange(
                "interests",
                text.split(",").map((i) => i.trim())
              )
            }
            placeholder="Tech, Art, Hiking..."
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Languages (comma separated)</Text>
          <TextInput
            style={styles.input}
            value={
              Array.isArray(formData.languages)
                ? formData.languages.join(", ")
                : formData.languages
            }
            onChangeText={(text) =>
              handleChange(
                "languages",
                text.split(",").map((l) => l.trim())
              )
            }
            placeholder="English, Spanish..."
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Helper Component for Chips
const ChipSelector = ({ label, options, value, onSelect }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.chipContainer}>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={[styles.chip, value === option && styles.chipActive]}
          onPress={() => onSelect(option)}
        >
          <Text
            style={[styles.chipText, value === option && styles.chipTextActive]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

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
  sectionHeader: {
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  chip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.white,
    fontWeight: fontWeight.bold,
  },
});
