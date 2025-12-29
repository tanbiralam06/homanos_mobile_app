import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import useAuthStore from "../../store/authStore";
import useProfileStore from "../../store/profileStore";
import { useCallback } from "react";
import {
  colors,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
} from "../../utils/theme";

export default function Profile() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { profile, fetchProfile } = useProfileStore();
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [])
  );

  const handleMenuPress = () => {
    Alert.alert("Menu", "Settings and Logout options will appear here.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/auth/login");
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {user?.username || profile?.owner?.username || "username"}
        </Text>
        <TouchableOpacity onPress={handleMenuPress} style={styles.menuButton}>
          <Ionicons name="menu-outline" size={28} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Section: Avatar + Stats */}
        <View style={styles.topSection}>
          {/* Avatar Column */}
          <View style={styles.avatarColumn}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={50} color={colors.white} />
              </View>
              <View style={styles.onlineBadge} />
            </View>
            <Text style={styles.fullName} numberOfLines={1}>
              {profile?.fullName || user?.username || "New User"}
            </Text>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statDivider} />
            <TouchableOpacity
              style={styles.statItem}
              onPress={() =>
                router.push({
                  pathname: "/user/followers",
                  params: { userId: user?._id || profile?.owner?._id },
                })
              }
            >
              <Text style={styles.statValue}>
                {profile?.followersCount || 0}
              </Text>
              <Text style={styles.statLabel}>Followers</Text>
            </TouchableOpacity>
            <View style={styles.statDivider} />
            <TouchableOpacity
              style={styles.statItem}
              onPress={() =>
                router.push({
                  pathname: "/user/following",
                  params: { userId: user?._id || profile?.owner?._id },
                })
              }
            >
              <Text style={styles.statValue}>
                {profile?.followingCount || 0}
              </Text>
              <Text style={styles.statLabel}>Following</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bio Section */}
        <View style={styles.bioSection}>
          {profile?.bio ? <Text style={styles.bio}>{profile.bio}</Text> : null}

          {profile?.location ? (
            <View style={styles.locationContainer}>
              <Ionicons
                name="location-outline"
                size={14}
                color={colors.textSecondary}
              />
              <Text style={styles.location}>{profile.location}</Text>
            </View>
          ) : null}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push("/profile/edit")}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Content Tabs */}
        <View style={styles.tabContainer}>
          <View style={styles.activeTab}>
            <Ionicons name="grid" size={24} color={colors.textPrimary} />
          </View>
        </View>

        {/* Posts Grid */}
        <View style={styles.postsGrid}>
          {/* Empty State */}
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Ionicons
                name="camera-outline"
                size={40}
                color={colors.textSecondary}
              />
            </View>
            <Text style={styles.emptyStateText}>No posts yet</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  menuButton: {
    padding: spacing.xs,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  topSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm,
  },
  avatarColumn: {
    alignItems: "center",
    marginRight: spacing.lg,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: spacing.xs,
  },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  onlineBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  fullName: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    maxWidth: 90,
    textAlign: "center",
  },
  statsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
  },
  bioSection: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  bio: {
    fontSize: fontSize.base,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.xs,
    gap: 2,
  },
  location: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  actionButtons: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  editButton: {
    backgroundColor: colors.background, // Light gray
    paddingVertical: 8,
    borderRadius: borderRadius.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  editButtonText: {
    color: colors.textPrimary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  tabContainer: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: spacing.sm,
  },
  activeTab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.textPrimary,
  },
  postsGrid: {
    minHeight: 300,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: spacing.xxl,
  },
  emptyIconContainer: {
    marginBottom: spacing.sm,
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors.textPrimary,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
});
