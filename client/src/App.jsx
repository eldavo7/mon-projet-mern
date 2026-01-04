// client/src/App.jsx

import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';

// Importations des pages
import Login from './pages/Login';
import DashboardEtudiant from './pages/DashboardEtudiant';
import DashboardProf from './pages/DashboardProf';
import Conditions from './components/Conditions';

// 1. Composant de protection des routes
function PrivateRoute({ children, userRole, requiredRole }) {
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // On vérifie aussi le token

  useEffect(() => {
    if (!token) {
      navigate('/', { replace: true });
    } else if (requiredRole && userRole !== requiredRole) {
      // Si le rôle ne correspond pas, on redirige vers le bon dashboard
      const target = userRole === 'admin' ? '/DashboardProf' : '/DashboardEtudiant';
      navigate(target, { replace: true });
    }
  }, [token, userRole, requiredRole, navigate]);

  return (token && (!requiredRole || userRole === requiredRole)) ? children : null;
}

export default function App() {
  // On initialise le rôle depuis le localStorage pour ne pas le perdre au rafraîchissement
  const [role, setRole] = useState(localStorage.getItem('role') || null);

  // Synchronisation du rôle avec le localStorage
  useEffect(() => {
    if (role) {
      localStorage.setItem('role', role);
    } else {
      localStorage.removeItem('role');
    }
  }, [role]);

  // Cette fonction sera appelée par le composant Login après une API réussie
  const handleLoginSuccess = (userRole) => {
    setRole(userRole);
  };

  return (
    <Routes>
      {/* Route publique */}
      <Route path="/" element={<Login onLogin={handleLoginSuccess} />} />
      <Route path="/conditions" element={<Conditions />} />

      {/* Routes protégées */}
      <Route 
        path="/DashboardEtudiant" 
        element={
          <PrivateRoute userRole={role} requiredRole="etudiant">
            <DashboardEtudiant />
          </PrivateRoute>
        } 
      />

      <Route 
        path="/DashboardProf" 
        element={
          <PrivateRoute userRole={role} requiredRole="admin"> {/* "admin" car c'est ton rôle backend pour les profs */}
            <DashboardProf />
          </PrivateRoute>
        } 
      />

      {/* Redirection automatique pour les pages inconnues */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}