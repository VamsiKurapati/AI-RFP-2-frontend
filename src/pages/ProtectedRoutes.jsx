import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";

const ProtectedRoutes = ({ children, allowedRoles }) => {
    const { role } = useUser();
    const location = useLocation();

    // Check if user is authenticated (has role and token)
    const token = localStorage.getItem('token');
    const isAuthenticated = role !== null && role !== undefined && role !== '' && token;

    if (!isAuthenticated) {
        // Save the intended location before redirecting to login
        const currentPath = location.pathname + location.search;
        if (currentPath !== '/login' && currentPath !== '/sign_up') {
            sessionStorage.setItem('redirectAfterLogin', currentPath);
        }
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoutes;