// ProtectedRoute.tsx - VERSÃO COMPLETA
import React, { useEffect, useState } from 'react'; 
import { Navigate, useLocation } from 'react-router-dom'; // ← ADICIONE useLocation
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  adminOnly = false 
}) => {
  const { user, loading, isAdmin, checkAdminStatus } = useAuth();
  const location = useLocation(); // ← ADICIONE ESTA LINHA
  const [checkingAdmin, setCheckingAdmin] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
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
    try {
      await checkAdminStatus();
    } catch (error) {
      console.error('Erro ao verificar admin:', error);
    } finally {
      setCheckingAdmin(false);
    }
  };

  if (!initialized || loading) {
    return <LoadingSpinner message="Inicializando..." />;
  }

  if (!user) {
    // 🔥 CORREÇÃO CRÍTICA: Passa a URL atual para o login poder redirecionar de volta
    return (
      <Navigate 
        to="/login" 
        state={{ from: location.pathname }} 
        replace 
      />
    );
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