import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import useAuthStore from "../../store/authStore";
import useChatroomStore from "../../store/chatroomStore";
import { useTheme } from "../../context/ThemeContext";
import { spacing, fontSize, fontWeight, borderRadius } from "../../utils/theme";

export default function Home() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { chatrooms, fetchChatrooms, isLoading } = useChatroomStore();
  const [refreshing, setRefreshing] = useState(false);
  const { colors } = useTheme();

  useEffect(() => {
    fetchChatrooms();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchChatrooms();
    setRefreshing(false);
  };

  const renderChatroomCard = (room) => (
    <TouchableOpacity
      key={room._id}
      style={[
        styles.chatroomCard,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
      onPress={() => router.push(`/chatroom/${room._id}`)}
    >
      <View
        style={[styles.chatroomIcon, { backgroundColor: colors.secondary }]}
      >
        <Ionicons name="chatbubbles" size={24} color={colors.white} />
      </View>
      <View style={styles.chatroomContent}>
        <Text style={[styles.chatroomName, { color: colors.textPrimary }]}>
          {room.name}
        </Text>
        <Text style={[styles.chatroomTopic, { color: colors.textSecondary }]}>
          {room.topic}
        </Text>
        <View style={styles.chatroomMeta}>
          <Ionicons name="people" size={14} color={colors.textSecondary} />
          <Text
            style={[styles.chatroomMetaText, { color: colors.textSecondary }]}
          >
            {room.participantCount || 0} people
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
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
        <View>
          <Text style={[styles.logo, { color: colors.primary }]}>Human OS</Text>
          <Text style={[styles.tagline, { color: colors.textSecondary }]}>
            Real life first.
          </Text>
        </View>
        <TouchableOpacity onPress={() => router.push("/create-room")}>
          <Ionicons name="add-circle" size={32} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Content */}
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
        {/* Welcome Card */}
        <View
          style={[
            styles.welcomeCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.welcomeTitle, { color: colors.primary }]}>
            Welcome, {user?.username || "User"}!
          </Text>
          <Text style={[styles.welcomeText, { color: colors.textSecondary }]}>
            Join a chat room or create your own to connect with people
          </Text>
        </View>

        {/* Trending Rooms */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              🔥 Active Rooms
            </Text>
            {chatrooms.length > 0 && (
              <Text
                style={[
                  styles.sectionCount,
                  {
                    color: colors.textSecondary,
                    backgroundColor: colors.background,
                  },
                ]}
              >
                {chatrooms.length}
              </Text>
            )}
          </View>

          {isLoading && !refreshing ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : chatrooms.length > 0 ? (
            chatrooms.map(renderChatroomCard)
          ) : (
            <View style={styles.emptyState}>
              <Ionicons
                name="chatbubbles-outline"
                size={48}
                color={colors.border}
              />
              <Text
                style={[styles.emptyStateText, { color: colors.textSecondary }]}
              >
                No active rooms
              </Text>
              <Text
                style={[
                  styles.emptyStateSubtext,
                  { color: colors.textSecondary },
                ]}
              >
                Be the first to create one!
              </Text>
              <TouchableOpacity
                style={[
                  styles.createButton,
                  { backgroundColor: colors.primary },
                ]}
                onPress={() => router.push("/create-room")}
              >
                <Text
                  style={[styles.createButtonText, { color: colors.white }]}
                >
                  Create Room
                </Text>
              </TouchableOpacity>
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
    borderBottomWidth: 1,
  },
  logo: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
  },
  tagline: {
    fontSize: fontSize.sm,
    marginTop: spacing.xs / 2,
  },
  content: {
    flex: 1,
  },
  welcomeCard: {
    margin: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  welcomeTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.sm,
  },
  welcomeText: {
    fontSize: fontSize.base,
    lineHeight: 22,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  sectionCount: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.sm,
  },
  chatroomCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  chatroomIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  chatroomContent: {
    flex: 1,
  },
  chatroomName: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.xs / 2,
  },
  chatroomTopic: {
    fontSize: fontSize.sm,
    marginBottom: spacing.xs,
  },
  chatroomMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs / 2,
  },
  chatroomMetaText: {
    fontSize: fontSize.xs,
  },
  loadingContainer: {
    paddingVertical: spacing.xxl,
    alignItems: "center",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
  },
  emptyStateText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    marginTop: spacing.md,
  },
  emptyStateSubtext: {
    fontSize: fontSize.base,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  createButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  createButtonText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
});
