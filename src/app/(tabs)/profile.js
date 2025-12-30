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
import { useTheme } from "../../context/ThemeContext";
import { spacing, fontSize, fontWeight, borderRadius } from "../../utils/theme";

export default function Profile() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { profile, fetchProfile } = useProfileStore();
  const router = useRouter();
  const { colors, isDark } = useTheme();

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [])
  );

  const handleMenuPress = () => {
    router.push("/settings");
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.white }]}
      edges={["top"]}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.surface}
      />

      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: colors.surface }, // Removed border color
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          {user?.username || profile?.owner?.username || "username"}
        </Text>
        <TouchableOpacity onPress={handleMenuPress} style={styles.menuButton}>
          <Ionicons name="menu-outline" size={28} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={[styles.content, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Section: Avatar + Stats */}
        <View style={styles.topSection}>
          {/* Avatar Column */}
          <View style={styles.avatarColumn}>
            <View style={styles.avatarContainer}>
              <View
                style={[
                  styles.avatar,
                  {
                    backgroundColor: colors.primary,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Ionicons name="person" size={50} color={colors.white} />
              </View>
              {/* Online badge logic (optional) */}
              <View
                style={[styles.onlineBadge, { backgroundColor: colors.white }]}
              />
            </View>
            <Text
              style={[styles.fullName, { color: colors.textPrimary }]}
              numberOfLines={1}
            >
              {profile?.fullName || user?.username || "New User"}
            </Text>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                0
              </Text>
              <Text style={[styles.statLabel, { color: colors.textPrimary }]}>
                Posts
              </Text>
            </View>
            <View
              style={[styles.statDivider, { backgroundColor: colors.border }]}
            />
            <TouchableOpacity
              style={styles.statItem}
              onPress={() =>
                router.push({
                  pathname: "/user/followers",
                  params: { userId: user?._id || profile?.owner?._id },
                })
              }
            >
              <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                {profile?.followersCount || 0}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textPrimary }]}>
                Followers
              </Text>
            </TouchableOpacity>
            <View
              style={[styles.statDivider, { backgroundColor: colors.border }]}
            />
            <TouchableOpacity
              style={styles.statItem}
              onPress={() =>
                router.push({
                  pathname: "/user/following",
                  params: { userId: user?._id || profile?.owner?._id },
                })
              }
            >
              <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                {profile?.followingCount || 0}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textPrimary }]}>
                Following
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bio Section */}
        <View style={styles.bioSection}>
          {profile?.bio ? (
            <Text style={[styles.bio, { color: colors.textPrimary }]}>
              {profile.bio}
            </Text>
          ) : null}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[
              styles.editButton,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
            onPress={() => router.push("/profile/edit")}
          >
            <Text
              style={[styles.editButtonText, { color: colors.textPrimary }]}
            >
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content Tabs */}
        <View style={[styles.tabContainer, { borderTopColor: colors.border }]}>
          <View
            style={[
              styles.activeTab,
              { borderBottomColor: colors.textPrimary },
            ]}
          >
            <Ionicons name="grid" size={24} color={colors.textPrimary} />
          </View>
        </View>

        {/* Posts Grid */}
        <View style={styles.postsGrid}>
          {/* Empty State */}
          <View style={styles.emptyState}>
            <View
              style={[
                styles.emptyIconContainer,
                { borderColor: colors.textPrimary },
              ]}
            >
              <Ionicons
                name="camera-outline"
                size={40}
                color={colors.textSecondary}
              />
            </View>
            <Text
              style={[styles.emptyStateText, { color: colors.textPrimary }]}
            >
              No posts yet
            </Text>
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
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
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
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  onlineBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  fullName: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
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
  },
  statLabel: {
    fontSize: fontSize.sm,
  },
  bioSection: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  bio: {
    fontSize: fontSize.base,
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
  },
  actionButtons: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  editButton: {
    paddingVertical: 8,
    borderRadius: borderRadius.md,
    alignItems: "center",
    borderWidth: 1,
  },
  editButtonText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  tabContainer: {
    flexDirection: "row",
    borderTopWidth: 1,
    marginTop: spacing.sm,
  },
  activeTab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
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
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
});
