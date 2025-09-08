import { useState } from 'react';
import { WelcomeLogin } from './components/WelcomeLogin';
import { PatientDashboard } from './components/PatientDashboard';
import { DoctorDashboard } from './components/DoctorDashboard';
import { AppointmentScheduling } from './components/AppointmentScheduling';
import { VideoCall } from './components/VideoCall';
import { MedicalHistory } from './components/MedicalHistory';
import { Settings } from './components/Settings';
import { PaymentsBilling } from './components/PaymentsBilling';
import { AdminPanel } from './components/AdminPanel';

type UserType = 'patient' | 'doctor' | 'admin' | null;
type Screen = 
  | 'welcome' 
  | 'patient-dashboard' 
  | 'doctor-dashboard' 
  | 'admin-panel'
  | 'appointments' 
  | 'search-doctors'
  | 'video-call' 
  | 'history' 
  | 'settings' 
  | 'payments'
  | 'prescriptions';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserType>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');

  const handleLogin = (userType: UserType) => {
    setCurrentUser(userType);
    if (userType === 'patient') {
      setCurrentScreen('patient-dashboard');
    } else if (userType === 'doctor') {
      setCurrentScreen('doctor-dashboard');
    } else if (userType === 'admin') {
      setCurrentScreen('admin-panel');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentScreen('welcome');
  };

  const handleNavigate = (screen: Screen) => {
    // Handle special cases
    if (screen === 'search-doctors') {
      setCurrentScreen('appointments');
    } else {
      setCurrentScreen(screen);
    }
  };

  // Render based on current screen
  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeLogin onLogin={handleLogin} />;
      
      case 'patient-dashboard':
        return <PatientDashboard onNavigate={handleNavigate} />;
      
      case 'doctor-dashboard':
        return <DoctorDashboard onNavigate={handleNavigate} />;
      
      case 'admin-panel':
        return <AdminPanel onNavigate={handleNavigate} />;
      
      case 'appointments':
      case 'search-doctors':
        return <AppointmentScheduling onNavigate={handleNavigate} />;
      
      case 'video-call':
        return <VideoCall onNavigate={handleNavigate} />;
      
      case 'history':
      case 'prescriptions':
        return <MedicalHistory onNavigate={handleNavigate} />;
      
      case 'settings':
        return <Settings onNavigate={handleNavigate} onLogout={handleLogout} />;
      
      case 'payments':
        return <PaymentsBilling onNavigate={handleNavigate} />;
      
      default:
        return <WelcomeLogin onLogin={handleLogin} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderScreen()}
    </div>
  );
}