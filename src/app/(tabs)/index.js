import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import useAuthStore from "../../store/authStore";
import useChatroomStore from "../../store/chatroomStore";
import { useTheme } from "../../context/ThemeContext";
import { spacing, fontSize, fontWeight, borderRadius } from "../../utils/theme";

// Components
import ChatroomCard from "../../components/ChatroomCard";
import UserAvatar from "../../components/UserAvatar";
import SectionHeader from "../../components/SectionHeader";

export default function Home() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { chatrooms, fetchChatrooms, isLoading } = useChatroomStore();
  const [refreshing, setRefreshing] = useState(false);
  const { colors, isDark } = useTheme();

  // Mock data for stories/online users
  const onlineUsers = [
    { _id: "1", username: "alex_dev", avatar: null },
    { _id: "2", username: "sarah_ui", avatar: null },
    { _id: "3", username: "mike_js", avatar: null },
    { _id: "4", username: "emma_ux", avatar: null },
    { _id: "5", username: "david_native", avatar: null },
  ];

  // Mock data for activity feed
  const activities = [
    {
      id: "1",
      user: "Sarah UI",
      action: "created a new room",
      target: "Design Systems 101",
      time: "2m ago",
      icon: "add-circle-outline",
    },
    {
      id: "2",
      user: "Alex Dev",
      action: "joined",
      target: "React Native Performance",
      time: "15m ago",
      icon: "enter-outline",
    },
    {
      id: "3",
      user: "Mike JS",
      action: "is asking about",
      target: "Expo Router v3",
      time: "1h ago",
      icon: "help-circle-outline",
    },
  ];

  useEffect(() => {
    fetchChatrooms();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchChatrooms();
    setRefreshing(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>
            {getGreeting()},
          </Text>
          <Text style={[styles.username, { color: colors.textPrimary }]}>
            {user?.username || "Traveler"}
          </Text>
          <Text style={[styles.date, { color: colors.textSecondary }]}>
            {formattedDate}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push("/profile")}
          style={[styles.profileButton, { borderColor: colors.border }]}
        >
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.profileImage} />
          ) : (
            <Ionicons name="person" size={24} color={colors.textSecondary} />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Stories / Online Users */}
        <View style={styles.section}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.storiesContent}
          >
            <UserAvatar isOwnProfile user={user} onPress={() => {}} />
            {onlineUsers.map((u) => (
              <UserAvatar key={u._id} user={u} onPress={() => {}} />
            ))}
          </ScrollView>
        </View>

        {/* Happening Now (Active Chatrooms) */}
        <View style={styles.section}>
          <SectionHeader
            title="Happening Now"
            actionText="See All"
            onActionDiff={() => router.push("/discovery")}
          />
          {chatrooms.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
              snapToInterval={300} // Approximate width of card + margin
              decelerationRate="fast"
            >
              {chatrooms.slice(0, 5).map((room) => (
                <View
                  key={room._id}
                  style={{ width: 280, marginRight: spacing.md }}
                >
                  <ChatroomCard room={room} />
                </View>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyState}>
              <Text style={{ color: colors.textSecondary }}>
                No active rooms yet.
              </Text>
            </View>
          )}
        </View>

        {/* Activity Feed */}
        <View style={styles.section}>
          <SectionHeader title="Your Feed" />
          <View style={styles.feedList}>
            {activities.map((activity) => (
              <View
                key={activity.id}
                style={[
                  styles.feedItem,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.feedIcon,
                    { backgroundColor: colors.background },
                  ]}
                >
                  <Ionicons
                    name={activity.icon}
                    size={20}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.feedContent}>
                  <Text
                    style={[styles.feedText, { color: colors.textPrimary }]}
                  >
                    <Text style={{ fontWeight: "bold" }}>{activity.user}</Text>{" "}
                    {activity.action}{" "}
                    <Text style={{ fontWeight: "bold" }}>
                      {activity.target}
                    </Text>
                  </Text>
                  <Text
                    style={[styles.feedTime, { color: colors.textSecondary }]}
                  >
                    {activity.time}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => router.push("/(tabs)/create")}
      >
        <Ionicons name="add" size={32} color={colors.white} />
      </TouchableOpacity>
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
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    paddingBottom: spacing.sm,
  },
  greeting: {
    fontSize: fontSize.md,
  },
  username: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
  },
  date: {
    fontSize: fontSize.xs,
    marginTop: spacing.xs,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: spacing.xl,
  },
  storiesContent: {
    paddingHorizontal: spacing.xl,
  },
  horizontalList: {
    paddingHorizontal: spacing.xl,
  },
  emptyState: {
    paddingHorizontal: spacing.xl,
  },
  feedList: {
    paddingHorizontal: spacing.xl,
  },
  feedItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  feedIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  feedContent: {
    flex: 1,
  },
  feedText: {
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
  feedTime: {
    fontSize: fontSize.xs,
    marginTop: spacing.xs / 2,
  },
  fab: {
    position: "absolute",
    bottom: spacing.lg,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});
