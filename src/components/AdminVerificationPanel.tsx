/**
 * Admin Verification Panel Component
 * Allows admins to review and manage doctor verification requests
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  usePendingVerifications,
  useApprovedVerifications,
  useRejectedVerifications,
  useReviewVerification,
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
  DialogTrigger,
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
} from 'lucide-react';
import { toast } from 'sonner';
import type { DoctorVerification } from '../types/verification';

export function AdminVerificationPanel() {
  const [selectedVerification, setSelectedVerification] = useState<DoctorVerification | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: pending, isLoading: loadingPending } = usePendingVerifications();
  const { data: approved, isLoading: loadingApproved } = useApprovedVerifications();
  const { data: rejected, isLoading: loadingRejected } = useRejectedVerifications();

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
    if (!selectedVerification) return;

    reviewVerification(
      {
        doctorId: selectedVerification.DoctorUserId.toString(),
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
          setSelectedVerification(null);
          reset();
        },
        onError: (error: any) => {
          toast.error(error.message || 'Error al procesar la verificación');
        },
      }
    );
  };

  const openReviewDialog = (verification: DoctorVerification) => {
    setSelectedVerification(verification);
    setIsDialogOpen(true);
    reset();
  };

  const renderVerificationCard = (verification: DoctorVerification) => (
    <Card key={verification.VerificationId} className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5" />
              {verification.Doctor?.FirstName} {verification.Doctor?.LastName1}
            </CardTitle>
            <CardDescription className="flex flex-col gap-1">
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {verification.Doctor?.Email}
              </span>
              {verification.Doctor?.LicenseNumber && (
                <span className="flex items-center gap-1">
                  <Building className="h-3 w-3" />
                  Licencia: {verification.Doctor.LicenseNumber}
                </span>
              )}
            </CardDescription>
          </div>
          <Badge
            variant={
              verification.Status === 'approved'
                ? 'default'
                : verification.Status === 'rejected'
                ? 'destructive'
                : 'secondary'
            }
          >
            {verification.Status === 'approved' && <CheckCircle2 className="h-3 w-3 mr-1" />}
            {verification.Status === 'rejected' && <XCircle className="h-3 w-3 mr-1" />}
            {verification.Status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
            {verification.Status === 'approved'
              ? 'Aprobado'
              : verification.Status === 'rejected'
              ? 'Rechazado'
              : 'Pendiente'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Documents */}
        <div>
          <Label className="text-sm font-semibold mb-2 block">
            <FileText className="h-4 w-4 inline mr-1" />
            Documentos ({verification.CertificationDocuments?.length || 0})
          </Label>
          <div className="flex flex-wrap gap-2">
            {verification.CertificationDocuments?.map((doc, idx) => (
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

        {/* Notes */}
        {verification.Notes && (
          <div>
            <Label className="text-sm font-semibold mb-1 block">Notas del Doctor</Label>
            <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
              {verification.Notes}
            </p>
          </div>
        )}

        {/* Admin Notes */}
        {verification.AdminNotes && (
          <div>
            <Label className="text-sm font-semibold mb-1 block">Notas del Administrador</Label>
            <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
              {verification.AdminNotes}
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
          {verification.ReviewedAt && (
            <p>Revisado: {new Date(verification.ReviewedAt).toLocaleString('es-CR')}</p>
          )}
        </div>

        {/* Actions */}
        {verification.Status === 'pending' && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full" onClick={() => openReviewDialog(verification)}>
                Revisar Verificación
              </Button>
            </DialogTrigger>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
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
              {pending.map(renderVerificationCard)}
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
              {approved.map(renderVerificationCard)}
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
              {rejected.map(renderVerificationCard)}
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Revisar Verificación</DialogTitle>
            <DialogDescription>
              Revisa y aprueba o rechaza la verificación de{' '}
              {selectedVerification?.Doctor?.FirstName}{' '}
              {selectedVerification?.Doctor?.LastName1}
            </DialogDescription>
          </DialogHeader>

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
