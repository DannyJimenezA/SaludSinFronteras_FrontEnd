import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Calendar } from './ui/calendar';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Languages,
  Video,
  Building,
  CreditCard
} from 'lucide-react';

interface AppointmentSchedulingProps {
  onNavigate: (screen: string) => void;
}

export function AppointmentScheduling({ onNavigate }: AppointmentSchedulingProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [appointmentType, setAppointmentType] = useState<'videollamada' | 'presencial'>('videollamada');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');

  const doctors = [
    {
      id: 1,
      name: 'Dr. María González',
      specialty: 'Dermatología',
      rating: 4.9,
      location: 'Madrid, España',
      languages: ['Español', 'Inglés'],
      price: 60,
      availableSlots: ['09:00', '10:30', '14:00', '15:30'],
      image: null
    },
    {
      id: 2,
      name: 'Dr. James Wilson',
      specialty: 'Medicina Interna',
      rating: 4.8,
      location: 'Nueva York, USA',
      languages: ['Inglés', 'Español'],
      price: 80,
      availableSlots: ['08:00', '11:00', '16:00', '17:30'],
      image: null
    },
    {
      id: 3,
      name: 'Dr. Sophie Dubois',
      specialty: 'Neurología',
      rating: 4.7,
      location: 'París, Francia',
      languages: ['Francés', 'Inglés'],
      price: 120,
      availableSlots: ['10:00', '13:30', '15:00'],
      image: null
    }
  ];

  const specialties = ['Cardiología', 'Dermatología', 'Medicina Interna', 'Neurología', 'Pediatría', 'Psiquiatría'];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = !selectedSpecialty || selectedSpecialty === 'all' || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const handleBookAppointment = (doctor: any, timeSlot: string) => {
    setSelectedDoctor({ ...doctor, selectedTime: timeSlot });
  };

  const confirmBooking = () => {
    // Simulate booking confirmation
    alert('¡Cita agendada exitosamente!');
    onNavigate('patient-dashboard');
  };

  if (selectedDoctor) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => setSelectedDoctor(null)}>
              ← Volver
            </Button>
            <h1 className="text-2xl font-bold text-primary">Confirmar Cita</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Detalles de la Cita</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/50">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-lg">
                      {selectedDoctor.name.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{selectedDoctor.name}</h3>
                    <p className="text-muted-foreground">{selectedDoctor.specialty}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{selectedDoctor.rating}</span>
                      <MapPin className="h-4 w-4 ml-2" />
                      <span className="text-sm">{selectedDoctor.location}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Fecha</Label>
                    <div className="flex items-center gap-2 p-2 border rounded-lg bg-background">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{selectedDate?.toLocaleDateString('es-ES')}</span>
                    </div>
                  </div>
                  <div>
                    <Label>Hora</Label>
                    <div className="flex items-center gap-2 p-2 border rounded-lg bg-background">
                      <Clock className="h-4 w-4" />
                      <span>{selectedDoctor.selectedTime}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Tipo de Consulta</Label>
                  <Select value={appointmentType} onValueChange={(value: 'videollamada' | 'presencial') => setAppointmentType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="videollamada">
                        <div className="flex items-center gap-2">
                          <Video className="h-4 w-4" />
                          Videollamada
                        </div>
                      </SelectItem>
                      <SelectItem value="presencial">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          Presencial
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="reason">Motivo de la Consulta</Label>
                  <Textarea 
                    id="reason"
                    placeholder="Describe brevemente el motivo de tu consulta..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Notas Adicionales (Opcional)</Label>
                  <Textarea 
                    id="notes"
                    placeholder="Información adicional que consideres relevante..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Resumen de Pago
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Consulta {appointmentType}</span>
                    <span>€{selectedDoctor.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tarifa de plataforma</span>
                    <span>€5</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Traducción automática</span>
                    <span>Incluida</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>€{selectedDoctor.price + 5}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Método de Pago</Label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                      <input type="radio" name="payment" defaultChecked />
                      <div className="flex-1">
                        <p className="font-medium">Tarjeta ****1234</p>
                        <p className="text-sm text-muted-foreground">Visa • Expira 12/26</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                      <input type="radio" name="payment" />
                      <div className="flex-1">
                        <p className="font-medium">PayPal</p>
                        <p className="text-sm text-muted-foreground">juan@email.com</p>
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => onNavigate('payments')}
                  >
                    Agregar Método de Pago
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground p-3 bg-muted/50 rounded-lg">
                  Al confirmar la cita, aceptas nuestros términos y condiciones. 
                  Puedes cancelar hasta 24 horas antes sin costo.
                </div>

                <Button 
                  className="w-full"
                  onClick={confirmBooking}
                >
                  Confirmar y Pagar €{selectedDoctor.price + 5}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => onNavigate('patient-dashboard')}>
            ← Volver
          </Button>
          <h1 className="text-2xl font-bold text-primary">Agendar Cita</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Filters and Search */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Buscar Médicos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="search">Buscar por nombre o especialidad</Label>
                  <Input
                    id="search"
                    placeholder="Ej: Dr. González, Cardiología..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Especialidad</Label>
                  <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas las especialidades" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las especialidades</SelectItem>
                      {specialties.map((specialty) => (
                        <SelectItem key={specialty} value={specialty}>
                          {specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Tipo de Consulta</Label>
                  <Select value={appointmentType} onValueChange={(value: 'videollamada' | 'presencial') => setAppointmentType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="videollamada">Videollamada</SelectItem>
                      <SelectItem value="presencial">Presencial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Seleccionar Fecha
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date: number) => date ? new Date() : undefined}
                  className="w-full"
                />
              </CardContent>
            </Card>
          </div>

          {/* Doctor List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Médicos Disponibles</h2>
              <Badge variant="secondary">{filteredDoctors.length} médicos encontrados</Badge>
            </div>

            {filteredDoctors.map((doctor) => (
              <Card key={doctor.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback className="text-lg">
                          {doctor.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{doctor.name}</h3>
                        <p className="text-muted-foreground">{doctor.specialty}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{doctor.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span className="text-sm">{doctor.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Languages className="h-4 w-4" />
                          <span className="text-sm">{doctor.languages.join(', ')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="md:min-w-[200px]">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-semibold">€{doctor.price}</span>
                        <Badge variant={appointmentType === 'videollamada' ? 'default' : 'secondary'}>
                          {appointmentType}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Horarios disponibles:</p>
                        <div className="grid grid-cols-2 gap-2">
                          {doctor.availableSlots.map((slot) => (
                            <Button
                              key={slot}
                              variant="outline"
                              size="sm"
                              onClick={() => handleBookAppointment(doctor, slot)}
                              className="text-xs"
                            >
                              {slot}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredDoctors.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">
                    No se encontraron médicos con los filtros seleccionados.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedSpecialty('all');
                    }}
                  >
                    Limpiar Filtros
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}