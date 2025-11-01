/**
 * Subscription Plans Component
 * Displays available plans and allows users to subscribe
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Skeleton } from './ui/skeleton';
import {
  usePlans,
  useMySubscription,
  useCreateSubscription,
  useCancelSubscription,
} from '../hooks/useSubscriptions';
import { Check, Crown, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function SubscriptionPlans() {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const { data: plans, isLoading: plansLoading } = usePlans();
  const { data: currentSubscription, refetch: refetchSubscription } = useMySubscription();
  const createMutation = useCreateSubscription();
  const cancelMutation = useCancelSubscription();

  const handleSubscribe = async (planId: string) => {
    try {
      await createMutation.mutateAsync({ PlanId: planId });
      toast.success('¡Suscripción creada exitosamente!');
      refetchSubscription();
    } catch (error: any) {
      toast.error(error.message || 'Error al crear suscripción');
    }
  };

  const handleCancel = async () => {
    if (!confirm('¿Estás seguro de que deseas cancelar tu suscripción?')) {
      return;
    }

    try {
      await cancelMutation.mutateAsync();
      toast.success('Suscripción cancelada');
      refetchSubscription();
    } catch (error: any) {
      toast.error(error.message || 'Error al cancelar suscripción');
    }
  };

  if (plansLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-40 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Planes de Suscripción</h1>
        <p className="text-lg text-muted-foreground">
          Elige el plan que mejor se adapte a tus necesidades
        </p>
      </div>

      {/* Current Subscription */}
      {currentSubscription && currentSubscription.Status === 'ACTIVE' && (
        <Alert className="mb-8">
          <Crown className="h-4 w-4" />
          <AlertDescription>
            <div className="flex justify-between items-center">
              <div>
                Plan actual: <strong>{currentSubscription.Plan?.Name}</strong> -{' '}
                {currentSubscription.AppointmentsUsed}/{currentSubscription.AppointmentsLimit}{' '}
                citas utilizadas
                {currentSubscription.NextBillingDate && (
                  <span className="ml-2 text-sm text-muted-foreground">
                    (Renueva el{' '}
                    {new Date(currentSubscription.NextBillingDate).toLocaleDateString()})
                  </span>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={cancelMutation.isPending}
              >
                {cancelMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Cancelar plan'
                )}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Plans Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {plans?.map((plan) => {
          const isCurrentPlan =
            currentSubscription?.Status === 'ACTIVE' &&
            currentSubscription?.PlanId === plan.PlanId;
          const isMonthly = plan.Interval === 'MONTHLY';

          return (
            <Card
              key={plan.PlanId}
              className={`relative ${isCurrentPlan ? 'border-primary shadow-lg' : ''}`}
            >
              {isCurrentPlan && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  Plan Actual
                </Badge>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.Name}</CardTitle>
                <CardDescription>{plan.Description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Price */}
                <div className="text-center py-4">
                  <div className="text-4xl font-bold">
                    {plan.Currency === 'USD' ? '$' : plan.Currency} {plan.Price}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    / {isMonthly ? 'mes' : 'año'}
                  </div>
                </div>

                {/* Appointments */}
                <div className="text-center py-2 bg-secondary rounded-lg">
                  <div className="text-2xl font-semibold">{plan.AppointmentsPerMonth}</div>
                  <div className="text-sm text-muted-foreground">
                    citas por {isMonthly ? 'mes' : 'año'}
                  </div>
                </div>

                {/* Features */}
                {plan.Features && plan.Features.length > 0 && (
                  <ul className="space-y-2">
                    {plan.Features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  disabled={
                    isCurrentPlan ||
                    createMutation.isPending ||
                    !plan.IsActive ||
                    (currentSubscription?.Status === 'ACTIVE' && !isCurrentPlan)
                  }
                  onClick={() => handleSubscribe(plan.PlanId)}
                >
                  {createMutation.isPending && selectedPlanId === plan.PlanId ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Procesando...
                    </>
                  ) : isCurrentPlan ? (
                    'Plan Actual'
                  ) : currentSubscription?.Status === 'ACTIVE' ? (
                    'Cambiar Plan'
                  ) : (
                    'Suscribirse'
                  )}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Free Tier Info */}
      {!currentSubscription && (
        <div className="mt-8 text-center text-sm text-muted-foreground">
          Sin suscripción activa. Elige un plan para acceder a consultas médicas.
        </div>
      )}
    </div>
  );
}
