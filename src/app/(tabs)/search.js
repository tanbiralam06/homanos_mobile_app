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
import {
  colors,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
} from "../../utils/theme";

export default function Search() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState({ people: [], chatrooms: [] });
  const [isLoading, setIsLoading] = useState(false);

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
      style={styles.resultItem}
      onPress={() => router.push(`/user/${item._id}`)}
    >
      <View style={styles.avatar}>
        <Ionicons name="person" size={24} color={colors.white} />
      </View>
      <View style={styles.resultContent}>
        <Text style={styles.resultTitle}>{item.fullName || item.username}</Text>
        <Text style={styles.resultSubtitle}>@{item.username}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  const renderChatroom = ({ item }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => router.push(`/chatroom/${item._id}`)}
    >
      <View style={[styles.avatar, styles.chatroomAvatar]}>
        <Ionicons name="chatbubbles" size={24} color={colors.white} />
      </View>
      <View style={styles.resultContent}>
        <Text style={styles.resultTitle}>{item.name}</Text>
        <Text style={styles.resultSubtitle}>
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
          <Text style={styles.emptyStateText}>Search for people or rooms</Text>
          <Text style={styles.emptyStateSubtext}>
            Find and connect with others
          </Text>
        </View>
      );
    }

    if (results.people.length === 0 && results.chatrooms.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="sad-outline" size={64} color={colors.border} />
          <Text style={styles.emptyStateText}>No results found</Text>
          <Text style={styles.emptyStateSubtext}>
            Try a different search term
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={colors.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
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
                return <Text style={styles.sectionHeader}>Chat Rooms</Text>;
              }
              if (item.type === "people-header") {
                return <Text style={styles.sectionHeader}>People</Text>;
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
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: spacing.lg,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: fontSize.base,
    color: colors.textPrimary,
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
    color: colors.textSecondary,
    marginTop: spacing.lg,
  },
  emptyStateSubtext: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  resultsList: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.textSecondary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  chatroomAvatar: {
    backgroundColor: colors.secondary,
  },
  resultContent: {
    flex: 1,
  },
  resultTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs / 2,
  },
  resultSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
});
