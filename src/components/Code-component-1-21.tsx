import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  Calendar, 
  Clock, 
  Users, 
  FileText, 
  Video, 
  Bell, 
  TrendingUp,
  MessageSquare,
  Stethoscope,
  ClipboardList
} from 'lucide-react';

interface DoctorDashboardProps {
  onNavigate: (screen: string) => void;
}

export function DoctorDashboard({ onNavigate }: DoctorDashboardProps) {
  const todayAppointments = [
    {
      id: 1,
      patient: 'Juan Pérez',
      time: '09:00',
      type: 'videollamada',
      condition: 'Consulta de seguimiento',
      urgent: false
    },
    {
      id: 2,
      patient: 'María López',
      time: '10:30',
      type: 'presencial',
      condition: 'Primera consulta',
      urgent: true
    },
    {
      id: 3,
      patient: 'Carlos García',
      time: '14:00',
      type: 'videollamada',
      condition: 'Revisión de resultados',
      urgent: false
    }
  ];

  const pendingTasks = [
    {
      id: 1,
      task: 'Revisar análisis de sangre - Juan Pérez',
      priority: 'alta',
      dueDate: 'Hoy'
    },
    {
      id: 2,
      task: 'Completar receta médica - María López',
      priority: 'media',
      dueDate: 'Mañana'
    },
    {
      id: 3,
      task: 'Llamar para seguimiento - Carlos García',
      priority: 'baja',
      dueDate: '2 días'
    }
  ];

  const recentMessages = [
    {
      id: 1,
      from: 'Juan Pérez',
      message: 'Doctor, tengo una pregunta sobre mi medicación',
      time: '10 min',
      unread: true
    },
    {
      id: 2,
      from: 'María López',
      message: 'Gracias por la consulta de hoy',
      time: '1h',
      unread: false
    }
  ];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">Dr. Ana García</h1>
            <p className="text-muted-foreground">Cardiología - Hospital Central</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                5
              </Badge>
            </Button>
            <Button variant="outline" onClick={() => onNavigate('settings')}>
              Configuración
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Citas Hoy</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
                <Calendar className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pacientes Activos</p>
                  <p className="text-2xl font-bold">142</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Consultas Online</p>
                  <p className="text-2xl font-bold">24</p>
                </div>
                <Video className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Satisfacción</p>
                  <p className="text-2xl font-bold">4.9</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  Acciones Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button 
                    className="h-auto flex-col gap-2 p-4"
                    onClick={() => onNavigate('video-call')}
                  >
                    <Video className="h-6 w-6" />
                    Iniciar Consulta
                  </Button>
                  <Button 
                    className="h-auto flex-col gap-2 p-4"
                    onClick={() => onNavigate('appointments')}
                  >
                    <Calendar className="h-6 w-6" />
                    Ver Agenda
                  </Button>
                  <Button 
                    className="h-auto flex-col gap-2 p-4"
                    onClick={() => onNavigate('history')}
                  >
                    <FileText className="h-6 w-6" />
                    Historiales
                  </Button>
                  <Button 
                    className="h-auto flex-col gap-2 p-4"
                    onClick={() => onNavigate('prescriptions')}
                  >
                    <ClipboardList className="h-6 w-6" />
                    Recetas
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Today's Appointments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Citas de Hoy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {todayAppointments.map((appointment) => (
                  <div 
                    key={appointment.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Clock className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{appointment.patient}</h4>
                        <p className="text-sm text-muted-foreground">{appointment.condition}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-medium">{appointment.time}</span>
                          {appointment.urgent && (
                            <Badge variant="destructive" className="text-xs">Urgente</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={appointment.type === 'videollamada' ? 'default' : 'secondary'}>
                        {appointment.type}
                      </Badge>
                      <div className="flex gap-2 mt-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => onNavigate('history')}
                        >
                          Ver Historial
                        </Button>
                        {appointment.type === 'videollamada' && (
                          <Button 
                            size="sm"
                            onClick={() => onNavigate('video-call')}
                          >
                            Iniciar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => onNavigate('appointments')}
                >
                  Ver Agenda Completa
                </Button>
              </CardContent>
            </Card>

            {/* Pending Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  Tareas Pendientes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {pendingTasks.map((task) => (
                  <div 
                    key={task.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium">{task.task}</p>
                      <p className="text-xs text-muted-foreground">Vence: {task.dueDate}</p>
                    </div>
                    <Badge 
                      variant={
                        task.priority === 'alta' ? 'destructive' : 
                        task.priority === 'media' ? 'default' : 'secondary'
                      }
                    >
                      {task.priority}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Messages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Mensajes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentMessages.map((message) => (
                  <div 
                    key={message.id}
                    className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{message.from.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{message.from}</p>
                        <span className="text-xs text-muted-foreground">{message.time}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{message.message}</p>
                      {message.unread && (
                        <Badge className="mt-2 bg-blue-500">Nuevo</Badge>
                      )}
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  Ver Todos los Mensajes
                </Button>
              </CardContent>
            </Card>

            {/* Schedule Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen Semanal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Consultas esta semana</span>
                    <span className="font-medium">24</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Videollamadas</span>
                    <span className="font-medium">16</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Presenciales</span>
                    <span className="font-medium">8</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Ingresos estimados</span>
                    <span className="font-medium">€2,400</span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => onNavigate('payments')}
                >
                  Ver Finanzas
                </Button>
              </CardContent>
            </Card>

            {/* Patient Status */}
            <Card>
              <CardHeader>
                <CardTitle>Estado de Pacientes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Casos críticos</span>
                  <Badge variant="destructive">3</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Seguimiento requerido</span>
                  <Badge variant="default">12</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Estables</span>
                  <Badge variant="secondary">127</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}