/**
 * WebSocket Service for Real-time Messaging
 * Uses Socket.io client for real-time communication
 *
 * Events:
 * - Client → Server: joinConversation, sendMessage
 * - Server → Client: newMessage, messageSent, error
 */

import { io, Socket } from "socket.io-client";
import { getToken } from "../lib/api";

/** ===== TYPES ===== */
export interface WebSocketMessage {
  MessageId: string;
  ConversationId: string;
  SenderUserId: string;
  Content: string;
  Language?: string | null;
  CreatedAt: string;
  Sender: {
    FirstName: string;
    LastName1: string;
    LastName2?: string;
  };
}

export interface SendMessagePayload {
  conversationId: string;
  content: string;
  language?: string;
}

export interface JoinConversationPayload {
  conversationId: string;
}

/** ===== WEBSOCKET MANAGER ===== */
export class WebSocketManager {
  private socket: Socket | null = null;
  private url: string;

  constructor(url?: string) {
    // Default to backend URL from env
    this.url = url || import.meta.env.VITE_API_URL || "http://localhost:3000";
  }

  /**
   * Connect to WebSocket server
   */
  connect(): Socket {
    if (this.socket?.connected) {
      console.warn("[WEBSOCKET] Already connected");
      return this.socket;
    }

    const token = getToken();
    if (!token) {
      throw new Error("No authentication token found. Please login first.");
    }

    if (import.meta.env.DEV) {
      console.debug("[WEBSOCKET] Connecting to", this.url);
    }

    this.socket = io(this.url, {
      auth: {
        token: token,
      },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Connection events
    this.socket.on("connect", () => {
      if (import.meta.env.DEV) {
        console.debug("[WEBSOCKET] Connected with ID:", this.socket?.id);
      }
    });

    this.socket.on("disconnect", (reason) => {
      if (import.meta.env.DEV) {
        console.debug("[WEBSOCKET] Disconnected:", reason);
      }
    });

    this.socket.on("connect_error", (error) => {
      console.error("[WEBSOCKET] Connection error:", error.message);
    });

    return this.socket;
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (this.socket) {
      if (import.meta.env.DEV) {
        console.debug("[WEBSOCKET] Disconnecting");
      }
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * Join a conversation room
   */
  joinConversation(conversationId: string): void {
    if (!this.socket?.connected) {
      throw new Error("WebSocket not connected. Call connect() first.");
    }

    if (import.meta.env.DEV) {
      console.debug("[WEBSOCKET] Joining conversation:", conversationId);
    }

    this.socket.emit("joinConversation", { conversationId });
  }

  /**
   * Leave a conversation room
   */
  leaveConversation(conversationId: string): void {
    if (!this.socket?.connected) {
      return;
    }

    if (import.meta.env.DEV) {
      console.debug("[WEBSOCKET] Leaving conversation:", conversationId);
    }

    this.socket.emit("leaveConversation", { conversationId });
  }

  /**
   * Send a message
   */
  sendMessage(payload: SendMessagePayload): void {
    if (!this.socket?.connected) {
      throw new Error("WebSocket not connected. Call connect() first.");
    }

    if (import.meta.env.DEV) {
      console.debug("[WEBSOCKET] Sending message:", {
        conversationId: payload.conversationId,
        contentLength: payload.content.length,
      });
    }

    this.socket.emit("sendMessage", {
      conversationId: payload.conversationId,
      content: payload.content,
      language: payload.language || "es",
    });
  }

  /**
   * Listen for new messages
   */
  onNewMessage(callback: (message: WebSocketMessage) => void): void {
    if (!this.socket) {
      throw new Error("WebSocket not initialized. Call connect() first.");
    }

    this.socket.on("newMessage", callback);
  }

  /**
   * Listen for message sent confirmation
   */
  onMessageSent(callback: (message: WebSocketMessage) => void): void {
    if (!this.socket) {
      throw new Error("WebSocket not initialized. Call connect() first.");
    }

    this.socket.on("messageSent", callback);
  }

  /**
   * Listen for errors
   */
  onError(callback: (error: { message: string }) => void): void {
    if (!this.socket) {
      throw new Error("WebSocket not initialized. Call connect() first.");
    }

    this.socket.on("error", callback);
  }

  /**
   * Remove event listener
   */
  off(event: string, callback?: (...args: any[]) => void): void {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  /**
   * Get connection status
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  /**
   * Get socket instance (for advanced usage)
   */
  getSocket(): Socket | null {
    return this.socket;
  }
}

/** ===== SINGLETON INSTANCE ===== */
let websocketInstance: WebSocketManager | null = null;

/**
 * Get WebSocket singleton instance
 */
export function getWebSocketInstance(): WebSocketManager {
  if (!websocketInstance) {
    websocketInstance = new WebSocketManager();
  }
  return websocketInstance;
}

/**
 * Destroy WebSocket singleton instance
 */
export function destroyWebSocketInstance(): void {
  if (websocketInstance) {
    websocketInstance.disconnect();
    websocketInstance = null;
  }
}

/** ===== HELPER FUNCTIONS ===== */

/**
 * Quick connect and join a conversation
 */
export function connectAndJoin(conversationId: string): WebSocketManager {
  const ws = getWebSocketInstance();
  ws.connect();
  ws.joinConversation(conversationId);
  return ws;
}

/**
 * Send a message quickly
 */
export function quickSendMessage(
  conversationId: string,
  content: string,
  language?: string
): void {
  const ws = getWebSocketInstance();
  if (!ws.isConnected()) {
    ws.connect();
  }
  ws.sendMessage({ conversationId, content, language });
}
