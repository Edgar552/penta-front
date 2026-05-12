import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Providers/AuthContext";

export default function ProtectedRoute() {
    const { user, loading } = useAuth();

    if (loading) {
        return null; // or spinner component
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
