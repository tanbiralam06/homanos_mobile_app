import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SOCKET_URL = "http://localhost:8000";

class SocketService {
  constructor() {
    this.socket = null;
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

  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }

  isConnected() {
    return this.socket && this.socket.connected;
  }
}

export default new SocketService();
