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
import { useTheme } from "../../context/ThemeContext";
import { spacing, fontSize, fontWeight, borderRadius } from "../../utils/theme";

export default function ChatroomScreen() {
  const router = useRouter();
  const { roomId } = useLocalSearchParams();
  const user = useAuthStore((state) => state.user);
  const { colors } = useTheme();

  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showJoinModal, setShowJoinModal] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const flatListRef = useRef(null);

  const connectToRoom = async (roomId, username, anonymous) => {
    try {
      // Connect socket if not connected
      if (!socketService.isConnected()) {
        await socketService.connect();
      }

      // Join socket room
      socketService.joinRoom(roomId, anonymous, username);

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
    } catch (error) {
      console.error("Error connecting to room:", error);
    }
  };

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

      // Check if user is already a participant
      const isParticipant = roomData.participants.some(
        (p) => p.userId.toString() === user._id.toString()
      );

      if (isParticipant) {
        setDisplayName(user.username);
        setIsJoined(true);
        setShowJoinModal(false);
        connectToRoom(roomData._id, user.username, false);
      } else {
        setShowJoinModal(true);
      }
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

      await connectToRoom(roomId, joinData.displayName, anonymous);

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
          <Text
            style={[styles.messageUsername, { color: colors.textSecondary }]}
          >
            {item.username}
            {item.isAnonymous && " 👤"}
          </Text>
        )}
        <View
          style={[
            styles.messageBubble,
            isOwnMessage
              ? {
                  backgroundColor: colors.primary,
                  borderBottomRightRadius: spacing.xs,
                }
              : {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderWidth: 1,
                  borderBottomLeftRadius: spacing.xs,
                },
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isOwnMessage
                ? { color: colors.white }
                : { color: colors.textPrimary },
            ]}
          >
            {item.content}
          </Text>
        </View>
        <Text style={[styles.messageTime, { color: colors.textSecondary }]}>
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

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top", "bottom"]}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: colors.surface, borderBottomColor: colors.border },
        ]}
      >
        <TouchableOpacity onPress={() => handleLeave()}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={[styles.roomName, { color: colors.primary }]}>
            {room?.name}
          </Text>
          <Text style={[styles.roomTopic, { color: colors.textSecondary }]}>
            {room?.topic}
          </Text>
        </View>
        <TouchableOpacity>
          <Ionicons
            name="information-circle-outline"
            size={24}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
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
          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: colors.surface,
                borderTopColor: colors.border,
              },
            ]}
          >
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.background,
                  color: colors.textPrimary,
                },
              ]}
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
                { backgroundColor: colors.primary },
                !inputText.trim() && { backgroundColor: colors.border },
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
        )}
      </KeyboardAvoidingView>

      {/* Join Modal */}
      <Modal
        visible={showJoinModal}
        transparent
        animationType="slide"
        onRequestClose={() => router.back()}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalContent, { backgroundColor: colors.surface }]}
          >
            <Text style={[styles.modalTitle, { color: colors.primary }]}>
              Join Chat Room
            </Text>
            <Text
              style={[styles.modalSubtitle, { color: colors.textSecondary }]}
            >
              How would you like to join?
            </Text>

            <TouchableOpacity
              style={[
                styles.joinOption,
                { backgroundColor: colors.background },
              ]}
              onPress={() => handleJoin(false)}
            >
              <Ionicons name="person" size={32} color={colors.primary} />
              <View style={styles.joinOptionContent}>
                <Text
                  style={[
                    styles.joinOptionTitle,
                    { color: colors.textPrimary },
                  ]}
                >
                  Join as {user?.username}
                </Text>
                <Text
                  style={[
                    styles.joinOptionText,
                    { color: colors.textSecondary },
                  ]}
                >
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
              style={[
                styles.joinOption,
                { backgroundColor: colors.background },
              ]}
              onPress={() => handleJoin(true)}
            >
              <Ionicons name="eye-off" size={32} color={colors.secondary} />
              <View style={styles.joinOptionContent}>
                <Text
                  style={[
                    styles.joinOptionTitle,
                    { color: colors.textPrimary },
                  ]}
                >
                  Join Anonymously
                </Text>
                <Text
                  style={[
                    styles.joinOptionText,
                    { color: colors.textSecondary },
                  ]}
                >
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
              <Text
                style={[
                  styles.cancelButtonText,
                  { color: colors.textSecondary },
                ]}
              >
                Cancel
              </Text>
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  headerContent: {
    flex: 1,
    marginHorizontal: spacing.md,
  },
  roomName: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  roomTopic: {
    fontSize: fontSize.sm,
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
    marginBottom: spacing.xs / 2,
    marginLeft: spacing.sm,
  },
  messageBubble: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    maxWidth: "100%",
  },
  messageText: {
    fontSize: fontSize.base,
    lineHeight: 20,
  },
  messageTime: {
    fontSize: fontSize.xs,
    marginTop: spacing.xs / 2,
    marginHorizontal: spacing.sm,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: spacing.md,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fontSize.base,
    maxHeight: 100,
    marginRight: spacing.sm,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
    padding: spacing.xl,
  },
  modalTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.sm,
  },
  modalSubtitle: {
    fontSize: fontSize.base,
    marginBottom: spacing.xl,
  },
  joinOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
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
    marginBottom: spacing.xs / 2,
  },
  joinOptionText: {
    fontSize: fontSize.sm,
  },
  cancelButton: {
    padding: spacing.md,
    alignItems: "center",
    marginTop: spacing.md,
  },
  cancelButtonText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
});
