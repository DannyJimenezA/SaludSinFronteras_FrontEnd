/**
 * Notification Center Component
 * Real-time push notifications using WebSocket
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, X, MessageSquare, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { toast } from 'sonner';

interface Notification {
  id: string;
  type: 'message' | 'appointment' | 'medical_record' | 'verification' | 'general';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export function NotificationCenter() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // WebSocket functionality disabled for now - can be enabled when backend WebSocket is ready
  // TODO: Integrate real WebSocket notifications when backend is available
  /*
  const { messages, isConnected } = useWebSocket({
    conversationId: 'notifications',
    autoConnect: false, // Set to true when backend is ready
    onNewMessage: (message) => {
      // Handle new message
    },
  });
  */
  const messages: any[] = [];

  // Convert WebSocket messages to notifications
  useEffect(() => {
    if (messages.length === 0) return;

    const latestMessage = messages[messages.length - 1];

    // Create notification from message
    const notification: Notification = {
      id: latestMessage.MessageId || `notification-${Date.now()}`,
      type: 'message',
      title: 'Nuevo Mensaje',
      message: latestMessage.Content || 'Tienes un nuevo mensaje',
      timestamp: latestMessage.CreatedAt || new Date().toISOString(),
      read: false,
      actionUrl: latestMessage.ConversationId
        ? `/chat/${latestMessage.ConversationId}`
        : undefined,
    };

    // Add to notifications
    setNotifications((prev) => [notification, ...prev]);

    // Show toast notification
    toast.info(notification.title, {
      description: notification.message.substring(0, 50) + '...',
      action: notification.actionUrl
        ? {
            label: 'Ver',
            onClick: () => navigate(notification.actionUrl!),
          }
        : undefined,
    });

    // Play notification sound (optional)
    playNotificationSound();
  }, [messages, navigate]);

  const playNotificationSound = () => {
    try {
      // Create a simple beep using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      console.log('Could not play notification sound:', error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      setIsOpen(false);
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="h-4 w-4" />;
      case 'appointment':
        return <Calendar className="h-4 w-4" />;
      case 'medical_record':
        return <FileText className="h-4 w-4" />;
      case 'verification':
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffMins < 1440) return `Hace ${Math.floor(diffMins / 60)} h`;
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
          {isConnected && (
            <span className="absolute bottom-1 right-1 h-2 w-2 bg-green-500 rounded-full" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="font-semibold">Notificaciones</h3>
            <p className="text-xs text-muted-foreground">
              {isConnected ? 'Conectado en tiempo real' : 'Desconectado'}
            </p>
          </div>
          {notifications.length > 0 && (
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs"
                >
                  Marcar todo
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={clearAll} className="text-xs">
                Limpiar
              </Button>
            </div>
          )}
        </div>

        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <Bell className="h-12 w-12 mb-4 opacity-50" />
              <p className="text-sm">No hay notificaciones</p>
              <p className="text-xs mt-1">Te notificaremos sobre mensajes y eventos</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-muted/50 transition-colors cursor-pointer ${
                    !notification.read ? 'bg-muted/30' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-1 ${
                        notification.read ? 'text-muted-foreground' : 'text-primary'
                      }`}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p
                          className={`text-sm font-medium ${
                            notification.read ? 'text-muted-foreground' : ''
                          }`}
                        >
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <span className="h-2 w-2 bg-blue-600 rounded-full flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTimestamp(notification.timestamp)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <>
            <Separator />
            <div className="p-3 text-center">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs"
                onClick={() => {
                  setIsOpen(false);
                  // Could navigate to a full notifications page if it exists
                }}
              >
                Ver todas las notificaciones
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
