import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import useAuthStore from "../../store/authStore";
import useProfileStore from "../../store/profileStore";
import { useCallback, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { spacing, fontSize, fontWeight, borderRadius } from "../../utils/theme";
import { Svg, Circle } from "react-native-svg";

export default function Profile() {
  const user = useAuthStore((state) => state.user);
  const { profile, fetchProfile } = useProfileStore();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState("moments");
  const [showCompletion, setShowCompletion] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [])
  );

  const handleMenuPress = () => {
    router.push("/settings");
  };

  const renderStat = (label, value, route) => (
    <TouchableOpacity
      style={[styles.statCard, { backgroundColor: colors.surface }]}
      onPress={() =>
        route &&
        router.push({
          pathname: route,
          params: { userId: user?._id || profile?.owner?._id },
        })
      }
    >
      <Text style={[styles.statValue, { color: colors.primary }]}>
        {value || 0}
      </Text>
      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const CircularProgress = ({ size, strokeWidth, progress, color }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle
          stroke={colors.border}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke={color}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
    );
  };

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
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          My Identity
        </Text>
        <TouchableOpacity onPress={handleMenuPress} style={styles.menuButton}>
          <Ionicons
            name="settings-outline"
            size={24}
            color={colors.textPrimary}
          />
        </TouchableOpacity>
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
            <TouchableOpacity
              style={[
                styles.editAvatarBadge,
                { backgroundColor: colors.primary },
              ]}
              onPress={() => router.push("/profile/edit")}
            >
              <Ionicons name="pencil" size={14} color={colors.white} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.fullName, { color: colors.textPrimary }]}>
            {profile?.fullName || user?.username || "Traveler"}
          </Text>
          <Text style={[styles.username, { color: colors.textSecondary }]}>
            @{user?.username || "username"}
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

          {/* Profile Completion Compact */}
          {(() => {
            const fields = [
              profile?.avatar,
              profile?.bio,
              profile?.locationName,
              profile?.occupation,
              profile?.birthday,
              profile?.gender,
              profile?.intent,
              profile?.educationLevel,
              profile?.interests?.length,
              profile?.languages?.length,
            ];
            const filled = fields.filter((f) => f).length;
            const total = fields.length;
            const percent = Math.round((filled / total) * 100);

            if (percent < 100 && showCompletion) {
              return (
                <View
                  style={[
                    styles.completionCompact,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <View style={styles.completionLeft}>
                    <CircularProgress
                      size={40}
                      strokeWidth={4}
                      progress={percent}
                      color={colors.primary}
                    />
                    <View style={styles.completionInfo}>
                      <Text
                        style={[
                          styles.completionTitleCompact,
                          { color: colors.textPrimary },
                        ]}
                      >
                        Profile Completion
                      </Text>
                      <Text
                        style={[
                          styles.completionPercentCompact,
                          { color: colors.primary },
                        ]}
                      >
                        {percent}% Complete
                      </Text>
                    </View>
                  </View>

                  <View style={styles.completionRight}>
                    <TouchableOpacity
                      style={[
                        styles.completeButtonCompact,
                        { backgroundColor: colors.primary },
                      ]}
                      onPress={() => router.push("/profile/edit")}
                    >
                      <Text style={styles.completeButtonTextCompact}>
                        Complete
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setShowCompletion(false)}
                      style={styles.closeButton}
                    >
                      <Ionicons
                        name="close"
                        size={20}
                        color={colors.textSecondary}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }
            return null;
          })()}
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
                No moments captured yet.
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
                  Joined {new Date().getFullYear()}
                </Text>
              </View>
              {profile?.locationName ? (
                <View style={styles.infoRow}>
                  <Ionicons
                    name="location-outline"
                    size={20}
                    color={colors.textSecondary}
                  />
                  <Text
                    style={[styles.infoText, { color: colors.textSecondary }]}
                  >
                    {profile.locationName}
                  </Text>
                </View>
              ) : null}
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
  editAvatarBadge: {
    position: "absolute",
    bottom: 5,
    right: 5,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
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
    // Add shadow/elevation if desired
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
  },
  actionButtonText: {
    fontWeight: fontWeight.bold,
    fontSize: fontSize.base,
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
  },
  outlineButtonText: {
    // color inherited
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
  infoText: {
    fontSize: fontSize.base,
  },
  // Compact Completion Styles
  completionCompact: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    marginBottom: spacing.xl,
  },
  completionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  completionInfo: {
    justifyContent: "center",
  },
  completionTitleCompact: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  completionPercentCompact: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  completionRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  completeButtonCompact: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  completeButtonTextCompact: {
    color: "#fff",
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  closeButton: {
    padding: 4,
  },
});
