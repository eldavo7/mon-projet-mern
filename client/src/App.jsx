// client/src/App.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import DashboardEtudiant from './pages/DashboardEtudiant';
import DashboardProf from './pages/DashboardProf';
import Conditions from './components/Conditions';

function PrivateRoute({ children, userRole, requiredRoles }) {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/', { replace: true });
    } else if (requiredRoles && !requiredRoles.includes(userRole)) {
      // Redirection intelligente si le rôle n'est pas autorisé
      const target = (userRole === 'admin' || userRole === 'prof') 
        ? '/DashboardProf' 
        : '/DashboardEtudiant';
      navigate(target, { replace: true });
    }
  }, [token, userRole, requiredRoles, navigate]);

  return (token && (!requiredRoles || requiredRoles.includes(userRole))) ? children : null;
}

export default function App() {
  const [role, setRole] = useState(localStorage.getItem('role') || null);

  const handleLoginSuccess = (userRole) => {
    setRole(userRole);
  };

  return (
    <Routes>
      <Route path="/" element={<Login onLogin={handleLoginSuccess} />} />
      <Route path="/conditions" element={<Conditions />} />

      {/* Route Étudiant : Uniquement pour le rôle 'etudiant' */}
      <Route 
        path="/DashboardEtudiant" 
        element={
          <PrivateRoute userRole={role} requiredRoles={['etudiant']}>
            <DashboardEtudiant />
          </PrivateRoute>
        } 
      />

      {/* Route Prof : Autorisée pour 'prof' ET 'admin' */}
      <Route 
        path="/DashboardProf" 
        element={
          <PrivateRoute userRole={role} requiredRoles={['prof', 'professeur', 'admin', 'surveillant', 'direction']}>
            <DashboardProf />
          </PrivateRoute>
        } 
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}