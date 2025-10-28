/**
 * Chat Component with WebSocket Real-time Messaging
 * Uses the WebSocket hook for real-time communication
 */

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { useWebSocket } from '../hooks/useWebSocket';
import { useAuth } from '../contexts/AuthContext';
import { Send, WifiOff, Wifi, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function ChatWithWebSocket() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { user } = useAuth();
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    sendMessage,
    isConnected,
    connect,
    disconnect,
    clearMessages,
  } = useWebSocket({
    conversationId: conversationId || '',
    autoConnect: true,
    onNewMessage: (message) => {
      // Play notification sound or show toast for new messages from others
      if (message.SenderUserId !== user?.userId) {
        toast.info(`Nuevo mensaje de ${message.Sender.FirstName}`);
      }
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputMessage.trim()) return;
    if (!isConnected) {
      toast.error('No estás conectado. Reconectando...');
      connect();
      return;
    }

    sendMessage(inputMessage.trim());
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!conversationId) {
    return (
      <Alert variant="destructive">
        <AlertDescription>ID de conversación no proporcionado</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="border-b">
        <div className="flex justify-between items-center">
          <CardTitle>Chat en Tiempo Real</CardTitle>
          <Badge variant={isConnected ? 'default' : 'destructive'}>
            {isConnected ? (
              <>
                <Wifi className="h-3 w-3 mr-1" />
                Conectado
              </>
            ) : (
              <>
                <WifiOff className="h-3 w-3 mr-1" />
                Desconectado
              </>
            )}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            <p>No hay mensajes aún</p>
            <p className="text-sm mt-2">Envía un mensaje para comenzar la conversación</p>
          </div>
        ) : (
          messages.map((message) => {
            const isMyMessage = message.SenderUserId === user?.userId;

            return (
              <div
                key={message.MessageId}
                className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2 max-w-[70%] ${isMyMessage ? 'flex-row-reverse' : ''}`}>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {message.Sender.FirstName[0]}
                      {message.Sender.LastName1[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div
                      className={`rounded-lg p-3 ${
                        isMyMessage
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground'
                      }`}
                    >
                      {!isMyMessage && (
                        <div className="text-xs font-medium mb-1">
                          {message.Sender.FirstName} {message.Sender.LastName1}
                        </div>
                      )}
                      <p className="text-sm whitespace-pre-wrap">{message.Content}</p>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 px-1">
                      {new Date(message.CreatedAt).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </CardContent>

      <CardFooter className="border-t p-4">
        <div className="flex gap-2 w-full">
          <Input
            placeholder="Escribe un mensaje..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={!isConnected}
          />
          <Button onClick={handleSend} disabled={!isConnected || !inputMessage.trim()}>
            {isConnected ? (
              <Send className="h-4 w-4" />
            ) : (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
