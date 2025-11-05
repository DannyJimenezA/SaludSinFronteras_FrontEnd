// App.tsx
import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { User } from "./types/user";
import { getMe } from "./services/users";
import { AuthProvider } from "./contexts/AuthContext";

import { LandingPageNew } from "./components/LandingPageNew";

import { Toaster } from "sonner";
import "@livekit/components-styles";
import { LandingPage } from "./components/LandingPage";

import { WelcomeLogin } from "./components/WelcomeLogin";
import { ForgotPassword } from "./components/ForgotPassword";
import { VerifyEmail } from "./components/VerifyEmail";
import { ResetPassword } from "./components/ResetPassword";
import { PatientDashboard } from "./components/PatientDashboard";
import { DoctorDashboard } from "./components/DoctorDashboard";
import { AdminPanel } from "./components/AdminPanel";
import { AppointmentScheduling } from "./components/AppointmentScheduling";
import { VideoCall } from "./components/VideoCall";
import { MedicalHistory } from "./components/MedicalHistory";
import { Settings as SettingsPage } from "./components/Settings";
import { PaymentsBilling } from "./components/PaymentsBilling";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { NotFound } from "./components/NotFound";

// Nuevos componentes implementados
import { MedicalHistoryNew } from "./components/MedicalHistoryNew";
import { MedicalRecordDetail } from "./components/MedicalRecordDetail";
import { DoctorVerification } from "./components/DoctorVerification";
import { VideoCallRoom } from "./components/VideoCallRoom";
import { SubscriptionPlans } from "./components/SubscriptionPlans";
import { ChatWithWebSocket } from "./components/ChatWithWebSocket";
import { AdminVerificationPanel } from "./components/AdminVerificationPanel";
import { AdminSettings } from "./components/AdminSettings";
import { NuevaCita } from "./components/NuevaCita";
import { Mensajes } from "./components/Mensajes";
import { MisCitas } from "./components/MisCitas";
import { AgendarCitaDoctor } from "./components/AgendarCitaDoctor";
import { AdminSpecialties } from "./components/AdminSpecialties";
import { DoctorAppointments } from "./components/DoctorAppointments";
import { DoctorAvailability } from "./components/DoctorAvailability";

