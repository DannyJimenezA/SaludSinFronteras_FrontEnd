import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import {
  Heart,
  Globe,
  Video,
  Clock,
  Users,
  Star,
  Check,
  ArrowRight,
  Stethoscope,
  Brain,
  Activity,
  Eye,
  Baby,
  MessageSquare,
  Shield,
  Zap,
  Award,
  TrendingUp,
  Languages,
  Phone,
  Mail,
} from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  // Planes de precios
  const plans = [
    {
      id: 'free',
      name: 'Gratuito',
      price: '$0',
      period: '/mes',
      description: 'Perfecto para comenzar tu cuidado de salud',
      features: [
        '1 consulta al mes',
        'Videollamadas básicas',
        'Chat con traducción',
        'Historial médico básico',
        'Soporte por email',
      ],
      color: 'border-gray-200',
      buttonVariant: 'outline' as const,
      popular: false,
    },
    {
      id: 'basic',
      name: 'Básico',
      price: '$29',
      period: '/mes',
      description: 'Ideal para cuidado médico regular',
      features: [
        '5 consultas al mes',
        'Videollamadas HD',
        'Traducción en tiempo real',
        'Historial médico completo',
        'Recetas digitales',
        'Análisis básicos',
        'Soporte prioritario 24/7',
      ],
      color: 'border-teal-500',
      buttonVariant: 'default' as const,
      popular: true,
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$79',
      period: '/mes',
      description: 'Acceso completo a todos los servicios',
      features: [
        'Consultas ilimitadas',
        'Videollamadas 4K',
        'Traducción AI avanzada',
        'Grabación de consultas',
        'Especialistas premium',
        'Análisis completos',
        'Consultas de emergencia',
        'Planes familiares',
      ],
      color: 'border-yellow-400',
      buttonVariant: 'default' as const,
      popular: false,
    },
  ];

  // Especialidades médicas
  const specialties = [
    { name: 'Cardiología', icon: Heart, color: 'text-red-500' },
    { name: 'Neurología', icon: Brain, color: 'text-purple-500' },
    { name: 'Medicina General', icon: Stethoscope, color: 'text-blue-500' },
    { name: 'Oftalmología', icon: Eye, color: 'text-green-500' },
    { name: 'Pediatría', icon: Baby, color: 'text-pink-500' },
    { name: 'Dermatología', icon: Activity, color: 'text-orange-500' },
  ];

  // Idiomas soportados
  const languages = [
    { code: 'ES', name: 'Español', flag: '🇪🇸' },
    { code: 'EN', name: 'English', flag: '🇬🇧' },
    { code: 'FR', name: 'Français', flag: '🇫🇷' },
    { code: 'DE', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'PT', name: 'Português', flag: '🇵🇹' },
    { code: 'ZH', name: '中文', flag: '🇨🇳' },
  ];

  // Tecnologías
  const technologies = [
    {
      name: 'LiveKit',
      description: 'Videollamadas de alta calidad en tiempo real',
      icon: Video,
    },
    {
      name: 'OpenAI',
      description: 'Traducción inteligente con IA',
      icon: Brain,
    },
    {
      name: 'React',
      description: 'Interfaz moderna y rápida',
      icon: Zap,
    },
    {
      name: 'Node.js',
      description: 'Backend robusto y escalable',
      icon: Shield,
    },
  ];

  // Estadísticas
  const stats = [
    { value: '50K+', label: 'Usuarios Activos', icon: Users },
    { value: '4.9/5', label: 'Rating Promedio', icon: Star },
    { value: '100+', label: 'Médicos Certificados', icon: Stethoscope },
    { value: '24/7', label: 'Soporte Disponible', icon: Clock },
  ];

  return (
  <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
    {/* Navbar */}
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              Salud Sin Fronteras
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Button
              className="!bg-green-600 hover:!bg-green-700 !text-white font-semibold"
              onClick={() => navigate('/login')}
            >
              Iniciar Sesión
            </Button>
            <Button
              className="!bg-green-600 hover:!bg-green-700 !text-white font-semibold"
              onClick={() => navigate('/login')}
            >
              Registrarse
            </Button>
          </div>
        </div>
      </div>
    </nav>

    {/* Hero Section */}
    <section className="relative overflow-hidden py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <Badge className="bg-teal-100 text-teal-700 hover:bg-teal-200">
              🌍 Telemedicina Sin Fronteras
            </Badge>

            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Tu salud,{' '}
              <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                sin fronteras
              </span>
            </h1>

            <p className="text-xl text-gray-600">
              Conectamos pacientes con médicos certificados de todo el mundo. Consultas médicas
              profesionales con traducción en tiempo real, disponible 24/7 desde cualquier lugar.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="!bg-green-600 hover:!bg-green-700 !text-white font-semibold"
                onClick={() => navigate('/login')}
              >
                Comenzar Ahora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                className="!bg-green-600 hover:!bg-green-700 !text-white font-semibold"
                onClick={() => navigate('/login')}
              >
                Ver Demo
                <Video className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 border-2 border-white flex items-center justify-center text-white font-semibold"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div>
                <p className="font-semibold">50,000+ usuarios activos</p>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-gray-600 ml-1">4.9/5 Rating</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10">
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop"
                alt="Doctor consultation"
                className="rounded-2xl shadow-2xl"
              />
            </div>
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full blur-3xl opacity-20"></div>
            <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full blur-3xl opacity-20"></div>
          </div>
        </div>
      </div>
    </section>

    {/* Stats Section */}
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-100 to-blue-100 rounded-full mb-4">
                <stat.icon className="h-8 w-8 text-teal-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Features Section */}
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="bg-blue-100 text-blue-700 mb-4">✨ Características</Badge>
          <h2 className="text-4xl font-bold mb-4">¿Por qué elegirnos?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ofrecemos la mejor experiencia de telemedicina con tecnología de punta
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-2 hover:border-teal-500 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-teal-600" />
              </div>
              <CardTitle>Sin Barreras de Idioma</CardTitle>
              <CardDescription>
                Traducción en tiempo real en más de 100 idiomas con IA avanzada
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-blue-500 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Video className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Videollamadas HD/4K</CardTitle>
              <CardDescription>
                Consultas médicas con calidad de imagen superior usando LiveKit
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-purple-500 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>100% Seguro</CardTitle>
              <CardDescription>
                Encriptación de extremo a extremo y cumplimiento HIPAA
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-green-500 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-teal-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Disponible 24/7</CardTitle>
              <CardDescription>
                Médicos disponibles las 24 horas, todos los días del año
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-yellow-500 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-yellow-600" />
              </div>
              <CardTitle>Médicos Certificados</CardTitle>
              <CardDescription>
                Solo profesionales verificados con años de experiencia
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-pink-500 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-red-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-pink-600" />
              </div>
              <CardTitle>Historial Médico</CardTitle>
              <CardDescription>
                Toda tu información médica en un solo lugar, siempre accesible
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>

    {/* Specialties Section */}
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="bg-purple-100 text-purple-700 mb-4">🏥 Especialidades</Badge>
          <h2 className="text-4xl font-bold mb-4">Nuestras Especialidades Médicas</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Conectamos con especialistas en diversas áreas de la medicina
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {specialties.map((specialty, index) => (
            <Card
              key={index}
              className="text-center hover:shadow-lg transition-all cursor-pointer border-2 hover:border-teal-500"
            >
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-blue-100 rounded-full flex items-center justify-center">
                    <specialty.icon className={`h-8 w-8 ${specialty.color}`} />
                  </div>
                </div>
                <p className="font-semibold text-sm">{specialty.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>

    {/* Languages Section */}
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="bg-green-100 text-green-700 mb-4">🌐 Idiomas</Badge>
          <h2 className="text-4xl font-bold mb-4">Hablamos tu Idioma</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Traducción en tiempo real en más de 100 idiomas
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {languages.map((lang, index) => (
            <Card key={index} className="hover:shadow-lg transition-all">
              <CardContent className="p-4 text-center">
                <div className="text-4xl mb-2">{lang.flag}</div>
                <p className="font-semibold">{lang.code}</p>
                <p className="text-sm text-gray-600">{lang.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>

    {/* Pricing Section */}
    <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="bg-yellow-100 text-yellow-700 mb-4">💰 Precios</Badge>
          <h2 className="text-4xl font-bold mb-4">Planes para Todos</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Elige el plan que mejor se adapte a tus necesidades
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative transition-all hover:shadow-2xl ${
                plan.popular ? 'border-4 border-teal-500 scale-105' : 'border-2 ' + plan.color
              }`}
              onMouseEnter={() => setHoveredPlan(plan.id)}
              onMouseLeave={() => setHoveredPlan(null)}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-teal-500 to-blue-600 text-white px-4 py-1">
                    ⭐ Más Popular
                  </Badge>
                </div>
              )}

              <CardHeader className={`text-center pb-8 ${plan.popular ? 'pt-12' : 'pt-8'}`}>
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <div className="mb-4">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
                <CardDescription className="text-base">{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full !bg-green-600 hover:!bg-green-700 !text-white font-semibold"
                  size="lg"
                  onClick={() => navigate('/login')}
                >
                  {hoveredPlan === plan.id ? '¡Comienza Ahora!' : 'Seleccionar Plan'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>

    {/* Technologies Section */}
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="bg-indigo-100 text-indigo-700 mb-4">⚡ Tecnología</Badge>
          <h2 className="text-4xl font-bold mb-4">Potenciado por la Mejor Tecnología</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Utilizamos las herramientas más avanzadas para brindarte la mejor experiencia
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {technologies.map((tech, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-all border-2 hover:border-indigo-500">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <tech.icon className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">{tech.name}</h3>
                <p className="text-sm text-gray-600">{tech.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>

    {/* CTA Section */}
    <section className="py-20 px-4 bg-white border-y-2">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">
          ¿Listo para Transformar tu Salud?
        </h2>
        <p className="text-xl mb-8 text-gray-700">
          Únete a miles de usuarios que ya confían en Salud Sin Fronteras
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button
            size="lg"
            className="!bg-green-600 hover:!bg-green-700 !text-white font-semibold"
            onClick={() => navigate('/login')}
          >
            Comenzar Gratis
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            size="lg"
            className="!bg-green-600 hover:!bg-green-700 !text-white font-semibold"
            onClick={() => navigate('/login')}
          >
            Hablar con Ventas
            <Phone className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer className="bg-gray-900 text-gray-300 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="text-white font-bold">Salud Sin Fronteras</span>
            </div>
            <p className="text-sm">
              Conectando pacientes con médicos de todo el mundo, sin barreras de idioma.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Producto</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition">
                  Características
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Precios
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Especialidades
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Médicos
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Compañía</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition">
                  Sobre Nosotros
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Carreras
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contacto</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>info@saludsinfronteras.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span>24/7 Soporte</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm">
          <p>
            &copy; 2025 Salud Sin Fronteras. Todos los derechos reservados. |{' '}
            <a href="#" className="hover:text-white transition">
              Privacidad
            </a>{' '}
            |{' '}
            <a href="#" className="hover:text-white transition">
              Términos
            </a>
          </p>
        </div>
      </div>
    </footer>
  </div>
  );
}