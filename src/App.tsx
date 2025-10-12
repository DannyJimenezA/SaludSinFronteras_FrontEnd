// App.tsx
import { useEffect, useState } from "react";
import { User } from "./types/user";
import { getMe } from "./services/users";
import { WelcomeLogin } from "./components/WelcomeLogin";
import { PatientDashboard } from "./components/PatientDashboard";
import { DoctorDashboard } from "./components/DoctorDashboard";
import { AdminPanel } from "./components/AdminPanel";
import { AppointmentScheduling } from "./components/AppointmentScheduling";
import { VideoCall } from "./components/VideoCall";
import { MedicalHistory } from "./components/MedicalHistory";
import { Settings as SettingsPage } from "./components/Settings";
import { PaymentsBilling } from "./components/PaymentsBilling";

type UserType = "patient" | "doctor" | "admin" | null;

// Agregamos 'home' como alias neutral
type Screen =
  | "home"
  | "welcome"
  | "patient-dashboard"
  | "doctor-dashboard"
  | "admin-panel"
  | "appointments"
  | "search-doctors"
  | "video-call"
  | "history"
  | "settings"
  | "payments"
  | "prescriptions";

type NavParams = { doctorId?: number };

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserType>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>("welcome");
  const [me, setMe] = useState<User | null>(null);
  const [apptParams, setApptParams] = useState<NavParams | undefined>(undefined);

  // -------- helpers de rol --------
  const goHomeByRole = (role: UserType) => {
    if (role === "doctor") return setCurrentScreen("doctor-dashboard");
    if (role === "admin") return setCurrentScreen("admin-panel");
    if (role === "patient") return setCurrentScreen("patient-dashboard");
    setCurrentScreen("welcome");
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
    goHomeByRole(userType);
  };

  // -------- logout --------
  const handleLogout = () => {
    setCurrentUser(null);
    setMe(null);
    setApptParams(undefined);
    setCurrentScreen("welcome");
  };

  // -------- navegación centralizada --------
  const navigate = (screen: string, params?: NavParams) => {
    let target = screen as Screen;

    // Unificamos el alias “home”
    if (target === "home") {
      goHomeByRole(currentUser);
      return;
    }

    // Mantenemos la compatibilidad con tu botón “Buscar médicos”
    if (target === "search-doctors") {
      target = "appointments";
    }

    // Guardas suaves según rol para evitar pantallas incorrectas
    if (currentUser === "doctor" && target === "patient-dashboard") {
      target = "doctor-dashboard";
    }
    if (currentUser === "patient" && target === "doctor-dashboard") {
      target = "patient-dashboard";
    }
    if (currentUser !== "admin" && target === "admin-panel") {
      // si no eres admin, te envío a tu home
      goHomeByRole(currentUser);
      return;
    }

    setApptParams(params);
    setCurrentScreen(target);
  };

  // Adaptador para componentes que esperan (screen: string) => void
  const navigateSimple = (screen: string) => {
    navigate(screen as Screen);
  };

  // Datos derivados del perfil
  const patientId =
    me?.id ? (typeof me.id === "string" ? Number(me.id) : (me.id as number)) : 0;

  const patientName =
    me?.fullName ||
    [me?.firstName1, me?.lastName1, me?.lastName2].filter(Boolean).join(" ") ||
    "Paciente";

  // (Opcional) Autocargar perfil si ya hay token en localStorage
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    (async () => {
      try {
        const profile = await getMe();
        setMe(profile);
        const role = String(profile.role ?? "").toUpperCase();
        const ui: UserType =
          role === "DOCTOR" ? "doctor" : role === "ADMIN" ? "admin" : "patient";
        setCurrentUser(ui);
        goHomeByRole(ui);
      } catch {
        // token inválido → quedarse en welcome
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Render según pantalla
  const renderScreen = () => {
    switch (currentScreen) {
      case "welcome":
        return <WelcomeLogin onLogin={handleLogin} />;

      case "patient-dashboard":
        return (
          <PatientDashboard
            onNavigate={navigateSimple}
            patientId={patientId}
            patientName={patientName}
          />
        );

      case "doctor-dashboard":
        return <DoctorDashboard onNavigate={navigateSimple} />;

      case "admin-panel":
        return <AdminPanel onNavigate={navigateSimple} />;

      case "appointments":
      case "search-doctors":
        return (
          <AppointmentScheduling
            onNavigate={navigate} // este puede enviar params
            preselectedDoctorId={apptParams?.doctorId}
          />
        );

      case "video-call":
        return <VideoCall onNavigate={navigateSimple} />;

      case "history":
      case "prescriptions":
        return <MedicalHistory onNavigate={navigateSimple} />;

      case "settings":
        return <SettingsPage onNavigate={navigate} onLogout={handleLogout} />;

      case "payments":
        return <PaymentsBilling onNavigate={navigateSimple} />;

      // Alias “home” por si llegara aquí
      case "home":
        goHomeByRole(currentUser);
        return null;

      default:
        return <WelcomeLogin onLogin={handleLogin} />;
    }
  };

  return <div className="min-h-screen bg-background">{renderScreen()}</div>;
}
