import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { verifyEmail } from "../services/auth";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Token de verificación no encontrado en la URL");
      return;
    }

    const verify = async () => {
      try {
        await verifyEmail(token);
        setStatus("success");
        setMessage("Tu cuenta ha sido verificada exitosamente. Ya puedes iniciar sesión.");
      } catch (err: any) {
        setStatus("error");
        setMessage(
          err?.message ||
          "No se pudo verificar la cuenta. El token puede haber expirado o ser inválido."
        );
      }
    };

    verify();
  }, [token]);

  const handleGoToLogin = () => {
    navigate("/login");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {status === "loading" && (
              <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
            )}
            {status === "success" && (
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            )}
            {status === "error" && (
              <XCircle className="h-16 w-16 text-red-500" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {status === "loading" && "Verificando tu cuenta"}
            {status === "success" && "Cuenta verificada"}
            {status === "error" && "Error de verificación"}
          </CardTitle>
          <CardDescription className="mt-2">
            {status === "loading" && "Por favor espera mientras verificamos tu cuenta..."}
            {status === "success" && message}
            {status === "error" && message}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {status === "success" && (
            <Button onClick={handleGoToLogin} className="w-full">
              Ir al inicio de sesión
            </Button>
          )}
          {status === "error" && (
            <>
              <Button onClick={handleGoToLogin} className="w-full">
                Ir al inicio de sesión
              </Button>
              <Button onClick={handleGoHome} variant="outline" className="w-full">
                Volver al inicio
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
