// client/src/App.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import DashboardProf, { VueAccueilProf, VuePlanning } from './pages/DashboardProf';
import DashboardEtudiant from './pages/DashboardEtudiant';
import GestionEleves from './pages/GestionEleves';
import ProfilEtudiant from './pages/ProfilEtudiant';
import Conditions from './components/Conditions';

// --- LE GARDE DE SÉCURITÉ (PrivateRoute) ---
function PrivateRoute({ children, requiredRoles }) {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role'); // On lit le rôle en direct pour éviter les lags d'état

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (requiredRoles && !requiredRoles.includes(userRole)) {
    // Redirection si le rôle ne correspond pas
    const target = (userRole === 'prof' || userRole === 'admin') 
      ? '/DashboardProf' 
      : '/DashboardEtudiant';
    return <Navigate to={target} replace />;
  }

  return children;
}

export default function App() {
  const [role, setRole] = useState(localStorage.getItem('role') || null);

  // Cette fonction sera appelée par le composant Login après succès
  const handleLoginSuccess = (userRole) => {
    setRole(userRole);
  };

  return (
    <Routes>
      <Route path="/" element={<Login onLogin={handleLoginSuccess} />} />
      <Route path="/conditions" element={<Conditions />} />

      {/* --- STRUCTURE PROFESSEUR (Utilise Outlet) --- */}
      <Route 
        path="/DashboardProf" 
        element={
          <PrivateRoute requiredRoles={['prof', 'admin', 'professeur']}>
            <DashboardProf />
          </PrivateRoute>
        }
      >
        {/* Ces composants s'afficheront dans l'Outlet de DashboardProf */}
        <Route index element={<VueAccueilProf />} />
        <Route path="planning" element={<VuePlanning />} />
        <Route path="gestion-eleve" element={<GestionEleves />} />
      </Route>

      {/* --- STRUCTURE ÉTUDIANT --- */}
      <Route 
        path="/DashboardEtudiant" 
        element={
          <PrivateRoute requiredRoles={['etudiant']}>
            <DashboardEtudiant />
          </PrivateRoute>
        } 
      />

      <Route path="/etudiant/:id" element={<ProfilEtudiant />} />

      {/* Redirection automatique si route inconnue */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}