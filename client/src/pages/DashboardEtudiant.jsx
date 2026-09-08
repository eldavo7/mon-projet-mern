// client/src/pages/DashboardEtudiant.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { BookOpen, Award, Clock } from 'lucide-react';

import { formatFullName } from '../utils/formatters';
import Navbar from '../components/Navbar';

/* ==========================================================================
   1. SOUS-COMPOSANT : VUE ACCUEIL ÉTUDIANT (Tableau de bord principal)
   ========================================================================== */
export const VueAccueilEtudiant = () => {
  const etudiant = JSON.parse(localStorage.getItem('user'));
  const dateParis = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(new Date());

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in fade-in duration-500">
      
      {/* Colonne Gauche : Résumé Prochains Cours / Devoirs */}
      <div className="lg:col-span-2 bg-white rounded-[3.5rem] p-12 shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-black flex items-center gap-4 italic text-slate-800 tracking-tighter">
            <div className="p-3 bg-indigo-100 rounded-2xl">
              <BookOpen className="text-indigo-600" size={28} />
            </div>
            Mon programme du jour
          </h2>
          <span className="bg-slate-50 px-6 py-3 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">
            {dateParis}
          </span>
        </div>

        <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
          <Clock className="text-slate-300 mb-3" size={40} />
          <p className="font-black italic text-slate-500 text-lg mb-2 uppercase tracking-tight">
            Consultation de l'emploi du temps
          </p>
          <p className="text-xs text-slate-400 font-semibold max-w-sm">
            Retrouvez tous vos cours, horaires et devoirs directement dans l'onglet Planning.
          </p>
        </div>
      </div>

      {/* Colonne Droite : Carte Informations Étudiant */}
      <section className="bg-indigo-600 rounded-[3.5rem] p-12 text-white shadow-2xl relative overflow-hidden">
        <h2 className="text-2xl font-black mb-10 flex items-center gap-3 italic tracking-tighter">
          <Award size={28} /> Carte Étudiant
        </h2>

        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10">
            <p className="text-[10px] font-black opacity-60 uppercase tracking-[0.2em] mb-2">
              Classe / Promotion
            </p>
            <p className="text-2xl font-black italic uppercase">
              {etudiant?.classe || 'Élève'}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10">
            <p className="text-[10px] font-black opacity-60 uppercase tracking-[0.2em] mb-2">
              Identifiant ÉLÈVE
            </p>
            <p className="text-xl font-black">{etudiant?.id_unique || etudiant?._id}</p>
          </div>
        </div>

        {/* Décoration d'arrière-plan */}
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
      </section>

    </div>
  );
};

/* ==========================================================================
   2. COMPOSANT PRINCIPAL : LAYOUT DASHBOARD ÉTUDIANT
   ========================================================================== */
const DashboardEtudiant = () => {
  const navigate = useNavigate();
  const [etudiant, setEtudiant] = useState(null);

  const dateParisComplet = new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Europe/Paris',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  // Authentification et rôle
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      const role = parsedUser.role ? parsedUser.role.toLowerCase() : '';
      if (role !== 'etudiant' && role !== 'eleve') {
        navigate('/');
      } else {
        setEtudiant(parsedUser);
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  if (!etudiant) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col overflow-x-hidden relative">
      
      {/* NAVBAR AVEC ADAPTATION DE RÔLE */}
      <Navbar user={etudiant} />

      {/* CONTENU PRINCIPAL */}
      <main className="flex-1 p-6 md:p-12 lg:p-16 max-w-7xl mx-auto w-full">
        
        {/* En-tête de la page */}
        <header className="mb-10">
          <p className="text-indigo-600 font-black text-xs tracking-[0.2em] uppercase mb-3">
            Espace Élève
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 italic tracking-tighter leading-[0.9]">
            Bonjour, {' '} <span className="text-indigo-600 underline decoration-slate-200 underline-offset-[12px]">
              {formatFullName(etudiant.prenom, etudiant.nom)}
            </span>
          </h1>
          <div className="text-slate-400 font-bold mt-8 uppercase text-[10px] flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            {dateParisComplet}
          </div>
        </header>

        {/* Zone de rendu dynamique des vues (Accueil, Planning, Messagerie, etc.) */}
        <div className="mt-8">
          <Outlet context={{ etudiant }} />
        </div>

      </main>

    </div>
  );
};

export default DashboardEtudiant;