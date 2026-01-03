import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  getUserProfile,
  getFollowStatus,
  toggleFollow,
  toggleBlockUser,
} from "../../services/profileService";
import useAuthStore from "../../store/authStore";
import { spacing, fontSize, fontWeight, borderRadius } from "../../utils/theme";
import { useTheme } from "../../context/ThemeContext";

export default function UserProfile() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false); // [NEW]
  const [showMenu, setShowMenu] = useState(false); // [NEW]
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { colors, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState("moments");

  const isOwnProfile = user?._id === id || user?._id === profile?.owner?._id;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const [profileData, followData] = await Promise.all([
          getUserProfile(id),
          getFollowStatus(id),
        ]);
        setProfile(profileData);
        setIsBlocked(profileData.isBlockedByMe || false); // [NEW]
        setIsFollowing(followData.isFollowing);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserProfile();
    }
  }, [id]);

  const handleFollowToggle = async () => {
    if (isOwnProfile) return;
    try {
      const data = await toggleFollow(id);
      setIsFollowing(data.isFollowing);
      // Update local follower count pessimistically or fetch again
      setProfile((prev) => ({
        ...prev,
        followersCount: data.isFollowing
          ? (prev.followersCount || 0) + 1
          : Math.max((prev.followersCount || 0) - 1, 0),
      }));
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };

  const handleBlockToggle = async () => {
    try {
      const data = await toggleBlockUser(id);
      setIsBlocked(data.isBlocked);
      if (data.isBlocked) {
        setIsFollowing(false); // Unfollow if blocked
        // Optionally update follower count locallly
        setProfile((prev) => ({
          ...prev,
          followersCount: Math.max(
            (prev.followersCount || 0) - (isFollowing ? 1 : 0),
            0
          ),
        }));
      }
    } catch (error) {
      console.error("Error toggling block:", error);
    }
  };

  const renderStat = (label, value, route) => (
    <TouchableOpacity
      style={[styles.statCard, { backgroundColor: colors.surface }]}
      onPress={() =>
        route &&
        router.push({
          pathname: route,
          params: { userId: id },
        })
      }
      disabled={!route}
    >
      <Text style={[styles.statValue, { color: colors.primary }]}>
        {value || 0}
      </Text>
      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !profile) {
    return (
      <View
        style={[styles.errorContainer, { backgroundColor: colors.background }]}
      >
        <Text style={[styles.errorText, { color: colors.error }]}>
          {error || "User not found"}
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
          <Text style={[styles.backButtonText, { color: colors.primary }]}>
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          {profile?.owner?.username || "Profile"}
        </Text>

        {/* Menu Options */}
        <View style={{ position: "relative", zIndex: 100 }}>
          <TouchableOpacity onPress={() => setShowMenu(!showMenu)}>
            <Ionicons
              name="ellipsis-vertical"
              size={24}
              color={colors.textPrimary}
            />
          </TouchableOpacity>

          {showMenu && (
            <View
              style={[
                styles.menuDropdown,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setShowMenu(false);
                  handleBlockToggle();
                }}
              >
                <Text style={[styles.menuItemText, { color: colors.error }]}>
                  {isBlocked ? "Unblock User" : "Block User"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Identity Section */}
        <View style={styles.identitySection}>
          <View
            style={[
              styles.avatarContainer,
              { borderColor: colors.primary, backgroundColor: colors.surface },
            ]}
          >
            {profile?.avatar && profile.avatar.length > 0 ? (
              <Image source={{ uri: profile.avatar }} style={styles.avatar} />
            ) : (
              <Ionicons name="person" size={60} color={colors.textSecondary} />
            )}
          </View>

          <Text style={[styles.fullName, { color: colors.textPrimary }]}>
            {profile?.fullName || profile?.owner?.username || "Traveler"}
          </Text>
          <Text style={[styles.username, { color: colors.textSecondary }]}>
            @{profile?.owner?.username || "username"}
          </Text>

          {profile?.bio && (
            <Text style={[styles.bio, { color: colors.textPrimary }]}>
              {profile.bio}
            </Text>
          )}

          {profile?.locationName ? (
            <View style={styles.locationContainer}>
              <Ionicons
                name="location-sharp"
                size={16}
                color={colors.textSecondary}
              />
              <Text
                style={[styles.locationText, { color: colors.textSecondary }]}
              >
                {profile.locationName}
              </Text>
            </View>
          ) : null}

          {/* Social Stats */}
          <View style={styles.statsRow}>
            {renderStat(
              "Followers",
              profile?.followersCount,
              "/user/followers"
            )}
            {renderStat(
              "Following",
              profile?.followingCount,
              "/user/following"
            )}
            {renderStat("Posts", 0)}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            {isOwnProfile ? (
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { backgroundColor: colors.primary },
                ]}
                onPress={() => router.push("/profile/edit")}
              >
                <Text
                  style={[styles.actionButtonText, { color: colors.white }]}
                >
                  Edit Profile
                </Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    isFollowing
                      ? {
                          backgroundColor: "transparent",
                          borderWidth: 1,
                          borderColor: colors.border,
                        }
                      : { backgroundColor: colors.primary },
                  ]}
                  onPress={handleFollowToggle}
                >
                  <Text
                    style={[
                      styles.actionButtonText,
                      {
                        color: isFollowing ? colors.textPrimary : colors.white,
                      },
                    ]}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    styles.outlineButton,
                    { borderColor: colors.border },
                  ]}
                  onPress={() =>
                    router.push({
                      pathname: "/private-chat/[userId]",
                      params: {
                        userId: id,
                        username: profile?.owner?.username,
                      },
                    })
                  }
                >
                  <Text
                    style={[
                      styles.actionButtonText,
                      { color: colors.textPrimary },
                    ]}
                  >
                    Message
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {/* Content Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "moments" && {
                backgroundColor: colors.primary + "15",
              },
            ]}
            onPress={() => setActiveTab("moments")}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === "moments"
                      ? colors.primary
                      : colors.textSecondary,
                  fontWeight:
                    activeTab === "moments"
                      ? fontWeight.bold
                      : fontWeight.medium,
                },
              ]}
            >
              Moments
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "about" && {
                backgroundColor: colors.primary + "15",
              },
            ]}
            onPress={() => setActiveTab("about")}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === "about"
                      ? colors.primary
                      : colors.textSecondary,
                  fontWeight:
                    activeTab === "about" ? fontWeight.bold : fontWeight.medium,
                },
              ]}
            >
              About
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === "moments" ? (
            <View style={styles.emptyState}>
              <Ionicons
                name="images-outline"
                size={48}
                color={colors.textSecondary}
              />
              <Text
                style={[styles.emptyStateText, { color: colors.textSecondary }]}
              >
                No moments shared yet.
              </Text>
            </View>
          ) : (
            <View
              style={[styles.infoCard, { backgroundColor: colors.surface }]}
            >
              <View style={styles.infoRow}>
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={colors.textSecondary}
                />
                <Text
                  style={[styles.infoText, { color: colors.textSecondary }]}
                >
                  Joined{" "}
                  {new Date(profile?.createdAt || Date.now()).getFullYear()}
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  errorText: {
    fontSize: fontSize.lg,
    marginBottom: spacing.md,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButtonText: {
    marginLeft: spacing.sm,
    fontSize: fontSize.base,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  identitySection: {
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
    position: "relative",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
  },
  fullName: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    textAlign: "center",
  },
  username: {
    fontSize: fontSize.md,
    marginTop: 2,
    marginBottom: spacing.md,
  },
  bio: {
    textAlign: "center",
    fontSize: fontSize.base,
    lineHeight: 22,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
    gap: 4,
  },
  locationText: {
    fontSize: fontSize.sm,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.md,
    marginBottom: spacing.xl,
    width: "100%",
  },
  statCard: {
    alignItems: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    minWidth: 90,
  },
  statValue: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  statLabel: {
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  actionRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.xl,
    width: "100%",
    justifyContent: "center",
  },
  actionButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 30, // Pill shape
    minWidth: 140,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonText: {
    fontWeight: fontWeight.bold,
    fontSize: fontSize.base,
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
    marginBottom: spacing.lg,
    justifyContent: "center",
  },
  tab: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 20,
  },
  tabText: {
    fontSize: fontSize.base,
  },
  tabContent: {
    paddingHorizontal: spacing.lg,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxl,
    gap: spacing.md,
  },
  emptyStateText: {
    fontSize: fontSize.md,
  },
  infoCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    gap: spacing.md,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  infoText: {
    fontSize: fontSize.base,
  },
  menuDropdown: {
    position: "absolute",
    top: 30,
    right: 0,
    width: 150,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    padding: spacing.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  menuItemText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
  },
});
