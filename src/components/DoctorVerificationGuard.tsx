import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getMyVerificationStatus } from "../services/verification";
import { Loader2 } from "lucide-react";

interface DoctorVerificationGuardProps {
  children: React.ReactNode;
}

/**
 * Guard que verifica el estado de verificación del doctor.
 * - Si el doctor NO está verificado (pending/rejected), redirige a /settings
 * - Si el doctor está aprobado (approved), permite el acceso
 * - La ruta /settings SIEMPRE está permitida para que puedan completar su perfil
 */
export function DoctorVerificationGuard({ children }: DoctorVerificationGuardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    // Si ya estamos en /settings, permitir acceso sin verificar
    if (location.pathname === "/settings") {
      setIsChecking(false);
      setIsApproved(true); // Permitir renderizar settings
      return;
    }

    // Verificar estado de verificación
    const checkVerification = async () => {
      try {
        const status = await getMyVerificationStatus();

        // Si el doctor está aprobado, permitir acceso
        if (status.VerificationStatus === "approved") {
          setIsApproved(true);
        } else {
          // Si no está aprobado (pending, rejected, o sin verificación), redirigir a settings
          console.log("[DoctorVerificationGuard] Doctor not approved, redirecting to /settings");
          navigate("/settings", { replace: true });
        }
      } catch (error) {
        console.error("[DoctorVerificationGuard] Error checking verification:", error);
        // En caso de error, redirigir a settings para que pueda completar su perfil
        navigate("/settings", { replace: true });
      } finally {
        setIsChecking(false);
      }
    };

    checkVerification();
  }, [location.pathname, navigate]);

  // Mostrar loading mientras verificamos
  if (isChecking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // Si está en settings o está aprobado, renderizar children
  if (location.pathname === "/settings" || isApproved) {
    return <>{children}</>;
  }

  // Si no está aprobado y no está en settings, no renderizar nada (ya se redirigió)
  return null;
}
