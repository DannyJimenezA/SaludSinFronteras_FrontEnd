import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  FileText, 
  Download, 
  Search, 
  Calendar, 
  Clock, 
  Pill, 
  Activity, 
  Heart,
  Eye,
  Filter,
  Upload,
  Share,
  Lock,
  AlertTriangle
} from 'lucide-react';

interface MedicalHistoryProps {
  onNavigate: (screen: string) => void;
}

export function MedicalHistory({ onNavigate }: MedicalHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const consultations = [
    {
      id: 1,
      doctor: 'Dr. Ana García',
      specialty: 'Cardiología',
      date: '2024-08-15',
      time: '14:30',
      type: 'videollamada',
      diagnosis: 'Hipertensión leve',
      prescription: 'Lisinopril 10mg',
      notes: 'Paciente presenta presión arterial elevada. Se recomienda cambios en la dieta y ejercicio regular.',
      status: 'completed',
      urgent: false
    },
    {
      id: 2,
      doctor: 'Dr. Luis Chen',
      specialty: 'Medicina General',
      date: '2024-07-22',
      time: '09:00',
      type: 'presencial',
      diagnosis: 'Resfriado común',
      prescription: 'Paracetamol 500mg',
      notes: 'Síntomas de resfriado. Descanso y hidratación.',
      status: 'completed',
      urgent: false
    },
    {
      id: 3,
      doctor: 'Dr. María González',
      specialty: 'Dermatología',
      date: '2024-06-10',
      time: '11:00',
      type: 'videollamada',
      diagnosis: 'Dermatitis atópica',
      prescription: 'Crema hidratante',
      notes: 'Dermatitis leve en brazos. Aplicar crema hidratante dos veces al día.',
      status: 'completed',
      urgent: false
    }
  ];

  const medications = [
    {
      id: 1,
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Una vez al día',
      prescribed: '2024-08-15',
      prescriber: 'Dr. Ana García',
      active: true,
      endDate: '2024-11-15'
    },
    {
      id: 2,
      name: 'Vitamina D3',
      dosage: '1000 IU',
      frequency: 'Una vez al día',
      prescribed: '2024-06-01',
      prescriber: 'Dr. Luis Chen',
      active: true,
      endDate: null
    },
    {
      id: 3,
      name: 'Paracetamol',
      dosage: '500mg',
      frequency: 'Según necesidad',
      prescribed: '2024-07-22',
      prescriber: 'Dr. Luis Chen',
      active: false,
      endDate: '2024-07-29'
    }
  ];

  const labResults = [
    {
      id: 1,
      test: 'Análisis de Sangre Completo',
      date: '2024-08-10',
      doctor: 'Dr. Ana García',
      results: {
        'Hemoglobina': { value: '14.5', unit: 'g/dL', normal: true },
        'Glucosa': { value: '95', unit: 'mg/dL', normal: true },
        'Colesterol Total': { value: '185', unit: 'mg/dL', normal: true },
        'Presión Arterial': { value: '140/90', unit: 'mmHg', normal: false }
      },
      status: 'reviewed'
    },
    {
      id: 2,
      test: 'Electrocardiograma',
      date: '2024-08-15',
      doctor: 'Dr. Ana García',
      results: {
        'Ritmo': { value: 'Sinusal normal', unit: '', normal: true },
        'Frecuencia': { value: '72', unit: 'bpm', normal: true }
      },
      status: 'pending'
    }
  ];

  const documents = [
    {
      id: 1,
      name: 'Receta_Lisinopril_20240815.pdf',
      type: 'prescription',
      date: '2024-08-15',
      doctor: 'Dr. Ana García',
      size: '245 KB'
    },
    {
      id: 2,
      name: 'Análisis_Sangre_20240810.pdf',
      type: 'lab',
      date: '2024-08-10',
      doctor: 'Dr. Ana García',
      size: '1.2 MB'
    },
    {
      id: 3,
      name: 'ECG_20240815.pdf',
      type: 'imaging',
      date: '2024-08-15',
      doctor: 'Dr. Ana García',
      size: '890 KB'
    }
  ];

  const personalInfo = {
    bloodType: 'O+',
    allergies: ['Penicilina', 'Mariscos'],
    chronicConditions: ['Hipertensión'],
    emergencyContact: {
      name: 'María Pérez',
      relationship: 'Esposa',
      phone: '+34 666 123 456'
    }
  };

  const filteredConsultations = consultations.filter(consultation => {
    const matchesSearch = consultation.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultation.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultation.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'recent') return new Date(consultation.date) > new Date('2024-07-01') && matchesSearch;
    if (selectedFilter === 'cardiology') return consultation.specialty === 'Cardiología' && matchesSearch;
    
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => onNavigate('patient-dashboard')}>
                ← Volver
              </Button>
              <h1 className="text-2xl font-bold text-primary">Historial Médico</h1>
            </div>
            <p className="text-muted-foreground mt-1">Información médica segura y encriptada</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Subir Documento
            </Button>
            <Button variant="outline" size="sm">
              <Share className="h-4 w-4 mr-2" />
              Compartir
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Security Notice */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-blue-800 font-medium">
                  Tu información médica está protegida con cifrado de extremo a extremo
                </p>
                <p className="text-xs text-blue-600">
                  Solo tú y los médicos autorizados pueden acceder a estos datos
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="consultations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="consultations">Consultas</TabsTrigger>
            <TabsTrigger value="medications">Medicamentos</TabsTrigger>
            <TabsTrigger value="labs">Análisis</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
            <TabsTrigger value="profile">Perfil Médico</TabsTrigger>
          </TabsList>

          {/* Consultations Tab */}
          <TabsContent value="consultations" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por médico, especialidad o diagnóstico..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={selectedFilter === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedFilter('all')}
                  size="sm"
                >
                  Todas
                </Button>
                <Button
                  variant={selectedFilter === 'recent' ? 'default' : 'outline'}
                  onClick={() => setSelectedFilter('recent')}
                  size="sm"
                >
                  Recientes
                </Button>
                <Button
                  variant={selectedFilter === 'cardiology' ? 'default' : 'outline'}
                  onClick={() => setSelectedFilter('cardiology')}
                  size="sm"
                >
                  Cardiología
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {filteredConsultations.map((consultation) => (
                <Card key={consultation.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback>
                            {consultation.doctor.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{consultation.doctor}</h3>
                            <Badge variant="secondary">{consultation.specialty}</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {consultation.date}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {consultation.time}
                            </div>
                            <Badge variant={consultation.type === 'videollamada' ? 'default' : 'outline'}>
                              {consultation.type}
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm"><span className="font-medium">Diagnóstico:</span> {consultation.diagnosis}</p>
                            <p className="text-sm"><span className="font-medium">Prescripción:</span> {consultation.prescription}</p>
                            <p className="text-sm text-muted-foreground">{consultation.notes}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 lg:min-w-[120px]">
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          Ver Detalles
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Descargar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Medications Tab */}
          <TabsContent value="medications" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Active Medications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Pill className="h-5 w-5 text-green-600" />
                    Medicamentos Activos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {medications.filter(med => med.active).map((medication) => (
                    <div key={medication.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{medication.name}</h4>
                        <Badge className="bg-green-100 text-green-800">Activo</Badge>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p><span className="font-medium">Dosis:</span> {medication.dosage}</p>
                        <p><span className="font-medium">Frecuencia:</span> {medication.frequency}</p>
                        <p><span className="font-medium">Prescrito por:</span> {medication.prescriber}</p>
                        <p><span className="font-medium">Desde:</span> {medication.prescribed}</p>
                        {medication.endDate && (
                          <p><span className="font-medium">Hasta:</span> {medication.endDate}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Medication History */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-gray-600" />
                    Historial de Medicamentos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {medications.filter(med => !med.active).map((medication) => (
                    <div key={medication.id} className="p-4 border rounded-lg bg-muted/50">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{medication.name}</h4>
                        <Badge variant="secondary">Finalizado</Badge>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p><span className="font-medium">Dosis:</span> {medication.dosage}</p>
                        <p><span className="font-medium">Prescrito por:</span> {medication.prescriber}</p>
                        <p><span className="font-medium">Período:</span> {medication.prescribed} - {medication.endDate}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Lab Results Tab */}
          <TabsContent value="labs" className="space-y-6">
            <div className="space-y-4">
              {labResults.map((lab) => (
                <Card key={lab.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="h-5 w-5" />
                          {lab.test}
                        </CardTitle>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>{lab.date}</span>
                          <span>{lab.doctor}</span>
                          <Badge variant={lab.status === 'reviewed' ? 'default' : 'secondary'}>
                            {lab.status === 'reviewed' ? 'Revisado' : 'Pendiente'}
                          </Badge>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Descargar
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {Object.entries(lab.results).map(([key, result]) => (
                        <div key={key} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-medium">{key}</h4>
                            {!result.normal && (
                              <AlertTriangle className="h-4 w-4 text-orange-500" />
                            )}
                          </div>
                          <p className="text-lg font-semibold">
                            {result.value} <span className="text-sm font-normal text-muted-foreground">{result.unit}</span>
                          </p>
                          <Badge 
                            variant={result.normal ? 'secondary' : 'destructive'}
                            className="text-xs"
                          >
                            {result.normal ? 'Normal' : 'Fuera de rango'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map((document) => (
                <Card key={document.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm mb-1">{document.name}</h4>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <p>{document.date}</p>
                          <p>{document.doctor}</p>
                          <p>{document.size}</p>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3 mr-1" />
                            Ver
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-3 w-3 mr-1" />
                            Descargar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Medical Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    Información Médica Básica
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Tipo de Sangre</Label>
                      <p className="text-lg font-semibold text-red-600">{personalInfo.bloodType}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Altura</Label>
                      <p className="text-lg font-semibold">175 cm</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Peso</Label>
                      <p className="text-lg font-semibold">70 kg</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">IMC</Label>
                      <p className="text-lg font-semibold">22.9</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Alergias</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {personalInfo.allergies.map((allergy, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-red-700 font-medium">{allergy}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Condiciones Crónicas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {personalInfo.chronicConditions.map((condition, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-orange-50 border border-orange-200 rounded-lg">
                        <Activity className="h-4 w-4 text-orange-500" />
                        <span className="text-orange-700 font-medium">{condition}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contacto de Emergencia</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <Label className="text-sm font-medium">Nombre</Label>
                    <p>{personalInfo.emergencyContact.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Relación</Label>
                    <p>{personalInfo.emergencyContact.relationship}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Teléfono</Label>
                    <p>{personalInfo.emergencyContact.phone}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );

  function Label({ children, className, ...props }: { children: React.ReactNode; className?: string; [key: string]: any }) {
    return (
      <label className={`text-sm font-medium ${className || ''}`} {...props}>
        {children}
      </label>
    );
  }
}