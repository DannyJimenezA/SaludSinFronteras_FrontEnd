import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Input } from './ui/input';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  MessageSquare, 
  Settings, 
  Languages,
  Volume2,
  VolumeX,
  Monitor,
  Camera,
  Send,
  FileText,
  Clock,
  Globe
} from 'lucide-react';

interface VideoCallProps {
  onNavigate: (screen: string) => void;
}

export function VideoCall({ onNavigate }: VideoCallProps) {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isTranslationOn, setIsTranslationOn] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [callDuration, setCallDuration] = useState(0);
  const [translationLanguage, setTranslationLanguage] = useState('English');

  const chatMessages = [
    {
      id: 1,
      sender: 'doctor',
      message: 'Hola Juan, ¿cómo te encuentras hoy?',
      translation: 'Hello Juan, how are you feeling today?',
      timestamp: '14:30'
    },
    {
      id: 2,
      sender: 'patient',
      message: 'Hello Doctor, I have been feeling chest pain.',
      translation: 'Hola Doctor, he estado sintiendo dolor en el pecho.',
      timestamp: '14:31'
    }
  ];

  const subtitles = {
    doctor: 'Perfecto, vamos a revisar tus síntomas detalladamente.',
    translation: 'Perfect, let\'s review your symptoms in detail.'
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const sendMessage = () => {
    if (chatMessage.trim()) {
      // Simulate sending message
      setChatMessage('');
    }
  };

  const endCall = () => {
    onNavigate('patient-dashboard');
  };

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="text-sm">{formatDuration(callDuration)}</span>
            </div>
            <Badge className="bg-green-600">
              Conectado
            </Badge>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span className="text-sm">ES ↔ EN</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={isTranslationOn ? 'default' : 'secondary'}
              size="sm"
              onClick={() => setIsTranslationOn(!isTranslationOn)}
              className="bg-primary hover:bg-primary/90"
            >
              <Languages className="h-4 w-4 mr-2" />
              Traducción
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-120px)]">
          {/* Main Video Area */}
          <div className="lg:col-span-3 space-y-4">
            {/* Doctor Video */}
            <Card className="bg-gray-900 border-gray-700 h-[60%]">
              <CardContent className="p-0 h-full relative">
                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
                  <div className="text-center text-white">
                    <Avatar className="h-32 w-32 mx-auto mb-4">
                      <AvatarFallback className="text-4xl bg-primary">AG</AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-semibold">Dr. Ana García</h3>
                    <p className="text-gray-400">Cardiología</p>
                  </div>
                </div>
                
                {/* Doctor Info Overlay */}
                <div className="absolute top-4 left-4">
                  <Badge className="bg-black/70 text-white">
                    Dr. Ana García
                  </Badge>
                </div>

                {/* Audio Indicator */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-white text-sm">Hablando</span>
                </div>
              </CardContent>
            </Card>

            {/* Patient Video (Picture in Picture) */}
            <Card className="bg-gray-900 border-gray-700 h-[35%] relative">
              <CardContent className="p-0 h-full">
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
                  {isVideoOn ? (
                    <div className="text-center text-white">
                      <Avatar className="h-20 w-20 mx-auto mb-2">
                        <AvatarFallback className="text-xl bg-secondary">JP</AvatarFallback>
                      </Avatar>
                      <p className="text-sm">Juan Pérez (Tú)</p>
                    </div>
                  ) : (
                    <div className="text-center text-white">
                      <VideoOff className="h-16 w-16 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm">Cámara desactivada</p>
                    </div>
                  )}
                </div>

                {/* Patient Video in top-right corner */}
                <div className="absolute top-4 right-4 w-32 h-24 bg-gray-800 rounded-lg border-2 border-gray-600 overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center">
                    {isVideoOn ? (
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="text-sm">JP</AvatarFallback>
                      </Avatar>
                    ) : (
                      <VideoOff className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subtitles */}
            {isTranslationOn && (
              <Card className="bg-black/80 border-gray-700">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="text-white">
                      <span className="text-blue-400 font-medium">Dr. García: </span>
                      {subtitles.doctor}
                    </div>
                    <div className="text-gray-300 text-sm italic">
                      <span className="text-green-400">Traducción: </span>
                      {subtitles.translation}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Controls */}
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant={isVideoOn ? 'default' : 'destructive'}
                    onClick={() => setIsVideoOn(!isVideoOn)}
                    className="flex-col gap-1 h-auto py-3"
                  >
                    {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                    <span className="text-xs">Cámara</span>
                  </Button>
                  
                  <Button
                    variant={isAudioOn ? 'default' : 'destructive'}
                    onClick={() => setIsAudioOn(!isAudioOn)}
                    className="flex-col gap-1 h-auto py-3"
                  >
                    {isAudioOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                    <span className="text-xs">Micrófono</span>
                  </Button>

                  <Button
                    variant={isSpeakerOn ? 'default' : 'secondary'}
                    onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                    className="flex-col gap-1 h-auto py-3"
                  >
                    {isSpeakerOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                    <span className="text-xs">Altavoz</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="flex-col gap-1 h-auto py-3"
                  >
                    <Monitor className="h-5 w-5" />
                    <span className="text-xs">Pantalla</span>
                  </Button>
                </div>

                <div className="mt-4 space-y-2">
                  <Button
                    variant={showChat ? 'default' : 'outline'}
                    onClick={() => setShowChat(!showChat)}
                    className="w-full"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat
                  </Button>
                  
                  <Button
                    variant="destructive"
                    onClick={endCall}
                    className="w-full"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Finalizar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Chat */}
            {showChat && (
              <Card className="bg-gray-900 border-gray-700 h-96">
                <CardContent className="p-4 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-medium">Chat Traducido</h3>
                    <Badge className="bg-primary">
                      <Languages className="h-3 w-3 mr-1" />
                      Auto
                    </Badge>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                    {chatMessages.map((msg) => (
                      <div 
                        key={msg.id}
                        className={`p-3 rounded-lg ${msg.sender === 'patient' 
                          ? 'bg-primary text-white ml-8' 
                          : 'bg-gray-800 text-white mr-8'
                        }`}
                      >
                        <div className="text-sm">
                          {msg.message}
                        </div>
                        {isTranslationOn && (
                          <div className="text-xs text-gray-300 italic mt-1 border-t border-gray-600 pt-1">
                            {msg.translation}
                          </div>
                        )}
                        <div className="text-xs text-gray-400 mt-1">
                          {msg.timestamp}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Input
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Escribe un mensaje..."
                      className="bg-gray-800 border-gray-600 text-white"
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <Button onClick={sendMessage} size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Patient Info */}
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>JP</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-white font-medium">Juan Pérez</h4>
                      <p className="text-gray-400 text-sm">Paciente</p>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => onNavigate('history')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Ver Historial
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Notes */}
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-4">
                <h4 className="text-white font-medium mb-3">Notas Rápidas</h4>
                <div className="space-y-2">
                  <div className="text-sm text-gray-300 p-2 bg-gray-800 rounded">
                    • Dolor en el pecho desde hace 3 días
                  </div>
                  <div className="text-sm text-gray-300 p-2 bg-gray-800 rounded">
                    • Presión arterial: 140/90
                  </div>
                  <div className="text-sm text-gray-300 p-2 bg-gray-800 rounded">
                    • Sin antecedentes cardíacos
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}