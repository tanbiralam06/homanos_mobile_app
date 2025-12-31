import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../utils/constants";

const SOCKET_URL = API_BASE_URL.replace("/api/v1", "");

class SocketService {
  constructor() {
    this.socket = null;
    this.pendingNotificationCallback = null;
  }

  async connect() {
    try {
      const token = await AsyncStorage.getItem("accessToken");

      if (!token) {
        throw new Error("No access token found");
      }

      this.socket = io(SOCKET_URL, {
        auth: {
          token,
        },
        transports: ["websocket"],
      });

      // Apply pending listeners
      if (this.pendingNotificationCallback) {
        this.socket.on(
          "private-message-notification",
          this.pendingNotificationCallback
        );
      }

      this.socket.on("connect", () => {
        console.log("Socket connected:", this.socket.id);
      });

      this.socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });

      this.socket.on("error", (error) => {
        console.error("Socket error:", error);
      });

      return this.socket;
    } catch (error) {
      console.error("Socket connection error:", error);
      throw error;
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinRoom(roomId, isAnonymous, displayName) {
    if (this.socket) {
      this.socket.emit("join-room", { roomId, isAnonymous, displayName });
    }
  }

  leaveRoom(roomId) {
    if (this.socket) {
      this.socket.emit("leave-room", { roomId });
    }
  }

  sendMessage(roomId, content) {
    if (this.socket) {
      this.socket.emit("send-message", { roomId, content });
    }
  }

  onNewMessage(callback) {
    if (this.socket) {
      this.socket.on("new-message", callback);
    }
  }

  onUserJoined(callback) {
    if (this.socket) {
      this.socket.on("user-joined", callback);
    }
  }

  onUserLeft(callback) {
    if (this.socket) {
      this.socket.on("user-left", callback);
    }
  }

  onUserTyping(callback) {
    if (this.socket) {
      this.socket.on("user-typing", callback);
    }
  }

  setTyping(roomId, isTyping) {
    if (this.socket) {
      this.socket.emit("typing", { roomId, isTyping });
    }
  }

  // --- PRIVATE CHAT METHODS ---

  joinPrivateChat(targetUserId) {
    if (this.socket) {
      this.socket.emit("join-private-chat", { targetUserId });
    }
  }

  leavePrivateChat(chatId) {
    if (this.socket) {
      this.socket.emit("leave-private-chat", { chatId });
    }
  }

  sendPrivateMessage(chatId, content) {
    if (this.socket) {
      this.socket.emit("send-private-message", { chatId, content });
    }
  }

  onPrivateChatInit(callback) {
    if (this.socket) {
      this.socket.on("private-chat-init", callback);
    }
  }

  onNewPrivateMessage(callback) {
    if (this.socket) {
      this.socket.on("new-private-message", callback);
    }
  }

  onPrivateMessageNotification(callback) {
    if (this.socket) {
      this.socket.on("private-message-notification", callback);
    } else {
      // Defer binding until connection
      this.pendingNotificationCallback = callback;
    }
  }

  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }

  isConnected() {
    return this.socket && this.socket.connected;
  }

  getSocket() {
    return this.socket;
  }
}

export default new SocketService();
