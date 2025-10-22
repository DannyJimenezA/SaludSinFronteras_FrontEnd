// App.tsx
import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { User } from "./types/user";
import { getMe } from "./services/users";
import { AuthProvider } from "./contexts/AuthContext";
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
import { ManageAvailability } from "./components/doctor/ManageAvailability";
import { BookAppointmentPage } from "./pages/BookAppointmentPage";

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
      <div className="min-h-screen bg-background">
        <Routes>
          {/* Ruta principal - Landing Page */}
          <Route path="/" element={<LandingPage />} />

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

        <Route
          path="/patient/book-appointment/:doctorId"
          element={
            <ProtectedRoute isAllowed={currentUser === "patient"}>
              <BookAppointmentPage />
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

        <Route
          path="/doctor/availability"
          element={
            <ProtectedRoute isAllowed={currentUser === "doctor"}>
              <ManageAvailability />
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
              <AppointmentScheduling />
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

        {/* Ruta 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
    </AuthProvider>
  );
}
