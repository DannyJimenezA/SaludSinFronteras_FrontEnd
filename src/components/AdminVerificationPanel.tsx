/**
 * Admin Verification Panel Component
 * Allows admins to review and manage doctor verification requests
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  usePendingVerifications,
  useApprovedVerifications,
  useRejectedVerifications,
  useReviewVerification,
  useDoctorVerification,
} from '../hooks/useVerification';
import { reviewVerificationSchema, type ReviewVerificationInput } from '../lib/validations';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Skeleton } from './ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import {
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  AlertCircle,
  ExternalLink,
  User,
  Mail,
  Building,
  GraduationCap,
  Award,
  Globe,
  ArrowLeft,
} from 'lucide-react';
import { toast } from 'sonner';
import type { PendingDoctorVerification, VerificationResponseDto } from '../types/verification';

export function AdminVerificationPanel() {
  const navigate = useNavigate();
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: pending, isLoading: loadingPending } = usePendingVerifications();
  const { data: approved, isLoading: loadingApproved } = useApprovedVerifications();
  const { data: rejected, isLoading: loadingRejected } = useRejectedVerifications();

  // Fetch full details of selected doctor
  const { data: selectedVerification } = useDoctorVerification(selectedDoctorId || undefined);

  const { mutate: reviewVerification, isPending: isReviewing } = useReviewVerification();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReviewVerificationInput>({
    resolver: zodResolver(reviewVerificationSchema),
    defaultValues: {
      Action: 'approve',
    },
  });

  const action = watch('Action');

  const handleReview = (data: ReviewVerificationInput) => {
    if (!selectedDoctorId) return;

    reviewVerification(
      {
        doctorId: selectedDoctorId,
        payload: {
          Action: data.Action,
          AdminNotes: data.AdminNotes,
          RejectionReason: data.RejectionReason,
        },
      },
      {
        onSuccess: () => {
          toast.success(
            data.Action === 'approve'
              ? 'Verificación aprobada exitosamente'
              : 'Verificación rechazada'
          );
          setIsDialogOpen(false);
          setSelectedDoctorId(null);
          reset();
        },
        onError: (error: any) => {
          toast.error(error.message || 'Error al procesar la verificación');
        },
      }
    );
  };

  const openReviewDialog = (userId: string | bigint) => {
    setSelectedDoctorId(userId.toString());
    setIsDialogOpen(true);
    reset();
  };

  const renderPendingCard = (verification: PendingDoctorVerification) => {
    // Cargar detalles completos si es el doctor seleccionado
    const fullDetails = selectedDoctorId === String(verification.UserId) ? selectedVerification : null;

    return (
      <Card key={String(verification.UserId)} className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                {verification.DoctorName}
              </CardTitle>
              <CardDescription className="flex flex-col gap-1">
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {verification.Email}
                </span>
                {verification.LicenseNumber && (
                  <span className="flex items-center gap-1">
                    <Building className="h-3 w-3" />
                    Licencia: {verification.LicenseNumber}
                  </span>
                )}
              </CardDescription>
            </div>
            <Badge variant="secondary">
              <Clock className="h-3 w-3 mr-1" />
              Pendiente
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Documents */}
          {fullDetails?.CertificationDocuments && fullDetails.CertificationDocuments.length > 0 && (
            <div>
              <Label className="text-sm font-semibold mb-2 block">
                <FileText className="h-4 w-4 inline mr-1" />
                Documentos ({fullDetails.CertificationDocuments.length})
              </Label>
              <div className="flex flex-wrap gap-2">
                {fullDetails.CertificationDocuments.map((doc, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(doc, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Documento {idx + 1}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {!fullDetails && (
            <div>
              <Label className="text-sm font-semibold mb-2 block">
                <FileText className="h-4 w-4 inline mr-1" />
                Documentos: {verification.DocumentsCount}
              </Label>
              <p className="text-xs text-muted-foreground">
                Haz clic en "Ver Detalles" para ver los documentos
              </p>
            </div>
          )}

          {/* Additional Info if loaded */}
          {fullDetails && (
            <div className="grid grid-cols-2 gap-3 text-sm">
              {fullDetails.YearsExperience !== undefined && (
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs">{fullDetails.YearsExperience} años exp.</span>
                </div>
              )}
              {fullDetails.LicenseCountry && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs">{fullDetails.LicenseCountry}</span>
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          {fullDetails?.VerificationNotes && (
            <div>
              <Label className="text-sm font-semibold mb-1 block">Notas del Doctor</Label>
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                {fullDetails.VerificationNotes}
              </p>
            </div>
          )}

          {/* Dates */}
          <div className="text-xs text-muted-foreground">
            <p>Enviado: {new Date(verification.SubmittedAt).toLocaleString('es-CR')}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {!fullDetails && (
              <Button
                className="flex-1"
                variant="outline"
                onClick={() => {
                  setSelectedDoctorId(verification.UserId.toString());
                }}
              >
                Ver Detalles
              </Button>
            )}
            <Button
              className="flex-1"
              onClick={() => openReviewDialog(verification.UserId)}
            >
              Revisar Verificación
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderFullVerificationCard = (verification: VerificationResponseDto) => (
    <Card key={String(verification.UserId)} className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5" />
              {verification.DoctorName}
            </CardTitle>
            <CardDescription className="flex flex-col gap-1">
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {verification.Email}
              </span>
              {verification.LicenseNumber && (
                <span className="flex items-center gap-1">
                  <Building className="h-3 w-3" />
                  Licencia: {verification.LicenseNumber}
                </span>
              )}
              {verification.LicenseCountry && (
                <span className="flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  País: {verification.LicenseCountry}
                </span>
              )}
            </CardDescription>
          </div>
          <Badge
            variant={
              verification.VerificationStatus === 'approved'
                ? 'default'
                : verification.VerificationStatus === 'rejected'
                ? 'destructive'
                : 'secondary'
            }
          >
            {verification.VerificationStatus === 'approved' && <CheckCircle2 className="h-3 w-3 mr-1" />}
            {verification.VerificationStatus === 'rejected' && <XCircle className="h-3 w-3 mr-1" />}
            {verification.VerificationStatus === 'pending' && <Clock className="h-3 w-3 mr-1" />}
            {verification.VerificationStatus === 'approved'
              ? 'Aprobado'
              : verification.VerificationStatus === 'rejected'
              ? 'Rechazado'
              : 'Pendiente'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Additional Info */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          {verification.MedicalSchool && (
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs">{verification.MedicalSchool}</span>
            </div>
          )}
          {verification.YearsExperience !== undefined && (
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs">{verification.YearsExperience} años de experiencia</span>
            </div>
          )}
        </div>

        {/* Documents */}
        {verification.CertificationDocuments && verification.CertificationDocuments.length > 0 && (
          <div>
            <Label className="text-sm font-semibold mb-2 block">
              <FileText className="h-4 w-4 inline mr-1" />
              Documentos ({verification.CertificationDocuments.length})
            </Label>
            <div className="flex flex-wrap gap-2">
              {verification.CertificationDocuments.map((doc, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(doc, '_blank')}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Documento {idx + 1}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {verification.VerificationNotes && (
          <div>
            <Label className="text-sm font-semibold mb-1 block">Notas del Doctor</Label>
            <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
              {verification.VerificationNotes}
            </p>
          </div>
        )}

        {/* Rejection Reason */}
        {verification.RejectionReason && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <span className="font-semibold">Razón de rechazo:</span>{' '}
              {verification.RejectionReason}
            </AlertDescription>
          </Alert>
        )}

        {/* Dates */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>Enviado: {new Date(verification.SubmittedAt).toLocaleString('es-CR')}</p>
          {verification.VerifiedAt && (
            <p>Verificado: {new Date(verification.VerifiedAt).toLocaleString('es-CR')}</p>
          )}
          <p>Actualizado: {new Date(verification.UpdatedAt).toLocaleString('es-CR')}</p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" onClick={() => navigate('/admin-panel')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>
        <h1 className="text-3xl font-bold mb-2">Panel de Verificaciones</h1>
        <p className="text-muted-foreground">
          Gestiona las solicitudes de verificación de doctores
        </p>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pendientes ({pending?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Aprobadas ({approved?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            Rechazadas ({rejected?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {loadingPending ? (
            <>
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </>
          ) : pending && pending.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pending.map(renderPendingCard)}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay verificaciones pendientes</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {loadingApproved ? (
            <>
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </>
          ) : approved && approved.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {approved.map(renderFullVerificationCard)}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay verificaciones aprobadas</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {loadingRejected ? (
            <>
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </>
          ) : rejected && rejected.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {rejected.map(renderFullVerificationCard)}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <XCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay verificaciones rechazadas</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Review Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Revisar Verificación</DialogTitle>
            <DialogDescription>
              Revisa y aprueba o rechaza la verificación de{' '}
              {selectedVerification?.DoctorName}
            </DialogDescription>
          </DialogHeader>

          {/* Doctor Details Section */}
          {selectedVerification && (
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold text-lg">Información del Doctor</h3>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-xs text-muted-foreground">Nombre Completo</Label>
                  <p className="font-medium">{selectedVerification.DoctorName}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Email</Label>
                  <p className="font-medium">{selectedVerification.Email}</p>
                </div>
                {selectedVerification.LicenseNumber && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Número de Licencia</Label>
                    <p className="font-medium">{selectedVerification.LicenseNumber}</p>
                  </div>
                )}
                {selectedVerification.LicenseCountry && (
                  <div>
                    <Label className="text-xs text-muted-foreground">País de Licencia</Label>
                    <p className="font-medium">{selectedVerification.LicenseCountry}</p>
                  </div>
                )}
                {selectedVerification.YearsExperience !== undefined && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Años de Experiencia</Label>
                    <p className="font-medium">{selectedVerification.YearsExperience} años</p>
                  </div>
                )}
                {selectedVerification.MedicalSchool && (
                  <div className="col-span-2">
                    <Label className="text-xs text-muted-foreground">Escuela de Medicina</Label>
                    <p className="font-medium">{selectedVerification.MedicalSchool}</p>
                  </div>
                )}
              </div>

              {/* Bio */}
              {selectedVerification.Bio && (
                <div>
                  <Label className="text-xs text-muted-foreground">Biografía</Label>
                  <p className="text-sm mt-1">{selectedVerification.Bio}</p>
                </div>
              )}

              {/* Specialties */}
              {selectedVerification.Specialties && selectedVerification.Specialties.length > 0 && (
                <div>
                  <Label className="text-xs text-muted-foreground">Especialidades</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedVerification.Specialties.map((spec: any) => (
                      <Badge key={spec.Id} variant="secondary">
                        {spec.Name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Documents */}
              {selectedVerification.CertificationDocuments && selectedVerification.CertificationDocuments.length > 0 && (
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">
                    Documentos de Certificación ({selectedVerification.CertificationDocuments.length})
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedVerification.CertificationDocuments.map((doc, idx) => (
                      <Button
                        key={idx}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(doc, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Ver Documento {idx + 1}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Doctor's Notes */}
              {selectedVerification.VerificationNotes && (
                <div>
                  <Label className="text-xs text-muted-foreground">Notas del Doctor</Label>
                  <p className="text-sm bg-background p-3 rounded-md mt-1">
                    {selectedVerification.VerificationNotes}
                  </p>
                </div>
              )}

              {/* Submission Date */}
              <div className="text-xs text-muted-foreground">
                <p>Enviado: {new Date(selectedVerification.SubmittedAt).toLocaleString('es-CR')}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(handleReview)} className="space-y-4">
            {/* Action Radio Group */}
            <div className="space-y-3">
              <Label>Acción *</Label>
              <RadioGroup
                defaultValue="approve"
                onValueChange={(value) => {
                  register('Action').onChange({ target: { value } });
                }}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="approve" id="approve" />
                  <Label htmlFor="approve" className="font-normal cursor-pointer">
                    <CheckCircle2 className="h-4 w-4 inline mr-1 text-green-600" />
                    Aprobar verificación
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="reject" id="reject" />
                  <Label htmlFor="reject" className="font-normal cursor-pointer">
                    <XCircle className="h-4 w-4 inline mr-1 text-red-600" />
                    Rechazar verificación
                  </Label>
                </div>
              </RadioGroup>
              {errors.Action && (
                <p className="text-sm text-destructive">{errors.Action.message}</p>
              )}
            </div>

            {/* Admin Notes */}
            <div className="space-y-2">
              <Label htmlFor="adminNotes">
                Notas del Administrador {action === 'approve' && '(Opcional)'}
              </Label>
              <Textarea
                id="adminNotes"
                {...register('AdminNotes')}
                placeholder="Agregue notas adicionales sobre esta revisión..."
                rows={3}
              />
              {errors.AdminNotes && (
                <p className="text-sm text-destructive">{errors.AdminNotes.message}</p>
              )}
            </div>

            {/* Rejection Reason (only if rejecting) */}
            {action === 'reject' && (
              <div className="space-y-2">
                <Label htmlFor="rejectionReason">Razón de Rechazo *</Label>
                <Textarea
                  id="rejectionReason"
                  {...register('RejectionReason')}
                  placeholder="Explique por qué se rechaza esta verificación (mínimo 10 caracteres)..."
                  rows={4}
                  className="border-destructive focus-visible:ring-destructive"
                />
                {errors.RejectionReason && (
                  <p className="text-sm text-destructive">{errors.RejectionReason.message}</p>
                )}
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  reset();
                }}
                disabled={isReviewing}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isReviewing}
                variant={action === 'approve' ? 'default' : 'destructive'}
              >
                {isReviewing
                  ? 'Procesando...'
                  : action === 'approve'
                  ? 'Aprobar Verificación'
                  : 'Rechazar Verificación'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