type UserType = "patient" | "doctor" | "admin" | null;

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserType>(null);
  const [me, setMe] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // -------- helpers de rol --------
  const getHomeByRole = (role: UserType): string => {
    if (role === "doctor") return "/doctor-dashboard";
    if (role === "admin") return "/admin-panel";
    if (role === "patient") return "/patient-dashboard";
    return "/";
  };

  // -------- login --------
  const handleLogin = async (userType: UserType) => {
    setCurrentUser(userType);
    try {
      const profile = await getMe();
      setMe(profile);
    } catch {
      /* no-op */
    }
    navigate(getHomeByRole(userType));
  };

  // -------- logout --------
  const handleLogout = () => {
    setCurrentUser(null);
    setMe(null);
    localStorage.removeItem("access_token");
    navigate("/");
  };

  // Datos derivados del perfil
  const patientId =
    me?.id ? (typeof me.id === "string" ? Number(me.id) : (me.id as number)) : 0;

  const patientName =
    me?.fullName ||
    [me?.firstName1, me?.lastName1, me?.lastName2].filter(Boolean).join(" ") ||
    "Paciente";

  // Autocargar perfil si ya hay token en localStorage
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    (async () => {
      try {
        const profile = await getMe();
        setMe(profile);
        const role = String(profile.role ?? "").toUpperCase();
        const ui: UserType =
          role === "DOCTOR" ? "doctor" : role === "ADMIN" ? "admin" : "patient";
        setCurrentUser(ui);

        // Solo redirigir si estamos en la página de login o landing
        if (location.pathname === "/" || location.pathname === "/login") {
          navigate(getHomeByRole(ui), { replace: true });
        }
      } catch {
        // token inválido → limpiar y quedarse en welcome
        localStorage.removeItem("access_token");
      } finally {
        setIsLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">Cargando...</div>
      </div>
    );
  }

  return (
    <AuthProvider currentUser={currentUser}>
      <Toaster position="top-right" richColors />
      <div className="min-h-screen bg-background">
        <Routes>
          {/* Ruta principal - Landing Page */}
          <Route path="/" element={<LandingPageNew />} />

          {/* Ruta pública - Login/Welcome */}
          <Route path="/login" element={<WelcomeLogin onLogin={handleLogin} />} />

          {/* Ruta pública - Recuperar contraseña */}
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Ruta pública - Restablecer contraseña */}
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Ruta pública - Verificar email */}
          <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Rutas protegidas - Paciente */}
        <Route
          path="/patient-dashboard"
          element={
            <ProtectedRoute isAllowed={currentUser === "patient"}>
              <PatientDashboard
                patientId={patientId}
                patientName={patientName}
              />
            </ProtectedRoute>
          }
        />

        {/* Rutas protegidas - Doctor */}
        <Route
          path="/doctor-dashboard"
          element={
            <ProtectedRoute isAllowed={currentUser === "doctor"}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />

        {/* Rutas protegidas - Admin */}
        <Route
          path="/admin-panel"
          element={
            <ProtectedRoute isAllowed={currentUser === "admin"}>
              <AdminPanel />
            </ProtectedRoute>
          }
        />

        {/* Rutas compartidas - requieren estar autenticado */}
        <Route
          path="/appointments"
          element={
            <ProtectedRoute isAllowed={currentUser !== null}>
              {currentUser === "doctor" ? <DoctorAppointments /> : <AppointmentScheduling />}
            </ProtectedRoute>
          }
        />

        <Route
          path="/appointments/:doctorId"
          element={
            <ProtectedRoute isAllowed={currentUser !== null}>
              <AppointmentScheduling />
            </ProtectedRoute>
          }
        />

        <Route
          path="/video-call"
          element={
            <ProtectedRoute isAllowed={currentUser !== null}>
              <VideoCall />
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute isAllowed={currentUser !== null}>
              <MedicalHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/prescriptions"
          element={
            <ProtectedRoute isAllowed={currentUser !== null}>
              <MedicalHistory />
            </ProtectedRoute>
          }
        />

        {/* === NUEVAS RUTAS IMPLEMENTADAS === */}

        {/* Historial médico con API real */}
        <Route
          path="/medical-history"
          element={
            <ProtectedRoute isAllowed={currentUser !== null}>
              <MedicalHistoryNew />
            </ProtectedRoute>
          }
        />

        {/* Detalle de registro médico individual */}
        <Route
          path="/medical-records/:recordId"
          element={
            <ProtectedRoute isAllowed={currentUser !== null}>
              <MedicalRecordDetail />
            </ProtectedRoute>
          }
        />

        {/* Verificación de doctores */}
        <Route
          path="/verification"
          element={
            <ProtectedRoute isAllowed={currentUser === "doctor"}>
              <DoctorVerification />
            </ProtectedRoute>
          }
        />

        {/* Video llamada con LiveKit */}
        <Route
          path="/video-call/:appointmentId"
          element={
            <ProtectedRoute isAllowed={currentUser !== null}>
              <VideoCallRoom />
            </ProtectedRoute>
          }
        />

        {/* Planes de suscripción */}
        <Route
          path="/subscription"
          element={
            <ProtectedRoute isAllowed={currentUser !== null}>
              <SubscriptionPlans />
            </ProtectedRoute>
          }
        />

        {/* Chat en tiempo real */}
        <Route
          path="/chat/:conversationId"
          element={
            <ProtectedRoute isAllowed={currentUser !== null}>
              <ChatWithWebSocket />
            </ProtectedRoute>
          }
        />

        {/* Panel de administración de verificaciones */}
        <Route
          path="/admin/verification"
          element={
            <ProtectedRoute isAllowed={currentUser === "admin"}>
              <AdminVerificationPanel />
            </ProtectedRoute>
          }
        />

        {/* Panel de administración de especialidades */}
        <Route
          path="/admin/specialties"
          element={
            <ProtectedRoute isAllowed={currentUser === "admin"}>
              <AdminSpecialties />
            </ProtectedRoute>
          }
        />

        {/* Configuración de administrador */}
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute isAllowed={currentUser === "admin"}>
              <AdminSettings onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute isAllowed={currentUser !== null}>
              <SettingsPage onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payments"
          element={
            <ProtectedRoute isAllowed={currentUser !== null}>
              <PaymentsBilling />
            </ProtectedRoute>
          }
        />

        {/* Alias para búsqueda de médicos */}
        <Route path="/search-doctors" element={<Navigate to="/appointments" replace />} />

        {/* === RUTAS MINIMALISTAS DASHBOARD === */}

        {/* Nueva cita - página básica */}
        <Route
          path="/nueva-cita"
          element={
            <ProtectedRoute isAllowed={currentUser !== null}>
              <NuevaCita />
            </ProtectedRoute>
          }
        />

        {/* Agendar cita con doctor específico */}
        <Route
          path="/nueva-cita/:doctorId"
          element={
            <ProtectedRoute isAllowed={currentUser !== null}>
              <AgendarCitaDoctor />
            </ProtectedRoute>
          }
        />

        {/* Mensajes - página básica */}
        <Route
          path="/mensajes"
          element={
            <ProtectedRoute isAllowed={currentUser !== null}>
              <Mensajes />
            </ProtectedRoute>
          }
        />

        {/* Alias para mensajes */}
        <Route
          path="/messages"
          element={
            <ProtectedRoute isAllowed={currentUser !== null}>
              <Mensajes />
            </ProtectedRoute>
          }
        />

        {/* Mis citas - página básica */}
        <Route
          path="/mis-citas"
          element={
            <ProtectedRoute isAllowed={currentUser !== null}>
              <MisCitas />
            </ProtectedRoute>
          }
        />

        {/* Disponibilidad del doctor */}
        <Route
          path="/availability"
          element={
            <ProtectedRoute isAllowed={currentUser === "doctor"}>
              <DoctorAvailability />
            </ProtectedRoute>
          }
        />

        {/* Ruta 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
    </AuthProvider>
  );
}
