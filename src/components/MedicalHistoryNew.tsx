/**
 * Medical History Component
 * Displays patient's medical records with real API integration
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Skeleton } from './ui/skeleton';
import { useAuth } from '../contexts/AuthContext';
import { useMyMedicalRecords } from '../hooks/useMedicalRecords';
import {
  FileText,
  Download,
  Search,
  Calendar,
  Pill,
  Lock,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

export function MedicalHistoryNew() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch medical records from API
  const { data: records, isLoading, error } = useMyMedicalRecords();

  // Filter records by search term
  const filteredRecords = records?.filter((record) => {
    const search = searchTerm.toLowerCase();
    return (
      record.Diagnosis?.toLowerCase().includes(search) ||
      record.Doctor?.FirstName.toLowerCase().includes(search) ||
      record.Doctor?.LastName1.toLowerCase().includes(search) ||
      record.Doctor?.LicenseNumber?.toLowerCase().includes(search)
    );
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-24 w-full mb-4" />
            <Skeleton className="h-24 w-full mb-4" />
            <Skeleton className="h-24 w-full" />
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
            Error al cargar el historial médico: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">Mi Historial Médico</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                <Lock className="inline h-3 w-3 mr-1" />
                Información confidencial cifrada AES-256
              </p>
            </div>
            <Button onClick={() => navigate(-1)} variant="outline">
              Volver
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por diagnóstico, doctor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Empty State */}
          {!filteredRecords || filteredRecords.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {searchTerm ? 'No se encontraron registros' : 'Sin historial médico'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {searchTerm
                  ? 'Intenta con otros términos de búsqueda'
                  : 'Tus registros médicos aparecerán aquí después de tus consultas'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRecords.map((record) => (
                <Card key={record.RecordId} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">
                            {record.Doctor?.FirstName} {record.Doctor?.LastName1}
                          </h3>
                          {record.Doctor?.LicenseNumber && (
                            <Badge variant="secondary" className="text-xs">
                              {record.Doctor.LicenseNumber}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(record.CreatedAt).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/medical-records/${record.RecordId}`)}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Ver detalles
                      </Button>
                    </div>

                    {/* Diagnosis */}
                    {record.Diagnosis && (
                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Pill className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">Diagnóstico:</span>
                        </div>
                        <p className="text-sm text-muted-foreground ml-6">
                          {record.Diagnosis}
                        </p>
                      </div>
                    )}

                    {/* Files */}
                    {record.Files && record.Files.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            Archivos adjuntos ({record.Files.length})
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {record.Files.map((file, idx) => (
                            <Badge key={idx} variant="outline" className="cursor-pointer">
                              <Download className="h-3 w-3 mr-1" />
                              Archivo {idx + 1}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
