import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect, useRef } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  getChatroomDetails,
  joinChatroom,
  leaveChatroom,
  getChatroomMessages,
} from "../../services/chatroomService";
import socketService from "../../services/socketService";
import useAuthStore from "../../store/authStore";
import {
  colors,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
} from "../../utils/theme";

export default function ChatroomScreen() {
  const router = useRouter();
  const { roomId } = useLocalSearchParams();
  const user = useAuthStore((state) => state.user);

  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showJoinModal, setShowJoinModal] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const flatListRef = useRef(null);

  useEffect(() => {
    loadChatroom();

    return () => {
      if (isJoined) {
        handleLeave(false);
      }
    };
  }, []);

  const loadChatroom = async () => {
    try {
      const roomData = await getChatroomDetails(roomId);
      setRoom(roomData);

      const messagesData = await getChatroomMessages(roomId);
      setMessages(messagesData.reverse());

      setIsLoading(false);
    } catch (error) {
      console.error("Error loading chatroom:", error);
      Alert.alert("Error", "Failed to load chatroom");
      router.back();
    }
  };

  const handleJoin = async (anonymous) => {
    try {
      setIsAnonymous(anonymous);

      // Join via API
      const joinData = await joinChatroom(roomId, anonymous);
      setDisplayName(joinData.displayName);

      // Connect socket if not connected
      if (!socketService.isConnected()) {
        await socketService.connect();
      }

      // Join socket room
      socketService.joinRoom(roomId, anonymous, joinData.displayName);

      // Listen for new messages
      socketService.onNewMessage((message) => {
        setMessages((prev) => [...prev, message]);
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      });

      // Listen for user joined
      socketService.onUserJoined((data) => {
        console.log(`${data.username} joined`);
      });

      // Listen for user left
      socketService.onUserLeft((data) => {
        console.log(`${data.username} left`);
      });

      setIsJoined(true);
      setShowJoinModal(false);
    } catch (error) {
      console.error("Error joining room:", error);
      Alert.alert("Error", "Failed to join room");
    }
  };

  const handleLeave = async (navigate = true) => {
    try {
      socketService.leaveRoom(roomId);
      socketService.removeAllListeners();
      await leaveChatroom(roomId);

      if (navigate) {
        router.back();
      }
    } catch (error) {
      console.error("Error leaving room:", error);
    }
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    socketService.sendMessage(roomId, inputText.trim());
    setInputText("");
  };

  const renderMessage = ({ item }) => {
    const isOwnMessage = item.username === displayName;

    return (
      <View
        style={[
          styles.messageContainer,
          isOwnMessage ? styles.ownMessage : styles.otherMessage,
        ]}
      >
        {!isOwnMessage && (
          <Text style={styles.messageUsername}>
            {item.username}
            {item.isAnonymous && " 👤"}
          </Text>
        )}
        <View
          style={[
            styles.messageBubble,
            isOwnMessage ? styles.ownBubble : styles.otherBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isOwnMessage ? styles.ownMessageText : styles.otherMessageText,
            ]}
          >
            {item.content}
          </Text>
        </View>
        <Text style={styles.messageTime}>
          {new Date(item.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => handleLeave()}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.roomName}>{room?.name}</Text>
          <Text style={styles.roomTopic}>{room?.topic}</Text>
        </View>
        <TouchableOpacity>
          <Ionicons
            name="information-circle-outline"
            size={24}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => item._id || index.toString()}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
      />

      {/* Input */}
      {isJoined && (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              placeholderTextColor={colors.textSecondary}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                !inputText.trim() && styles.sendButtonDisabled,
              ]}
              onPress={handleSendMessage}
              disabled={!inputText.trim()}
            >
              <Ionicons
                name="send"
                size={20}
                color={inputText.trim() ? colors.white : colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}

      {/* Join Modal */}
      <Modal
        visible={showJoinModal}
        transparent
        animationType="slide"
        onRequestClose={() => router.back()}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Join Chat Room</Text>
            <Text style={styles.modalSubtitle}>
              How would you like to join?
            </Text>

            <TouchableOpacity
              style={styles.joinOption}
              onPress={() => handleJoin(false)}
            >
              <Ionicons name="person" size={32} color={colors.primary} />
              <View style={styles.joinOptionContent}>
                <Text style={styles.joinOptionTitle}>
                  Join as {user?.username}
                </Text>
                <Text style={styles.joinOptionText}>
                  Your profile will be visible
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.joinOption}
              onPress={() => handleJoin(true)}
            >
              <Ionicons name="eye-off" size={32} color={colors.secondary} />
              <View style={styles.joinOptionContent}>
                <Text style={styles.joinOptionTitle}>Join Anonymously</Text>
                <Text style={styles.joinOptionText}>
                  You'll get a random guest name
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => router.back()}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerContent: {
    flex: 1,
    marginHorizontal: spacing.md,
  },
  roomName: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  roomTopic: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  messagesList: {
    padding: spacing.md,
  },
  messageContainer: {
    marginBottom: spacing.md,
    maxWidth: "80%",
  },
  ownMessage: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  otherMessage: {
    alignSelf: "flex-start",
    alignItems: "flex-start",
  },
  messageUsername: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginBottom: spacing.xs / 2,
    marginLeft: spacing.sm,
  },
  messageBubble: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    maxWidth: "100%",
  },
  ownBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: spacing.xs,
  },
  otherBubble: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomLeftRadius: spacing.xs,
  },
  messageText: {
    fontSize: fontSize.base,
    lineHeight: 20,
  },
  ownMessageText: {
    color: colors.white,
  },
  otherMessageText: {
    color: colors.textPrimary,
  },
  messageTime: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs / 2,
    marginHorizontal: spacing.sm,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fontSize.base,
    color: colors.textPrimary,
    maxHeight: 100,
    marginRight: spacing.sm,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    backgroundColor: colors.border,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
    padding: spacing.xl,
  },
  modalTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  modalSubtitle: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  joinOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  joinOptionContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  joinOptionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs / 2,
  },
  joinOptionText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  cancelButton: {
    padding: spacing.md,
    alignItems: "center",
    marginTop: spacing.md,
  },
  cancelButtonText: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
    fontWeight: fontWeight.semibold,
  },
});
