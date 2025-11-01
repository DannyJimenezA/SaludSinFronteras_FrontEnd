/**
 * Medical Record Detail Component
 * Displays full details of a single medical record
 */

import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import {
  ArrowLeft,
  FileText,
  Download,
  Calendar,
  Pill,
  ClipboardList,
  Lightbulb,
  Lock,
  AlertCircle,
  User,
  Mail,
  Building,
} from 'lucide-react';
import { useMedicalRecord } from '../hooks/useMedicalRecords';

export function MedicalRecordDetail() {
  const { recordId } = useParams<{ recordId: string }>();
  const navigate = useNavigate();

  const { data: record, isLoading, error } = useMedicalRecord(recordId);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
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
            Error al cargar el registro médico: {error.message}
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => navigate(-1)} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Registro médico no encontrado</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => navigate(-1)} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header with Back Button */}
      <div className="mb-6">
        <Button onClick={() => navigate(-1)} variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al historial
        </Button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Detalle de Registro Médico</h1>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Lock className="h-3 w-3" />
              Información confidencial cifrada AES-256
            </p>
          </div>
          <Badge variant="outline" className="text-sm">
            ID: {record.RecordId}
          </Badge>
        </div>
      </div>

      {/* Doctor Information Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Información del Doctor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Nombre Completo</p>
              <p className="font-medium">
                {record.Doctor?.FirstName} {record.Doctor?.LastName1}
                {record.Doctor?.LastName2 && ` ${record.Doctor.LastName2}`}
              </p>
            </div>
            {record.Doctor?.Email && (
              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  Email
                </p>
                <p className="font-medium">{record.Doctor.Email}</p>
              </div>
            )}
            {record.Doctor?.LicenseNumber && (
              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                  <Building className="h-3 w-3" />
                  Número de Licencia
                </p>
                <Badge variant="secondary">{record.Doctor.LicenseNumber}</Badge>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Fecha de Consulta
              </p>
              <p className="font-medium">
                {new Date(record.CreatedAt).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medical Information */}
      <div className="space-y-4">
        {/* Diagnosis */}
        {record.Diagnosis && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Pill className="h-5 w-5 text-primary" />
                Diagnóstico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">{record.Diagnosis}</p>
            </CardContent>
          </Card>
        )}

        {/* Prescriptions */}
        {record.Prescriptions && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ClipboardList className="h-5 w-5 text-blue-600" />
                Prescripciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">{record.Prescriptions}</p>
            </CardContent>
          </Card>
        )}

        {/* Recommendations */}
        {record.Recommendations && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
                Recomendaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {record.Recommendations}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Files */}
        {record.Files && record.Files.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-green-600" />
                Archivos Adjuntos ({record.Files.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {record.Files.map((file, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => window.open(file, '_blank')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Archivo {idx + 1}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty state if no medical data */}
        {!record.Diagnosis &&
          !record.Prescriptions &&
          !record.Recommendations &&
          (!record.Files || record.Files.length === 0) && (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay información médica detallada en este registro</p>
              </CardContent>
            </Card>
          )}
      </div>

      <Separator className="my-6" />

      {/* Footer Actions */}
      <div className="flex gap-3 justify-end">
        <Button onClick={() => navigate(-1)} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al historial
        </Button>
        <Button onClick={() => window.print()}>
          <Download className="h-4 w-4 mr-2" />
          Imprimir / Exportar PDF
        </Button>
      </div>
    </div>
  );
}
