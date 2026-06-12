import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import DashboardProf, { VueAccueilProf, VuePlanning } from './pages/DashboardProf';
import DashboardEtudiant from './pages/DashboardEtudiant';
import GestionEleves from './pages/GestionEleves';
import ProfilEtudiant from './pages/ProfilEtudiant';
import Conditions from './components/Conditions';

// Composant de protection des routes
function PrivateRoute({ children, requiredRoles }) {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  if (!token) return <Navigate to="/" replace />;

  if (requiredRoles && !requiredRoles.includes(userRole)) {
    const target = (userRole === 'prof' || userRole === 'admin') 
      ? '/DashboardProf' 
      : '/DashboardEtudiant';
    return <Navigate to={target} replace />;
  }

  return children;
}

export default function App() {
  const [role, setRole] = useState(localStorage.getItem('role') || null);

  const handleLoginSuccess = (userRole) => setRole(userRole);

  return (
    <Routes>
      <Route path="/" element={<Login onLogin={handleLoginSuccess} />} />
      <Route path="/conditions" element={<Conditions />} />

      {/* Espace Professeur */}
      <Route 
        path="/DashboardProf" 
        element={
          <PrivateRoute requiredRoles={['prof', 'admin', 'professeur']}>
            <DashboardProf />
          </PrivateRoute>
        }
      >
        <Route index element={<VueAccueilProf />} />
        <Route path="planning" element={<VuePlanning />} />
        <Route path="gestion-eleve" element={<GestionEleves />} />
      </Route>

      {/* Espace Étudiant */}
      <Route 
        path="/DashboardEtudiant" 
        element={
          <PrivateRoute requiredRoles={['etudiant']}>
            <DashboardEtudiant />
          </PrivateRoute>
        } 
      />

      <Route path="/etudiant/:id" element={<ProfilEtudiant />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}