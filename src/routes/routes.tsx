// AppRoutes.tsx - VERSÃO CORRIGIDA PARA VERCEL
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProtectedRoute from '../components/layout/ProtectedRoute';

// Public Pages
import Home from '../pages/public/Home';
import Login from '../pages/public/Login';
import Register from '../pages/public/Register';
import About from '../pages/public/About';
import AnimalSearch from '../pages/public/AnimalSearch';
import NotFound from '../pages/public/NotFound';
import AnimalDetail from '../pages/public/AnimalDetail';

// User Pages
import Profile from '../pages/user/Profile';

// Admin Pages
import Dashboard from '../pages/admin/Dashboard';
import AddAnimal from '../pages/admin/AddAnimal';
import EditAnimal from '../pages/admin/EditAnimal'; // ✅ ADICIONE ESTA IMPORT

const AppRoutes: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Layout com todas as rotas dentro */}
        <Route path="/" element={<Layout />}>
          {/* Public Routes */}
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="cadastro" element={<Register />} />
          <Route path="sobre" element={<About />} />
          <Route path="animais" element={<AnimalSearch />} />
          <Route path="animais/:id" element={<AnimalDetail />} />

          {/* Protected User Routes */}
          <Route
            path="perfil"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="admin"
            element={
              <ProtectedRoute adminOnly>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/novo-animal"
            element={
              <ProtectedRoute adminOnly>
                <AddAnimal />
              </ProtectedRoute>
            }
          />
          {/* ✅ ADICIONE ESTA ROTA PARA EDIÇÃO */}
          <Route
            path="admin/animais/editar/:id"
            element={
              <ProtectedRoute adminOnly>
                <EditAnimal />
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default AppRoutes;