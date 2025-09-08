import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  Calendar, 
  Clock, 
  MessageSquare, 
  Search, 
  Bell, 
  FileText, 
  Video, 
  Star,
  MapPin,
  Languages
} from 'lucide-react';

interface PatientDashboardProps {
  onNavigate: (screen: string) => void;
}

export function PatientDashboard({ onNavigate }: PatientDashboardProps) {
  const upcomingAppointments = [
    {
      id: 1,
      doctor: 'Dr. Ana García',
      specialty: 'Cardiología',
      date: '2025-09-10',
      time: '14:30',
      type: 'videollamada'
    },
    {
      id: 2,
      doctor: 'Dr. Luis Chen',
      specialty: 'Medicina General',
      date: '2025-09-15',
      time: '09:00',
      type: 'presencial'
    }
  ];

  const recommendedDoctors = [
    {
      id: 1,
      name: 'Dr. María González',
      specialty: 'Dermatología',
      rating: 4.9,
      location: 'Madrid, España',
      languages: ['Español', 'Inglés'],
      available: true
    },
    {
      id: 2,
      name: 'Dr. James Wilson',
      specialty: 'Medicina Interna',
      rating: 4.8,
      location: 'Nueva York, USA',
      languages: ['Inglés', 'Español'],
      available: true
    },
    {
      id: 3,
      name: 'Dr. Sophie Dubois',
      specialty: 'Neurología',
      rating: 4.7,
      location: 'París, Francia',
      languages: ['Francés', 'Inglés'],
      available: false
    }
  ];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">¡Hola, Juan!</h1>
            <p className="text-muted-foreground">Tu salud es nuestra prioridad</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                3
              </Badge>
            </Button>
            <Button variant="outline" onClick={() => onNavigate('settings')}>
              Configuración
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Acciones Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button 
                    className="h-auto flex-col gap-2 p-4"
                    onClick={() => onNavigate('search-doctors')}
                  >
                    <Search className="h-6 w-6" />
                    Buscar Médicos
                  </Button>
                  <Button 
                    className="h-auto flex-col gap-2 p-4"
                    onClick={() => onNavigate('appointments')}
                  >
                    <Calendar className="h-6 w-6" />
                    Agendar Cita
                  </Button>
                  <Button 
                    className="h-auto flex-col gap-2 p-4"
                    onClick={() => onNavigate('history')}
                  >
                    <FileText className="h-6 w-6" />
                    Mi Historial
                  </Button>
                  <Button 
                    className="h-auto flex-col gap-2 p-4"
                    onClick={() => onNavigate('video-call')}
                  >
                    <Video className="h-6 w-6" />
                    Videollamada
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Appointments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Próximas Citas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div 
                    key={appointment.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{appointment.doctor}</h4>
                        <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3" />
                          <span className="text-xs">{appointment.date} - {appointment.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={appointment.type === 'videollamada' ? 'default' : 'secondary'}>
                        {appointment.type}
                      </Badge>
                      {appointment.type === 'videollamada' && (
                        <Button 
                          size="sm" 
                          className="mt-2"
                          onClick={() => onNavigate('video-call')}
                        >
                          Unirse
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => onNavigate('appointments')}
                >
                  Ver Todas las Citas
                </Button>
              </CardContent>
            </Card>

            {/* Recommended Doctors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Médicos Recomendados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recommendedDoctors.map((doctor) => (
                  <div 
                    key={doctor.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{doctor.name}</h4>
                        <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs">{doctor.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span className="text-xs">{doctor.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Languages className="h-3 w-3" />
                          <span className="text-xs">{doctor.languages.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={doctor.available ? 'default' : 'secondary'}>
                        {doctor.available ? 'Disponible' : 'Ocupado'}
                      </Badge>
                      <Button 
                        size="sm" 
                        className="mt-2"
                        disabled={!doctor.available}
                        onClick={() => onNavigate('appointments')}
                      >
                        Agendar
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Recent Messages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Mensajes Recientes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>AG</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Dr. Ana García</p>
                    <p className="text-xs text-muted-foreground">Resultados de análisis listos</p>
                  </div>
                  <Badge className="bg-red-500">!</Badge>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>LC</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Dr. Luis Chen</p>
                    <p className="text-xs text-muted-foreground">Confirmación de cita</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Health Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen de Salud</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Última consulta</span>
                    <span className="text-muted-foreground">15 Ago 2024</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Próximo chequeo</span>
                    <span className="text-muted-foreground">10 Sep 2024</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Medicamentos activos</span>
                    <span className="text-muted-foreground">3</span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => onNavigate('history')}
                >
                  Ver Historial Completo
                </Button>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-700">Emergencias</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-red-600 mb-3">
                  ¿Necesitas atención médica urgente?
                </p>
                <Button variant="destructive" className="w-full">
                  Llamar Emergencias
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}