/**
 * React hook for WebSocket real-time messaging
 */

import { useEffect, useState, useCallback, useRef } from "react";
import {
  WebSocketManager,
  getWebSocketInstance,
  type WebSocketMessage,
  type SendMessagePayload,
} from "../services/websocket";

interface UseWebSocketOptions {
  conversationId: string;
  autoConnect?: boolean;
  onNewMessage?: (message: WebSocketMessage) => void;
  onMessageSent?: (message: WebSocketMessage) => void;
  onError?: (error: { message: string }) => void;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  messages: WebSocketMessage[];
  sendMessage: (content: string, language?: string) => void;
  connect: () => void;
  disconnect: () => void;
  clearMessages: () => void;
}

/**
 * React hook for WebSocket real-time messaging
 *
 * @example
 * const { messages, sendMessage, isConnected } = useWebSocket({
 *   conversationId: '123',
 *   autoConnect: true,
 * });
 */
export function useWebSocket(options: UseWebSocketOptions): UseWebSocketReturn {
  const {
    conversationId,
    autoConnect = true,
    onNewMessage,
    onMessageSent,
    onError,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const wsRef = useRef<WebSocketManager | null>(null);

  // Initialize WebSocket
  useEffect(() => {
    wsRef.current = getWebSocketInstance();

    return () => {
      // Cleanup on unmount
      if (wsRef.current) {
        wsRef.current.leaveConversation(conversationId);
      }
    };
  }, [conversationId]);

  // Connect function
  const connect = useCallback(() => {
    if (!wsRef.current) return;

    try {
      const socket = wsRef.current.connect();

      socket.on("connect", () => {
        setIsConnected(true);
        // Join conversation on connect
        wsRef.current?.joinConversation(conversationId);
      });

      socket.on("disconnect", () => {
        setIsConnected(false);
      });

      // Listen for new messages
      wsRef.current.onNewMessage((message) => {
        if (message.ConversationId === conversationId) {
          setMessages((prev) => [...prev, message]);
          onNewMessage?.(message);
        }
      });

      // Listen for message sent confirmation
      wsRef.current.onMessageSent((message) => {
        onMessageSent?.(message);
      });

      // Listen for errors
      wsRef.current.onError((error) => {
        console.error("[WEBSOCKET] Error:", error.message);
        onError?.(error);
      });
    } catch (error: any) {
      console.error("[WEBSOCKET] Connection failed:", error.message);
    }
  }, [conversationId, onNewMessage, onMessageSent, onError]);

  // Disconnect function
  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.leaveConversation(conversationId);
      wsRef.current.disconnect();
      setIsConnected(false);
    }
  }, [conversationId]);

  // Send message function
  const sendMessage = useCallback(
    (content: string, language?: string) => {
      if (!wsRef.current?.isConnected()) {
        console.error("[WEBSOCKET] Cannot send message: not connected");
        return;
      }

      wsRef.current.sendMessage({
        conversationId,
        content,
        language,
      });
    },
    [conversationId]
  );

  // Clear messages
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  return {
    isConnected,
    messages,
    sendMessage,
    connect,
    disconnect,
    clearMessages,
  };
}

/**
 * Simpler hook that only manages connection state
 */
export function useWebSocketConnection(autoConnect = true) {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocketManager | null>(null);

  useEffect(() => {
    wsRef.current = getWebSocketInstance();

    if (autoConnect) {
      const socket = wsRef.current.connect();
      socket.on("connect", () => setIsConnected(true));
      socket.on("disconnect", () => setIsConnected(false));
    }

    return () => {
      wsRef.current?.disconnect();
    };
  }, [autoConnect]);

  const connect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.connect();
    }
  }, []);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.disconnect();
    }
  }, []);

  return {
    isConnected,
    connect,
    disconnect,
    ws: wsRef.current,
  };
}
