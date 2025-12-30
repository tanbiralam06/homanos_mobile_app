import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import useAuthStore from "../../store/authStore";
import useProfileStore from "../../store/profileStore";
import { useTheme } from "../../context/ThemeContext";
import { spacing, fontSize, fontWeight, borderRadius } from "../../utils/theme";

export default function AccountDetails() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { profile } = useProfileStore();
  const { colors } = useTheme();

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderDetailItem = (label, value, isSensitive = false) => (
    <View style={styles.detailItem}>
      <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
        {label}
      </Text>
      <Text
        style={[
          styles.detailValue,
          { color: colors.textPrimary },
          isSensitive && styles.sensitiveValue,
        ]}
      >
        {value || "Not set"}
      </Text>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: colors.surface, borderBottomColor: colors.border },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Account Details
        </Text>
        <TouchableOpacity onPress={() => router.push("/profile/edit")}>
          <Ionicons name="pencil" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Profile Information
          </Text>
          <View
            style={[
              styles.card,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            {renderDetailItem(
              "Full Name",
              profile?.fullName || user?.username || "User"
            )}
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
            {renderDetailItem("Username", `@${user?.username}`)}
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
            {renderDetailItem("Bio", profile?.bio)}
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
            {renderDetailItem(
              "Location",
              typeof profile?.location === "string"
                ? profile?.location
                : "Location Enabled"
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Private Information
          </Text>
          <View
            style={[
              styles.card,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            {renderDetailItem("Email", user?.email)}
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
            {renderDetailItem("Password", "********", true)}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            System
          </Text>
          <View
            style={[
              styles.card,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            {renderDetailItem("Last Updated", formatDate(profile?.updatedAt))}
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
            {renderDetailItem("Member Since", formatDate(user?.createdAt))}
          </View>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.sm,
    textTransform: "uppercase",
  },
  card: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  detailItem: {
    padding: spacing.md,
  },
  detailLabel: {
    fontSize: fontSize.xs,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
  },
  sensitiveValue: {
    letterSpacing: 2,
    fontSize: fontSize.lg,
  },
  divider: {
    height: 1,
    marginLeft: spacing.md,
  },
});
