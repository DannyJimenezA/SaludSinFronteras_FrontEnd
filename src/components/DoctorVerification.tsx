/**
 * Doctor Verification Component
 * Allows doctors to submit verification documents and check status
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { Skeleton } from './ui/skeleton';
import {
  useMyVerificationStatus,
  useSubmitVerification,
} from '../hooks/useVerification';
import { useUploadFile } from '../hooks/useFiles';
import {
  Upload,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Download,
} from 'lucide-react';
import { toast } from 'sonner';

export function DoctorVerification() {
  const [files, setFiles] = useState<File[]>([]);
  const [notes, setNotes] = useState('');
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  const { data: verificationStatus, isLoading, refetch } = useMyVerificationStatus();
  const submitMutation = useSubmitVerification();
  const uploadMutation = useUploadFile();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (files.length + selectedFiles.length > 10) {
      toast.error('Máximo 10 documentos permitidos');
      return;
    }
    setFiles([...files, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleUploadAndSubmit = async () => {
    if (files.length === 0) {
      toast.error('Debes subir al menos 1 documento');
      return;
    }

    try {
      // Upload all files
      toast.info('Subiendo documentos...');
      const urls: string[] = [];

      for (const file of files) {
        const result = await uploadMutation.mutateAsync({ file });
        urls.push(result.file.Url);
      }

      setUploadedUrls(urls);

      // Submit verification
      await submitMutation.mutateAsync({
        CertificationDocuments: urls,
        Notes: notes,
      });

      toast.success('Documentos enviados exitosamente');
      setFiles([]);
      setNotes('');
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Error al enviar documentos');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-500">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Verificado
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Rechazado
          </Badge>
        );
      case 'pending':
      default:
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            Pendiente
          </Badge>
        );
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">Verificación de Doctor</CardTitle>
              <CardDescription className="mt-2">
                Sube tus documentos de certificación para ser verificado en la plataforma
              </CardDescription>
            </div>
            {verificationStatus && getStatusBadge(verificationStatus.VerificationStatus)}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Status */}
          {verificationStatus && verificationStatus.SubmittedAt && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {verificationStatus.VerificationStatus === 'pending' && (
                  <>
                    Tu solicitud está siendo revisada. Enviada el{' '}
                    {new Date(verificationStatus.SubmittedAt).toLocaleDateString()}
                  </>
                )}
                {verificationStatus.VerificationStatus === 'approved' && (
                  <>
                    ¡Felicitaciones! Tu cuenta ha sido verificada el{' '}
                    {verificationStatus.VerifiedAt &&
                      new Date(verificationStatus.VerifiedAt).toLocaleDateString()}
                    {verificationStatus.AdminNotes && (
                      <div className="mt-2 text-sm">
                        <strong>Notas:</strong> {verificationStatus.AdminNotes}
                      </div>
                    )}
                  </>
                )}
                {verificationStatus.VerificationStatus === 'rejected' && (
                  <>
                    Tu solicitud fue rechazada.
                    {verificationStatus.RejectionReason && (
                      <div className="mt-2 text-sm">
                        <strong>Razón:</strong> {verificationStatus.RejectionReason}
                      </div>
                    )}
                    <div className="mt-2 text-sm">
                      Por favor, corrige los problemas y vuelve a enviar tus documentos.
                    </div>
                  </>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Upload Form - Show only if not approved */}
          {(!verificationStatus || verificationStatus.VerificationStatus !== 'approved') && (
            <>
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Documentos de Certificación (1-10 archivos)
                </label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    multiple
                    onChange={handleFileChange}
                    disabled={files.length >= 10}
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">
                      Haz clic para subir o arrastra archivos aquí
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">
                      PDF, JPG, PNG (máximo 10 archivos)
                    </span>
                  </label>
                </div>

                {/* File List */}
                {files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm">{file.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Notas adicionales (opcional)
                </label>
                <Textarea
                  placeholder="Ej: Licencia médica vigente hasta 2030. Especialidad en medicina interna."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleUploadAndSubmit}
                disabled={files.length === 0 || submitMutation.isPending || uploadMutation.isPending}
                className="w-full"
              >
                {submitMutation.isPending || uploadMutation.isPending ? (
                  <>Enviando...</>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Enviar Documentos
                  </>
                )}
              </Button>
            </>
          )}

          {/* Previously Submitted Documents */}
          {verificationStatus?.CertificationDocuments &&
            verificationStatus.CertificationDocuments.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-3">Documentos enviados</h3>
                <div className="space-y-2">
                  {verificationStatus.CertificationDocuments.map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm">Documento {idx + 1}</span>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={doc} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
