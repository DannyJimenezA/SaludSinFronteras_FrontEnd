/**
 * Video Call Room Component
 * Integrates with LiveKit for video conferencing
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LiveKitRoom, VideoConference, RoomAudioRenderer } from '@livekit/components-react';
import '@livekit/components-styles';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Skeleton } from './ui/skeleton';
import { useSetupVideoCall } from '../hooks/useVideo';
import { AlertCircle, Phone, PhoneOff } from 'lucide-react';
import { toast } from 'sonner';

export function VideoCallRoom() {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  const [isInCall, setIsInCall] = useState(false);

  const {
    data: videoSetup,
    isLoading,
    error,
    refetch,
  } = useSetupVideoCall(appointmentId);

  useEffect(() => {
    if (videoSetup) {
      setIsInCall(true);
      toast.success('Conectado a la videollamada');
    }
  }, [videoSetup]);

  const handleDisconnect = () => {
    setIsInCall(false);
    toast.info('Llamada finalizada');
    navigate(-1);
  };

  if (!appointmentId) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>ID de cita no proporcionado</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Conectando a videollamada...</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-96 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error al conectar: {error.message}
          </AlertDescription>
        </Alert>
        <div className="mt-4 flex gap-2">
          <Button onClick={() => refetch()}>
            <Phone className="h-4 w-4 mr-2" />
            Reintentar
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Volver
          </Button>
        </div>
      </div>
    );
  }

  if (!videoSetup) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-black">
      {/* Header */}
      <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold">Videollamada Médica</h1>
          <p className="text-sm text-gray-400">Sala: {videoSetup.token.roomName}</p>
        </div>
        <Button variant="destructive" onClick={handleDisconnect}>
          <PhoneOff className="h-4 w-4 mr-2" />
          Finalizar llamada
        </Button>
      </div>

      {/* Video Room */}
      <div className="flex-1">
        <LiveKitRoom
          token={videoSetup.token.token}
          serverUrl={videoSetup.token.url}
          connect={isInCall}
          video={true}
          audio={true}
          onDisconnected={handleDisconnect}
          style={{ height: '100%' }}
        >
          <VideoConference />
          <RoomAudioRenderer />
        </LiveKitRoom>
      </div>
    </div>
  );
}
