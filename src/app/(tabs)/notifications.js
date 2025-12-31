import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import useNotificationStore from "../../store/notificationStore";
import { useTheme } from "../../context/ThemeContext";
import { spacing, fontSize, fontWeight, borderRadius } from "../../utils/theme";
import socketService from "../../services/socketService";

export default function NotificationsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const {
    notifications,
    loading,
    fetchNotifications,
    markRead,
    markAllRead,
    hasMore,
    initializeSocketListener,
  } = useNotificationStore();

  useFocusEffect(
    useCallback(() => {
      fetchNotifications(true);
      // Initialize socket listener when screen is focused (or app is active)
      // Ideally this is done globally, but doing it here ensures we catch updates.
      // Better: Global listener in Layout, but this is fine for now.
      if (socketService.isConnected()) {
        initializeSocketListener();
      }
    }, [])
  );

  const handlePress = async (notification) => {
    if (!notification.isRead) {
      markRead(notification._id);
    }

    // Navigate based on type
    if (notification.type === "FOLLOW" && notification.sender) {
      router.push(`/user/${notification.sender._id}`);
    } else if (notification.type === "NEARBY") {
      router.push("/discovery");
    } else if (notification.type === "MESSAGE") {
      router.push({
        pathname: "/private-chat/[userId]",
        params: {
          userId: notification.sender._id,
          username: notification.sender.username,
        },
      });
    }
  };

  const renderItem = ({ item }) => {
    const isFollow = item.type === "FOLLOW";
    const isNearby = item.type === "NEARBY";
    const isMessage = item.type === "MESSAGE";
    const sender = item.sender;

    return (
      <TouchableOpacity
        style={[
          styles.notificationItem,
          {
            backgroundColor: item.isRead
              ? colors.background
              : colors.primary + "10", // Highlight unread
          },
        ]}
        onPress={() => handlePress(item)}
      >
        <View style={styles.iconContainer}>
          {sender?.avatar ? (
            <Image source={{ uri: sender.avatar }} style={styles.avatar} />
          ) : (
            <View
              style={[
                styles.defaultIcon,
                {
                  backgroundColor: isFollow
                    ? colors.primary
                    : isMessage
                    ? "#2196F3"
                    : colors.secondary,
                },
              ]}
            >
              <Ionicons
                name={
                  isFollow
                    ? "person-add"
                    : isMessage
                    ? "chatbubble-ellipses"
                    : "navigate"
                }
                size={20}
                color="#fff"
              />
            </View>
          )}
          {/* Badge Icon overlay */}
          <View
            style={[
              styles.typeBadge,
              {
                backgroundColor: isFollow
                  ? colors.primary
                  : isMessage
                  ? "#2196F3"
                  : colors.secondary,
              },
            ]}
          >
            <Ionicons
              name={
                isFollow
                  ? "person-add"
                  : isMessage
                  ? "chatbubble-ellipses"
                  : "navigate"
              }
              size={10}
              color="#fff"
            />
          </View>
        </View>

        <View style={styles.contentContainer}>
          <Text style={[styles.messageText, { color: colors.textPrimary }]}>
            <Text style={{ fontWeight: fontWeight.bold }}>
              {sender?.username || "System"}
            </Text>{" "}
            {item.type === "MESSAGE"
              ? item.groupCount > 1
                ? `sent ${item.groupCount} messages`
                : "sent you a message"
              : item.message}
          </Text>
          <Text style={[styles.timeText, { color: colors.textSecondary }]}>
            {new Date(item.createdAt).toLocaleDateString()}{" "}
            {new Date(item.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>

        {!item.isRead && (
          <View
            style={[styles.unreadDot, { backgroundColor: colors.primary }]}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Notifications
        </Text>
        <TouchableOpacity onPress={markAllRead}>
          <Text style={[styles.markReadText, { color: colors.primary }]}>
            Mark all read
          </Text>
        </TouchableOpacity>
      </View>

      {loading && notifications.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => fetchNotifications(true)}
              colors={[colors.primary]}
            />
          }
          ListFooterComponent={
            hasMore && !loading ? (
              <TouchableOpacity
                onPress={() => fetchNotifications(false)}
                style={{
                  padding: spacing.md,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: colors.primary,
                    fontWeight: fontWeight.semibold,
                    fontSize: fontSize.sm,
                  }}
                >
                  View older notifications
                </Text>
              </TouchableOpacity>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="notifications-off-outline"
                size={48}
                color={colors.textSecondary}
              />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No notifications yet
              </Text>
            </View>
          }
        />
      )}
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
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  markReadText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingBottom: spacing.xxl,
  },
  notificationItem: {
    flexDirection: "row",
    padding: spacing.md,
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },
  iconContainer: {
    position: "relative",
    marginRight: spacing.md,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  defaultIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  typeBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
  },
  messageText: {
    fontSize: fontSize.base,
    lineHeight: 20,
    marginBottom: 4,
  },
  timeText: {
    fontSize: fontSize.xs,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: spacing.sm,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxl * 2,
    gap: spacing.md,
  },
  emptyText: {
    fontSize: fontSize.md,
  },
});
