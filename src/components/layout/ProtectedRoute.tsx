import React, { useEffect, useState } from 'react'; 
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

// ProtectedRoute.tsx 
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  adminOnly = false 
}) => {
  const { user, loading, isAdmin, checkAdminStatus } = useAuth();
  const [checkingAdmin, setCheckingAdmin] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Aguarda a inicialização completa
    const timer = setTimeout(() => {
      setInitialized(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (user && adminOnly && initialized) {
      checkAdmin();
    }
  }, [user, adminOnly, initialized]);

  const checkAdmin = async () => {
    setCheckingAdmin(true);
    await checkAdminStatus();
    setCheckingAdmin(false);
  };

  // Evita renderização prematura
  if (!initialized || loading) {
    return <LoadingSpinner message="Inicializando..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && checkingAdmin) {
    return <LoadingSpinner message="Verificando permissões..." />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;