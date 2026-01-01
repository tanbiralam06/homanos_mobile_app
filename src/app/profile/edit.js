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
import { useEffect, useState, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import useProfileStore from "../../store/profileStore";
import useAuthStore from "../../store/authStore";
import { useTheme } from "../../context/ThemeContext";
import { spacing, fontSize, fontWeight, borderRadius } from "../../utils/theme";

import DateTimePicker from "@react-native-community/datetimepicker";

export default function EditProfile() {
  const router = useRouter();
  const { profile, updateProfile, isLoading } = useProfileStore();
  const updateUser = useAuthStore((state) => state.updateUser);
  const { colors } = useTheme();

  // Memoize styles to avoid re-creation on every render
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [errors, setErrors] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);

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
      let formattedBirthday = "";
      if (profile.birthday) {
        const date = new Date(profile.birthday);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        formattedBirthday = `${day}-${month}-${year}`;
      }

      setFormData({
        username: profile.owner?.username || "",
        fullName: profile.fullName || "",
        bio: profile.bio || "",
        locationName: profile.locationName || "",
        birthday: formattedBirthday,
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

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      // Format to DD-MM-YYYY
      const day = selectedDate.getDate().toString().padStart(2, "0");
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
      const year = selectedDate.getFullYear();
      const formattedDate = `${day}-${month}-${year}`;
      handleChange("birthday", formattedDate);
    }
  };

  const handleSave = async () => {
    try {
      // Create a copy of formData to transform for backend
      const payload = { ...formData };

      // Transform DD-MM-YYYY to YYYY-MM-DD for backend Date parsing
      if (payload.birthday && /^\d{2}-\d{2}-\d{4}$/.test(payload.birthday)) {
        const [day, month, year] = payload.birthday.split("-");
        // Create Date object or ISO string. YYYY-MM-DD is safe for Mongoose.
        payload.birthday = new Date(`${year}-${month}-${day}`);
      }

      const updatedProfile = await updateProfile(payload);
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
          <Text style={styles.label}>Birthday (DD-MM-YYYY)</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.dateInputContainer}
          >
            <TextInput
              style={[styles.input, styles.dateInput]}
              value={formData.birthday}
              placeholder="DD-MM-YYYY"
              placeholderTextColor={colors.textSecondary}
              editable={false} // Prevent manual typing, force picker usage for consistency
              pointerEvents="none"
            />
            <Ionicons
              name="calendar-outline"
              size={24}
              color={colors.textSecondary}
              style={styles.calendarIcon}
            />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={(() => {
                // Parse DD-MM-YYYY to Date object for picker
                if (!formData.birthday) return new Date();
                const [day, month, year] = formData.birthday.split("-");
                return new Date(year, month - 1, day);
              })()}
              mode="date"
              display="default"
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}
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
          styles={styles}
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
          styles={styles}
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
          styles={styles}
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
const ChipSelector = ({ label, options, value, onSelect, styles }) => (
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

const createStyles = (colors) =>
  StyleSheet.create({
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
      backgroundColor: colors.surface || colors.white, // fallback or explicit surface
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
      backgroundColor: colors.surface || colors.white, // Adapt to dark mode
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
    dateInputContainer: {
      position: "relative",
      justifyContent: "center",
    },
    dateInput: {
      paddingRight: 50, // Space for icon
      color: colors.textPrimary,
    },
    calendarIcon: {
      position: "absolute",
      right: spacing.md,
    },
  });
