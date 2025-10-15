import { createContext, useContext, ReactNode } from 'react';

type UserType = "patient" | "doctor" | "admin" | null;

interface AuthContextType {
  currentUser: UserType;
  getDashboardRoute: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  currentUser: UserType;
}

export function AuthProvider({ children, currentUser }: AuthProviderProps) {
  const getDashboardRoute = (): string => {
    if (currentUser === "doctor") return "/doctor-dashboard";
    if (currentUser === "admin") return "/admin-panel";
    if (currentUser === "patient") return "/patient-dashboard";
    return "/";
  };

  return (
    <AuthContext.Provider value={{ currentUser, getDashboardRoute }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
