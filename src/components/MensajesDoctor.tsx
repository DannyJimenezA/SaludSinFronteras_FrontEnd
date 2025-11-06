import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ArrowLeft, MessageSquare, Send, Loader2, User } from "lucide-react";
import {
  useConversationMessages,
  useSendMessage,
  useGetOrCreateConversationWithPatient,
} from "../hooks/useConversations";
import { usePatientsWithAppointments } from "../hooks/usePatientsWithAppointments";
import { toast } from "sonner";
import { getToken } from "../lib/api";

// Helper para decodificar JWT y obtener el user ID
function getUserIdFromToken(): string | null {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub ? String(payload.sub) : null;
  } catch {
    return null;
  }
}

export function MensajesDoctor() {
  const navigate = useNavigate();
  const [selectedPatientId, setSelectedPatientId] = useState<string | number | null>(null);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Obtener pacientes con los que el doctor tiene citas
  const { data: patients, isLoading: patientsLoading } = usePatientsWithAppointments();

  // Obtener o crear conversación con el paciente seleccionado
  const getOrCreateConversation = useGetOrCreateConversationWithPatient();

  // Obtener mensajes de la conversación actual
  const { data: messages, isLoading: messagesLoading } = useConversationMessages(selectedConversationId);
  const sendMessage = useSendMessage();

  // Auto-scroll al último mensaje
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Manejar selección de paciente
  const handleSelectPatient = async (patientId: string | number) => {
    setSelectedPatientId(patientId);
    setSelectedConversationId(null);

    try {
      // Obtener o crear conversación única con el paciente
      const conversation = await getOrCreateConversation.mutateAsync(patientId);
      setSelectedConversationId(conversation.id);
    } catch (error: any) {
      toast.error("Error al cargar la conversación", {
        description: error.response?.data?.message || "Por favor, intenta nuevamente",
      });
      setSelectedPatientId(null);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversationId) return;

    try {
      await sendMessage.mutateAsync({
        conversationId: selectedConversationId,
        content: messageText,
      });
      setMessageText("");
    } catch (error: any) {
      toast.error("Error al enviar mensaje", {
        description: error.response?.data?.message || "Por favor, intenta nuevamente",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const selectedPatient = patients?.find(p => p.id === selectedPatientId);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Mensajes</h1>
            <p className="text-muted-foreground mt-1">Conversaciones con tus pacientes</p>
          </div>
        </div>

        {/* Lista de pacientes y chat */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de pacientes */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">
                Mis Pacientes
                {patients && patients.length > 0 && (
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    ({patients.length})
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
              {patientsLoading ? (
                <div className="text-center py-12">
                  <Loader2 className="h-8 w-8 text-muted-foreground mx-auto mb-3 animate-spin" />
                  <p className="text-muted-foreground text-sm">Cargando pacientes...</p>
                </div>
              ) : !patients || patients.length === 0 ? (
                <div className="text-center py-12">
                  <User className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm">No tienes pacientes aún</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Los pacientes aparecerán aquí después de tu primera cita
                  </p>
                </div>
              ) : (
                patients.map((patient) => (
                  <div
                    key={patient.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedPatientId === patient.id
                        ? "bg-primary/10 border-2 border-primary"
                        : "bg-accent hover:bg-accent/80 border-2 border-transparent"
                    }`}
                    onClick={() => handleSelectPatient(patient.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">
                          {patient.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {patient.email}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {patient.appointmentCount} {patient.appointmentCount === 1 ? 'cita' : 'citas'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Panel de chat */}
          <Card className="lg:col-span-2">
            <CardHeader className="border-b">
              <CardTitle className="text-lg text-foreground">
                {selectedPatient
                  ? selectedPatient.name
                  : "Selecciona un paciente"}
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[600px] flex flex-col p-0">
              {!selectedPatientId ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Selecciona un paciente para iniciar una conversación
                    </p>
                  </div>
                </div>
              ) : getOrCreateConversation.isPending ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">Cargando conversación...</p>
                  </div>
                </div>
              ) : messagesLoading ? (
                <div className="flex-1 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                </div>
              ) : (
                <>
                  {/* Mensajes */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {!messages || messages.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground text-sm">
                          No hay mensajes aún. ¡Envía el primero!
                        </p>
                      </div>
                    ) : (
                      messages.map((message) => {
                        // Determinar si el mensaje es del usuario actual
                        const currentUserId = getUserIdFromToken();
                        const isOwnMessage = currentUserId && message.senderUserId === currentUserId;

                        // Verificar si hay traducción disponible
                        const hasTranslation = message.translation && message.translationLanguage;

                        return (
                          <div
                            key={message.id}
                            className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg p-3`}
                              style={{
                                backgroundColor: isOwnMessage ? '#2563eb' : '#f3f4f6',
                                color: isOwnMessage ? '#ffffff' : '#000000'
                              }}
                            >
                              {!isOwnMessage && (
                                <p className="text-xs font-semibold mb-1" style={{ opacity: 0.7 }}>
                                  {message.senderName}
                                </p>
                              )}

                              {/* Mostrar traducción si existe, sino mostrar mensaje original */}
                              <p className="text-sm whitespace-pre-wrap break-words" style={{ color: 'inherit' }}>
                                {hasTranslation ? message.translation : message.content}
                              </p>

                              {/* Mostrar mensaje original en pequeño si hay traducción */}
                              {hasTranslation && (
                                <p
                                  className="text-xs mt-2 pt-2 border-t italic whitespace-pre-wrap break-words"
                                  style={{
                                    color: isOwnMessage ? 'rgba(255,255,255,0.6)' : 'rgba(100,100,100,0.6)',
                                    borderColor: isOwnMessage ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'
                                  }}
                                >
                                  {message.content}
                                </p>
                              )}

                              <p
                                className="text-xs mt-1"
                                style={{ opacity: 0.7 }}
                              >
                                {new Date(message.createdAt).toLocaleTimeString("es-ES", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input de mensaje */}
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Escribe un mensaje..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1 px-4 py-2 bg-background border border-input rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!messageText.trim() || sendMessage.isPending}
                        className="bg-primary hover:bg-primary/90"
                      >
                        {sendMessage.isPending ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Send className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
