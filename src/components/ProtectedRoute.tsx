import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
  isAllowed: boolean;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  isAllowed,
  redirectTo = "/",
}: ProtectedRouteProps) {
  if (!isAllowed) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
