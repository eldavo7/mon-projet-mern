// client/src/App.jsx

import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';

import Login from './pages/Login';
import DashboardProf, { VueAccueilProf } from './pages/DashboardProf';
import DashboardEtudiant, { VueAccueilEtudiant } from './pages/DashboardEtudiant';
import GestionEleves from './pages/GestionEleves';
import ProfilEtudiant from './pages/ProfilEtudiant';
import Messagerie from './pages/Messagerie';
import Conditions from './components/Conditions';
import PlanningProf from './pages/PlanningProf';

// --- FONCTION DE SÉCURITÉ : VÉRIFICATION DE L'EXPIRATION TIMEOUT (1H) ---
const checkSessionExpiration = () => {
  const token = localStorage.getItem('token');
  const loginTimestamp = localStorage.getItem('loginTimestamp');
  
  if (token && loginTimestamp) {
    const heureActuelle = new Date().getTime();
    const UNE_HEURE = 3600000; // 1h en millisecondes

    if (heureActuelle - parseInt(loginTimestamp, 10) > UNE_HEURE) {
      localStorage.clear(); // Vide le token, le rôle et le timestamp
      return true; // La session a expiré
    }
  }
  return false; // La session est toujours valide
};

// Composant de protection des routes
function PrivateRoute({ children, requiredRoles }) {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  // Vérification de la validité temporelle avant d'autoriser l'accès
  if (checkSessionExpiration()) {
    alert("Votre session a expiré après 1 heure. Veuillez vous reconnecter.");
    return <Navigate to="/" replace />;
  }

  if (!token) return <Navigate to="/" replace />;

  if (requiredRoles && !requiredRoles.includes(userRole)) {
    const target = (userRole === 'prof' || userRole === 'admin' || userRole === 'professeur') 
      ? '/DashboardProf' 
      : '/DashboardEtudiant';
    return <Navigate to={target} replace />;
  }

  return children;
}

export default function App() {
  const [role, setRole] = useState(localStorage.getItem('role') || null);
  const location = useLocation();
  const navigate = useNavigate();

  // Effet global exécuté à chaque changement de route
  useEffect(() => {
    if (checkSessionExpiration()) {
      setRole(null);
      alert("Votre session a expiré après 1 heure. Veuillez vous reconnecter.");
      navigate('/', { replace: true });
    }
  }, [location.pathname, navigate]);

  const handleLoginSuccess = (userRole) => {
    setRole(userRole);
  };

  return (
    <Routes>
      {/* Route Racine / Login */}
      <Route 
        path="/" 
        element={
          localStorage.getItem('token') && !checkSessionExpiration() ? (
            // Si déjà connecté et session valide, on redirige vers le bon dashboard par défaut
            <Navigate 
              to={(role === 'prof' || role === 'admin' || role === 'professeur') ? '/DashboardProf' : '/DashboardEtudiant'} 
              replace 
            />
          ) : (
            <Login onLogin={handleLoginSuccess} />
          )
        } 
      />
      
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
        <Route path="planning" element={<PlanningProf />} />
        <Route path="gestion-eleve" element={<GestionEleves />} />
        <Route path="messagerie" element={<Messagerie />} />
      </Route>

      {/* Espace Étudiant */}
      <Route 
        path="/DashboardEtudiant" 
        element={
          <PrivateRoute requiredRoles={['etudiant', 'eleve']}>
            <DashboardEtudiant />
          </PrivateRoute>
        } 
      >
        <Route index element={<VueAccueilEtudiant />} />
        <Route path="planning" element={<PlanningProf />} />
        <Route path="messagerie" element={<Messagerie />} />
      </Route>

      {/* Messagerie Générale */}
      <Route 
        path="/messagerie" 
        element={
          <PrivateRoute requiredRoles={['prof', 'admin', 'professeur', 'etudiant', 'eleve']}>
            <Messagerie />
          </PrivateRoute>
        } 
      />

      {/* Fiche Profil Étudiant */}
      <Route 
        path="/etudiant/:id" 
        element={
          <PrivateRoute requiredRoles={['prof', 'admin', 'professeur', 'etudiant', 'eleve']}>
            <ProfilEtudiant />
          </PrivateRoute>
        } 
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}