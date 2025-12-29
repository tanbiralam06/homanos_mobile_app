import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { universalSearch } from "../../services/chatroomService";
import { useTheme } from "../../context/ThemeContext";
import { spacing, fontSize, fontWeight, borderRadius } from "../../utils/theme";

export default function Search() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState({ people: [], chatrooms: [] });
  const [isLoading, setIsLoading] = useState(false);
  const { colors } = useTheme();

  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setResults({ people: [], chatrooms: [] });
      return;
    }

    setIsLoading(true);
    try {
      const data = await universalSearch(query.trim());
      setResults(data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderPerson = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.resultItem,
        { backgroundColor: colors.surface, borderBottomColor: colors.border },
      ]}
      onPress={() => router.push(`/user/${item._id}`)}
    >
      <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
        <Ionicons name="person" size={24} color={colors.white} />
      </View>
      <View style={styles.resultContent}>
        <Text style={[styles.resultTitle, { color: colors.textPrimary }]}>
          {item.fullName || item.username}
        </Text>
        <Text style={[styles.resultSubtitle, { color: colors.textSecondary }]}>
          @{item.username}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  const renderChatroom = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.resultItem,
        { backgroundColor: colors.surface, borderBottomColor: colors.border },
      ]}
      onPress={() => router.push(`/chatroom/${item._id}`)}
    >
      <View
        style={[
          styles.avatar,
          styles.chatroomAvatar,
          { backgroundColor: colors.secondary },
        ]}
      >
        <Ionicons name="chatbubbles" size={24} color={colors.white} />
      </View>
      <View style={styles.resultContent}>
        <Text style={[styles.resultTitle, { color: colors.textPrimary }]}>
          {item.name}
        </Text>
        <Text style={[styles.resultSubtitle, { color: colors.textSecondary }]}>
          {item.topic} • {item.participantCount} people
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    if (!searchQuery) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="search-outline" size={64} color={colors.border} />
          <Text
            style={[styles.emptyStateText, { color: colors.textSecondary }]}
          >
            Search for people or rooms
          </Text>
          <Text
            style={[styles.emptyStateSubtext, { color: colors.textSecondary }]}
          >
            Find and connect with others
          </Text>
        </View>
      );
    }

    if (results.people.length === 0 && results.chatrooms.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="sad-outline" size={64} color={colors.border} />
          <Text
            style={[styles.emptyStateText, { color: colors.textSecondary }]}
          >
            No results found
          </Text>
          <Text
            style={[styles.emptyStateSubtext, { color: colors.textSecondary }]}
          >
            Try a different search term
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <View
        style={[
          styles.searchContainer,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Ionicons
          name="search"
          size={20}
          color={colors.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          style={[styles.searchInput, { color: colors.textPrimary }]}
          placeholder="Search people, rooms..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={handleSearch}
          autoCapitalize="none"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch("")}>
            <Ionicons
              name="close-circle"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {renderEmptyState()}

      {!isLoading &&
        (results.people.length > 0 || results.chatrooms.length > 0) && (
          <FlatList
            style={styles.resultsList}
            data={[
              ...(results.chatrooms.length > 0
                ? [{ type: "chatroom-header" }]
                : []),
              ...results.chatrooms.map((room) => ({
                type: "chatroom",
                data: room,
              })),
              ...(results.people.length > 0 ? [{ type: "people-header" }] : []),
              ...results.people.map((person) => ({
                type: "person",
                data: person,
              })),
            ]}
            keyExtractor={(item, index) => `${item.type}-${index}`}
            renderItem={({ item }) => {
              if (item.type === "chatroom-header") {
                return (
                  <Text
                    style={[
                      styles.sectionHeader,
                      {
                        color: colors.textSecondary,
                        backgroundColor: colors.background,
                      },
                    ]}
                  >
                    Chat Rooms
                  </Text>
                );
              }
              if (item.type === "people-header") {
                return (
                  <Text
                    style={[
                      styles.sectionHeader,
                      {
                        color: colors.textSecondary,
                        backgroundColor: colors.background,
                      },
                    ]}
                  >
                    People
                  </Text>
                );
              }
              if (item.type === "chatroom") {
                return renderChatroom({ item: item.data });
              }
              if (item.type === "person") {
                return renderPerson({ item: item.data });
              }
            }}
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: fontSize.base,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  emptyStateText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    marginTop: spacing.lg,
  },
  emptyStateSubtext: {
    fontSize: fontSize.base,
    marginTop: spacing.xs,
  },
  resultsList: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderBottomWidth: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  chatroomAvatar: {
    // backgroundColor: colors.secondary, // Dynamic now
  },
  resultContent: {
    flex: 1,
  },
  resultTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.xs / 2,
  },
  resultSubtitle: {
    fontSize: fontSize.sm,
  },
});
