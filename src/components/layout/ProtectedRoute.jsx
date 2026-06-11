import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { PageLoader } from "@/components/ui/index.jsx";

export function ProtectedRoute({ adminOnly = false }) {
  const { user, profile, loading } = useAuth();

  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && profile?.role !== "admin")
    return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}
