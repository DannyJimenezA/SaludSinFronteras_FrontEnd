import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useAuth } from '../contexts/AuthContext';
import {
  CreditCard,
  Download,
  Calendar,
  DollarSign,
  Check,
  Star,
  Zap,
  Shield,
  Users,
  Video,
  FileText,
  Globe,
  Crown,
  Gift
} from 'lucide-react';

export function PaymentsBilling() {
  const navigate = useNavigate();
  const { getDashboardRoute } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState('basic');

  const plans = [
    {
      id: 'free',
      name: 'Gratuito',
      price: 0,
      billing: 'Siempre gratis',
      description: 'Perfecto para uso ocasional',
      features: [
        '1 consulta por mes',
        'Videollamadas básicas',
        'Chat con traducción',
        'Historial básico',
        'Soporte por email'
      ],
      limitations: [
        'Sin grabación de consultas',
        'Sin análisis médicos',
        'Sin soporte prioritario'
      ],
      color: 'border-gray-200',
      popular: false
    },
    {
      id: 'basic',
      name: 'Básico',
      price: 29,
      billing: 'por mes',
      description: 'Ideal para cuidado médico regular',
      features: [
        '5 consultas por mes',
        'Videollamadas HD',
        'Traducción en tiempo real',
        'Historial médico completo',
        'Recetas digitales',
        'Análisis básicos',
        'Soporte prioritario'
      ],
      limitations: [
        'Sin consultas ilimitadas',
        'Sin especialistas premium'
      ],
      color: 'border-primary',
      popular: true
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 79,
      billing: 'por mes',
      description: 'Acceso completo a todos los servicios',
      features: [
        'Consultas ilimitadas',
        'Videollamadas 4K',
        'Traducción AI avanzada',
        'Grabación de consultas',
        'Especialistas premium',
        'Análisis completos',
        'Soporte 24/7',
        'Consultas de emergencia',
        'Planes familiares'
      ],
      limitations: [],
      color: 'border-yellow-400',
      popular: false
    }
  ];

  const paymentHistory = [
    {
      id: 1,
      date: '2024-09-01',
      description: 'Plan Básico - Septiembre 2024',
      amount: 29.00,
      status: 'paid',
      invoice: 'INV-2024-09-001'
    },
    {
      id: 2,
      date: '2024-08-01',
      description: 'Plan Básico - Agosto 2024',
      amount: 29.00,
      status: 'paid',
      invoice: 'INV-2024-08-001'
    },
    {
      id: 3,
      date: '2024-07-01',
      description: 'Plan Básico - Julio 2024',
      amount: 29.00,
      status: 'paid',
      invoice: 'INV-2024-07-001'
    },
    {
      id: 4,
      date: '2024-06-15',
      description: 'Consulta adicional - Dr. García',
      amount: 15.00,
      status: 'paid',
      invoice: 'INV-2024-06-015'
    }
  ];

  const consultationCosts = [
    {
      doctor: 'Dr. Ana García',
      specialty: 'Cardiología',
      date: '2024-08-15',
      type: 'videollamada',
      amount: 60.00,
      covered: true
    },
    {
      doctor: 'Dr. Luis Chen',
      specialty: 'Medicina General',
      date: '2024-08-10',
      type: 'presencial',
      amount: 50.00,
      covered: true
    },
    {
      doctor: 'Dr. María González',
      specialty: 'Dermatología',
      date: '2024-08-05',
      type: 'videollamada',
      amount: 65.00,
      covered: true
    }
  ];

  const currentPlan = plans.find(plan => plan.id === 'basic');

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate(getDashboardRoute())}>
            ← Volver
          </Button>
          <h1 className="text-2xl font-bold text-primary">Pagos y Facturación</h1>
        </div>

        <Tabs defaultValue="subscription" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="subscription">Suscripción</TabsTrigger>
            <TabsTrigger value="plans">Cambiar Plan</TabsTrigger>
            <TabsTrigger value="history">Historial</TabsTrigger>
            <TabsTrigger value="usage">Uso</TabsTrigger>
          </TabsList>

          {/* Current Subscription */}
          <TabsContent value="subscription" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-primary" />
                  Plan Actual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-xl font-semibold">{currentPlan?.name}</h3>
                    <p className="text-muted-foreground">{currentPlan?.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className="bg-green-100 text-green-800">Activo</Badge>
                      <span className="text-sm text-muted-foreground">
                        Renovación automática el 1 de octubre, 2024
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">€{currentPlan?.price}</p>
                    <p className="text-muted-foreground">{currentPlan?.billing}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Consultas Usadas</p>
                      <p className="text-2xl font-bold">3 / 5</p>
                    </div>
                    <Video className="h-8 w-8 text-primary" />
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Próximo Pago</p>
                      <p className="text-lg font-bold">1 Oct 2024</p>
                    </div>
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Ahorrado este mes</p>
                      <p className="text-lg font-bold text-green-600">€45</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Beneficios Incluidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentPlan?.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setSelectedPlan('plans')}>
                Cambiar Plan
              </Button>
              <Button variant="outline">
                Cancelar Suscripción
              </Button>
              <Button variant="outline">
                Gestionar Pago
              </Button>
            </div>
          </TabsContent>

          {/* Plans Comparison */}
          <TabsContent value="plans" className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Elige el Plan Perfecto para Ti</h2>
              <p className="text-muted-foreground">
                Todos los planes incluyen traducción automática y acceso 24/7
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <Card 
                  key={plan.id} 
                  className={`relative ${plan.color} ${plan.popular ? 'ring-2 ring-primary' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary px-3 py-1">
                        <Star className="h-3 w-3 mr-1" />
                        Más Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="space-y-1">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-3xl font-bold">€{plan.price}</span>
                        {plan.price > 0 && (
                          <span className="text-muted-foreground">/{plan.billing.split(' ')[1]}</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{plan.billing}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      className="w-full"
                      variant={plan.id === 'basic' ? 'default' : 'outline'}
                      disabled={plan.id === 'basic'}
                    >
                      {plan.id === 'basic' ? 'Plan Actual' : `Cambiar a ${plan.name}`}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Gift className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-purple-900">¡Oferta Especial!</h3>
                    <p className="text-purple-700">
                      Consigue 2 meses gratis al cambiar al plan Premium anual
                    </p>
                  </div>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Aprovechar Oferta
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment History */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Historial de Pagos</CardTitle>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentHistory.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-primary/10 rounded-full">
                          <CreditCard className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{payment.description}</p>
                          <p className="text-sm text-muted-foreground">{payment.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">€{payment.amount.toFixed(2)}</p>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-100 text-green-800">
                            <Check className="h-3 w-3 mr-1" />
                            Pagado
                          </Badge>
                          <Button variant="outline" size="sm">
                            <Download className="h-3 w-3 mr-1" />
                            PDF
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">Total Gastado</p>
                  <p className="text-2xl font-bold">€133.00</p>
                  <p className="text-xs text-muted-foreground">En los últimos 6 meses</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">Promedio Mensual</p>
                  <p className="text-2xl font-bold">€22.17</p>
                  <p className="text-xs text-muted-foreground">Últimos 6 meses</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">Próximo Pago</p>
                  <p className="text-2xl font-bold">€29.00</p>
                  <p className="text-xs text-muted-foreground">1 de octubre</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Usage Details */}
          <TabsContent value="usage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Detalles de Uso - Septiembre 2024</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {consultationCosts.map((consultation, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-primary/10 rounded-full">
                          <Video className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{consultation.doctor}</p>
                          <p className="text-sm text-muted-foreground">
                            {consultation.specialty} • {consultation.date} • {consultation.type}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">€{consultation.amount.toFixed(2)}</p>
                        <Badge className="bg-green-100 text-green-800">
                          Incluido en plan
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resumen del Mes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Consultas realizadas</span>
                    <span className="font-semibold">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Valor total de consultas</span>
                    <span className="font-semibold">€175.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Costo del plan</span>
                    <span className="font-semibold">€29.00</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-green-600">
                    <span className="font-semibold">Ahorro total</span>
                    <span className="font-semibold">€146.00</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Servicios Utilizados</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      <span className="text-sm">Videollamadas</span>
                    </div>
                    <span className="text-sm font-medium">3 / 5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <span className="text-sm">Traducción automática</span>
                    </div>
                    <span className="text-sm font-medium">Ilimitado</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">Recetas digitales</span>
                    </div>
                    <span className="text-sm font-medium">2</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <span className="text-sm">Historial médico</span>
                    </div>
                    <span className="text-sm font-medium">Activo</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}