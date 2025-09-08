import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Users, 
  Activity, 
  DollarSign, 
  TrendingUp, 
  Search, 
  Filter, 
  Download,
  UserPlus,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Globe,
  Video,
  MessageSquare,
  Settings,
  BarChart3,
  PieChart,
  FileText,
  Mail,
  Phone,
  Shield
} from 'lucide-react';

interface AdminPanelProps {
  onNavigate: (screen: string) => void;
}

export function AdminPanel({ onNavigate }: AdminPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const stats = {
    totalUsers: 15847,
    activeDoctors: 342,
    activePatients: 15505,
    todayConsultations: 127,
    monthlyRevenue: 284750,
    averageRating: 4.8,
    supportTickets: 23,
    systemUptime: 99.9
  };

  const recentUsers = [
    {
      id: 1,
      name: 'Dr. Carlos Mendoza',
      email: 'carlos.mendoza@email.com',
      type: 'doctor',
      specialty: 'Neurología',
      status: 'pending',
      joinDate: '2024-09-08',
      country: 'Argentina'
    },
    {
      id: 2,
      name: 'Ana García López',
      email: 'ana.garcia@email.com',
      type: 'patient',
      specialty: null,
      status: 'active',
      joinDate: '2024-09-07',
      country: 'España'
    },
    {
      id: 3,
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@email.com',
      type: 'doctor',
      specialty: 'Pediatría',
      status: 'active',
      joinDate: '2024-09-06',
      country: 'Estados Unidos'
    }
  ];

  const consultationData = [
    { month: 'Ene', consultations: 2400, revenue: 48000 },
    { month: 'Feb', consultations: 2100, revenue: 42000 },
    { month: 'Mar', consultations: 2800, revenue: 56000 },
    { month: 'Abr', consultations: 3200, revenue: 64000 },
    { month: 'May', consultations: 2900, revenue: 58000 },
    { month: 'Jun', consultations: 3800, revenue: 76000 },
    { month: 'Jul', consultations: 4100, revenue: 82000 },
    { month: 'Ago', consultations: 3900, revenue: 78000 }
  ];

  const supportTickets = [
    {
      id: 1,
      user: 'Juan Pérez',
      type: 'patient',
      subject: 'Problema con videollamada',
      priority: 'alta',
      status: 'open',
      created: '2024-09-08 14:30',
      assignee: 'Tech Support'
    },
    {
      id: 2,
      user: 'Dr. Ana García',
      type: 'doctor',
      subject: 'Solicitud de verificación',
      priority: 'media',
      status: 'in-progress',
      created: '2024-09-08 12:15',
      assignee: 'Medical Review'
    },
    {
      id: 3,
      user: 'María López',
      type: 'patient',
      subject: 'Error en facturación',
      priority: 'baja',
      status: 'resolved',
      created: '2024-09-07 16:45',
      assignee: 'Billing Support'
    }
  ];

  const systemLogs = [
    {
      id: 1,
      timestamp: '2024-09-08 15:42:33',
      level: 'INFO',
      service: 'Auth Service',
      message: 'User login successful: juan.perez@email.com',
      details: 'IP: 192.168.1.100'
    },
    {
      id: 2,
      timestamp: '2024-09-08 15:41:15',
      level: 'WARNING',
      service: 'Video Service',
      message: 'High CPU usage detected on video server 2',
      details: 'CPU: 85%, Memory: 72%'
    },
    {
      id: 3,
      timestamp: '2024-09-08 15:40:02',
      level: 'ERROR',
      service: 'Translation API',
      message: 'Translation request failed',
      details: 'Language pair: es-en, Error: Rate limit exceeded'
    }
  ];

  const languageStats = [
    { language: 'Español', users: 6834, percentage: 43.1 },
    { language: 'English', users: 4523, percentage: 28.5 },
    { language: 'Português', users: 2123, percentage: 13.4 },
    { language: 'Français', users: 1456, percentage: 9.2 },
    { language: 'Deutsch', users: 911, percentage: 5.8 }
  ];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">Panel de Administración</h1>
            <p className="text-muted-foreground">MediConnect Global - Dashboard Ejecutivo</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => onNavigate('settings')}>
              <Settings className="h-4 w-4 mr-2" />
              Configuración
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar Datos
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Usuarios Totales</p>
                  <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                  <p className="text-xs text-green-600">+12% este mes</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Consultas Hoy</p>
                  <p className="text-2xl font-bold">{stats.todayConsultations}</p>
                  <p className="text-xs text-green-600">+8% vs ayer</p>
                </div>
                <Video className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ingresos Mensuales</p>
                  <p className="text-2xl font-bold">€{(stats.monthlyRevenue / 1000).toFixed(0)}k</p>
                  <p className="text-xs text-green-600">+15% vs mes anterior</p>
                </div>
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Satisfacción</p>
                  <p className="text-2xl font-bold">{stats.averageRating}</p>
                  <p className="text-xs text-green-600">⭐ Excelente</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="users">Usuarios</TabsTrigger>
            <TabsTrigger value="consultations">Consultas</TabsTrigger>
            <TabsTrigger value="analytics">Análisis</TabsTrigger>
            <TabsTrigger value="support">Soporte</TabsTrigger>
            <TabsTrigger value="system">Sistema</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Consultas por Mes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {consultationData.slice(-4).map((data, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{data.month}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${(data.consultations / 4100) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{data.consultations}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Distribución por Idioma
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {languageStats.map((lang, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{lang.language}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-secondary h-2 rounded-full" 
                              style={{ width: `${lang.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{lang.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Médicos Activos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">{stats.activeDoctors}</p>
                    <p className="text-sm text-muted-foreground">+5 nuevos esta semana</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tickets de Soporte</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-orange-600">{stats.supportTickets}</p>
                    <p className="text-sm text-muted-foreground">12 resueltos hoy</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tiempo de Actividad</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">{stats.systemUptime}%</p>
                    <p className="text-sm text-muted-foreground">Últimos 30 días</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar usuarios por nombre o email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="doctors">Médicos</SelectItem>
                    <SelectItem value="patients">Pacientes</SelectItem>
                    <SelectItem value="pending">Pendientes</SelectItem>
                  </SelectContent>
                </Select>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invitar Usuario
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Usuarios Recientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={user.type === 'doctor' ? 'default' : 'secondary'}>
                              {user.type === 'doctor' ? 'Médico' : 'Paciente'}
                            </Badge>
                            {user.specialty && (
                              <Badge variant="outline">{user.specialty}</Badge>
                            )}
                            <span className="text-xs text-muted-foreground">{user.country}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={
                            user.status === 'active' ? 'default' : 
                            user.status === 'pending' ? 'secondary' : 'destructive'
                          }
                        >
                          {user.status === 'active' ? 'Activo' : 
                           user.status === 'pending' ? 'Pendiente' : 'Inactivo'}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">{user.joinDate}</p>
                        <div className="flex gap-1 mt-2">
                          <Button variant="outline" size="sm">Ver</Button>
                          <Button variant="outline" size="sm">Editar</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Consultations Tab */}
          <TabsContent value="consultations" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <Video className="h-8 w-8 mx-auto text-primary mb-2" />
                    <p className="text-sm text-muted-foreground">Videollamadas Hoy</p>
                    <p className="text-2xl font-bold">89</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <Clock className="h-8 w-8 mx-auto text-primary mb-2" />
                    <p className="text-sm text-muted-foreground">Duración Promedio</p>
                    <p className="text-2xl font-bold">24m</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <CheckCircle className="h-8 w-8 mx-auto text-green-600 mb-2" />
                    <p className="text-sm text-muted-foreground">Completadas</p>
                    <p className="text-2xl font-bold">98.2%</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <XCircle className="h-8 w-8 mx-auto text-red-600 mb-2" />
                    <p className="text-sm text-muted-foreground">Canceladas</p>
                    <p className="text-2xl font-bold">1.8%</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Consultas en Tiempo Real</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="font-medium">Dr. Ana García ↔ Juan Pérez</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800">En curso</Badge>
                      <span className="text-sm text-muted-foreground">12m 34s</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="font-medium">Dr. Luis Chen ↔ María López</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-100 text-blue-800">Conectando</Badge>
                      <span className="text-sm text-muted-foreground">Iniciando...</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Crecimiento de Usuario</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Nuevos usuarios (30 días)</span>
                      <span className="font-bold text-green-600">+1,247</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Retención (7 días)</span>
                      <span className="font-bold">78.5%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Retención (30 días)</span>
                      <span className="font-bold">65.2%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ingresos por Región</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>España</span>
                      <span className="font-bold">€89,420</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>México</span>
                      <span className="font-bold">€76,230</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Argentina</span>
                      <span className="font-bold">€54,190</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Estados Unidos</span>
                      <span className="font-bold">€42,350</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tickets de Soporte</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {supportTickets.map((ticket) => (
                    <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-primary/10 rounded-full">
                          <MessageSquare className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{ticket.subject}</p>
                          <p className="text-sm text-muted-foreground">
                            {ticket.user} ({ticket.type === 'doctor' ? 'Médico' : 'Paciente'})
                          </p>
                          <p className="text-xs text-muted-foreground">{ticket.created}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge 
                            variant={
                              ticket.priority === 'alta' ? 'destructive' : 
                              ticket.priority === 'media' ? 'default' : 'secondary'
                            }
                          >
                            {ticket.priority}
                          </Badge>
                          <Badge 
                            variant={
                              ticket.status === 'open' ? 'destructive' : 
                              ticket.status === 'in-progress' ? 'default' : 'secondary'
                            }
                          >
                            {ticket.status === 'open' ? 'Abierto' : 
                             ticket.status === 'in-progress' ? 'En progreso' : 'Resuelto'}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{ticket.assignee}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <Shield className="h-8 w-8 mx-auto text-green-600 mb-2" />
                    <p className="text-sm text-muted-foreground">Estado del Sistema</p>
                    <p className="text-lg font-bold text-green-600">Operativo</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <Activity className="h-8 w-8 mx-auto text-primary mb-2" />
                    <p className="text-sm text-muted-foreground">Carga del Servidor</p>
                    <p className="text-lg font-bold">42%</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <Globe className="h-8 w-8 mx-auto text-primary mb-2" />
                    <p className="text-sm text-muted-foreground">API Traducciones</p>
                    <p className="text-lg font-bold text-green-600">99.8%</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Logs del Sistema</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {systemLogs.map((log) => (
                    <div key={log.id} className="flex items-start gap-3 p-3 border rounded-lg font-mono text-sm">
                      <Badge 
                        variant={
                          log.level === 'ERROR' ? 'destructive' : 
                          log.level === 'WARNING' ? 'secondary' : 'default'
                        }
                        className="text-xs"
                      >
                        {log.level}
                      </Badge>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{log.service}</span>
                          <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                        </div>
                        <p className="text-muted-foreground">{log.message}</p>
                        {log.details && (
                          <p className="text-xs text-muted-foreground mt-1">{log.details}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}