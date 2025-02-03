import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        return <Navigate to="/login" />;
    }
    return <Outlet />;
};

export default ProtectedRoute;
