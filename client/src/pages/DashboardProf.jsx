// mon-projet-mern/client/src/pages/DashboardProf.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { CheckCircle, AlertCircle, Clock, Play, ShieldAlert, Calendar, CheckSquare, Square } from 'lucide-react';

import API from '../api';
import { formatFullName } from '../utils/formatters';
import Navbar from '../components/Navbar';

export const VueAccueilProf = () => {
  const prof = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const [coursDuJour, setCoursDuJour] = useState([]);
  const [loadingCours, setLoadingCours] = useState(true);

  const dateParis = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(new Date());

  const idUniqueRef = useRef(prof?.id_unique);

  useEffect(() => {
    const currentIdUnique = idUniqueRef.current;
    if (!currentIdUnique) {
      setLoadingCours(false);
      return;
    }

    let isMounted = true;

    const fetchCoursDuJourEtAssiduite = async () => {
      try {
        setLoadingCours(true);

        // 1. Récupération du planning et de l'historique d'assiduité en parallèle
        const [resPlanning, resAssiduite] = await Promise.allSettled([
          API.get('/planning'),
          API.get('/assiduite')
        ]);

        const allClasses = resPlanning.status === 'fulfilled' ? (resPlanning.value.data?.par_classe || {}) : {};
        const dataAssiduite = resAssiduite.status === 'fulfilled' ? (resAssiduite.value.data || []) : [];

        const joursFr = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
        const now = new Date();
        const jourActuelIndex = now.getDay();
        const currentDayName = joursFr[jourActuelIndex];
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        const aujourdhuiStr = now.toISOString().split('T')[0];

        const targetIdUpper = currentIdUnique.toUpperCase();
        let listeCoursTrouves = [];

        const normalizeStr = (str) => 
          str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase() : "";

        const trouverJourDansPlanning = (joursObj, nomJourFr) => {
          if (!joursObj) return {};
          const foundKey = Object.keys(joursObj).find(k => 
            normalizeStr(k) === nomJourFr
          );
          return foundKey ? joursObj[foundKey] : {};
        };

        // 2. On parcourt les cours de la journée actuelle
        Object.entries(allClasses).forEach(([nomClasse, jours]) => {
          const planningJour = trouverJourDansPlanning(jours, currentDayName);

          Object.entries(planningJour).forEach(([plageHoraire, contenu]) => {
            if (contenu && typeof contenu === 'string' && contenu.toUpperCase().includes(targetIdUpper)) {
              const [heureDebut, heureFin] = plageHoraire.split('-');
              if (heureDebut) {
                const [hD, mD] = heureDebut.trim().split(':').map(Number);
                const debutMinutes = (hD || 0) * 60 + (mD || 0);

                let finMinutes = debutMinutes + 60;
                if (heureFin) {
                  const [hF, mF] = heureFin.trim().split(':').map(Number);
                  finMinutes = (hF || 0) * 60 + (mF || 0);
                }

                // Vérification si un appel a déjà été enregistré pour ce cours aujourd'hui
                const appelDejaFait = dataAssiduite.some(item => {
                  const itemDate = item.date ? item.date.split('T')[0] : '';
                  const matchDate = itemDate === aujourdhuiStr;
                  const matchClasse = normalizeStr(item.classe) === normalizeStr(nomClasse);
                  const matchHeure = normalizeStr(item.heure) === normalizeStr(plageHoraire);
                  const matchProf = item.profId ? item.profId.toUpperCase() === targetIdUpper : true;
                  return matchDate && matchClasse && matchHeure && matchProf;
                });

                // Détermination du statut
                let statut = 'a_faire';
                if (appelDejaFait) {
                  statut = 'fait';
                } else if (currentMinutes > finMinutes + 30) {
                  statut = 'retard_appel'; // Cours passé mais appel non fait
                } else if (currentMinutes >= debutMinutes - 15 && currentMinutes <= finMinutes + 30) {
                  statut = 'en_cours';
                }

                listeCoursTrouves.push({
                  classe: nomClasse,
                  matiere: prof?.matiere || 'Cours',
                  horaire: plageHoraire,
                  debutMinutes,
                  statut
                });
              }
            }
          });
        });

        // Tri chronologique
        listeCoursTrouves.sort((a, b) => a.debutMinutes - b.debutMinutes);

        if (isMounted) {
          setCoursDuJour(listeCoursTrouves);
        }
      } catch (err) {
        console.error("Erreur chargement planning/assiduité:", err);
      } finally {
        if (isMounted) {
          setLoadingCours(false);
        }
      }
    };

    fetchCoursDuJourEtAssiduite();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLancerAppel = (cours) => {
    const params = new URLSearchParams({
      classe: cours.classe,
      matiere: cours.matiere,
      heure: cours.horaire
    });
    navigate(`/lancer-appel?${params.toString()}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-10 animate-in fade-in duration-500 w-full pb-12">
      <div className="lg:col-span-2 bg-white rounded-[2.5rem] sm:rounded-[3.5rem] p-6 sm:p-12 shadow-sm border border-slate-100 flex flex-col justify-between space-y-8">
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-black flex items-center gap-3 sm:gap-4 italic text-slate-800 tracking-tighter">
              <div className="p-3 bg-violet-100 rounded-2xl shrink-0">
                <Calendar className="text-violet-600" size={24} />
              </div>
              Cours d'aujourd'hui
            </h2>
            <span className="bg-slate-50 px-4 sm:px-6 py-2 sm:py-3 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100 capitalize">
              {dateParis}
            </span>
          </div>

          {loadingCours ? (
            <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
              <div className="w-8 h-8 border-4 border-slate-200 border-t-violet-600 rounded-full animate-spin mb-3"></div>
              <p className="font-bold text-slate-400 text-xs uppercase tracking-widest">Chargement des cours...</p>
            </div>
          ) : coursDuJour.length > 0 ? (
            <div className="space-y-4">
              {coursDuJour.map((cours, index) => {
                const estFait = cours.statut === 'fait';
                const estEnCours = cours.statut === 'en_cours';
                const estEnRetard = cours.statut === 'retard_appel';

                return (
                  <div 
                    key={index} 
                    className={`p-5 sm:p-6 rounded-[2rem] border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      estEnRetard
                        ? 'bg-amber-50/60 border-amber-200 shadow-sm'
                        : estEnCours 
                        ? 'bg-violet-50/60 border-violet-200 shadow-md shadow-violet-50' 
                        : estFait 
                        ? 'bg-slate-50/70 border-slate-100 opacity-80' 
                        : 'bg-white border-slate-100 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="pt-1">
                        {estFait ? (
                          <CheckSquare className="text-emerald-600" size={20} />
                        ) : (
                          <Square className="text-slate-300" size={20} />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-lg text-[10px] font-black uppercase tracking-wider">
                            {cours.classe}
                          </span>
                          {estEnCours && (
                            <span className="px-2.5 py-0.5 bg-violet-600 text-white rounded-lg text-[10px] font-black uppercase tracking-wider animate-pulse">
                              En cours
                            </span>
                          )}
                          {estEnRetard && (
                            <span className="px-2.5 py-0.5 bg-amber-500 text-white rounded-lg text-[10px] font-black uppercase tracking-wider">
                              Appel en retard
                            </span>
                          )}
                          {estFait && (
                            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-black uppercase tracking-wider">
                              Appel fait
                            </span>
                          )}
                        </div>
                        <h4 className="text-base sm:text-lg font-black italic text-slate-800 mt-1">
                          {cours.matiere}
                        </h4>
                        <div className="flex items-center gap-1.5 text-slate-400 mt-1">
                          <Clock size={14} />
                          <span className="text-xs font-bold">{cours.horaire}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleLancerAppel(cours)}
                      className={`w-full sm:w-auto px-5 py-3 rounded-2xl font-black italic tracking-wider uppercase text-[11px] flex items-center justify-center gap-2 transition-all active:scale-95 shrink-0 ${
                        estEnRetard
                          ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-200 animate-bounce'
                          : estFait 
                          ? 'bg-slate-200 hover:bg-slate-300 text-slate-700' 
                          : 'bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-200'
                      }`}
                    >
                      <Play size={14} className="fill-current" />
                      {estFait ? 'Modifier l\'appel' : estEnRetard ? 'Faire l\'appel en retard' : 'Lancer l\'appel'}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 sm:p-12 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
              <ShieldAlert className="text-slate-300 mb-3" size={36} />
              <p className="font-black italic text-slate-500 text-base sm:text-lg mb-2 uppercase tracking-tight">
                Aucun cours aujourd'hui
              </p>
              <p className="text-xs text-slate-400 font-semibold max-w-sm">
                Aucun créneau n'a été planifié pour vous ce jour. Profitez de votre journée !
              </p>
            </div>
          )}
        </div>
      </div>

      <section className="bg-violet-600 rounded-[2.5rem] sm:rounded-[3.5rem] p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-black mb-8 sm:mb-10 flex items-center gap-3 italic tracking-tighter">
            <AlertCircle size={28} /> Infos Poste
          </h2>
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-white/10">
              <p className="text-[10px] font-black opacity-60 uppercase tracking-[0.2em] mb-2">
                Matière Enseignée
              </p>
              <p className="text-xl sm:text-2xl font-black italic uppercase">
                {prof?.matiere || 'Non définie'}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-white/10">
              <p className="text-[10px] font-black opacity-60 uppercase tracking-[0.2em] mb-2">
                Identifiant Unique
              </p>
              <p className="text-lg sm:text-xl font-black tracking-wider">{prof?.id_unique}</p>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
      </section>
    </div>
  );
};

const DashboardProf = () => {
  const navigate = useNavigate();
  const [prof, setProf] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const dateParisComplet = new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Europe/Paris',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      const role = parsedUser.role ? parsedUser.role.toLowerCase() : '';
      if (role !== 'prof' && role !== 'professeur' && role !== 'admin') {
        navigate('/');
      } else {
        setProf(parsedUser);
        const userId = parsedUser._id || parsedUser.id;
        API.get(`/notifications/${userId}`)
          .then(res => setNotifications(res.data))
          .catch(err => console.error("Erreur chargement notifications:", err));
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleMarkAsRead = async () => {
    const userId = prof?._id || prof?.id;
    if (!userId) return;

    try {
      await API.patch(`/notifications/read-all/${userId}`);
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error("Erreur marquage notifications:", err);
    }
  };

  if (!prof) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col overflow-x-hidden relative">
      <Navbar 
        user={prof} 
        notifications={notifications} 
        onMarkAsRead={handleMarkAsRead} 
      />
      <main className="flex-1 p-4 sm:p-8 md:p-12 lg:p-16 max-w-7xl mx-auto w-full">
        <header className="mb-8 sm:mb-10">
          <p className="text-violet-600 font-black text-xs tracking-[0.2em] uppercase mb-3">
            Espace Enseignant
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 italic tracking-tighter leading-[0.9] break-words">
            Bonjour,{' '}
            <span className="text-violet-600 underline decoration-slate-200 underline-offset-[8px] sm:underline-offset-[12px]">
              {formatFullName(prof.prenom, prof.nom)}
            </span>
          </h1>
          <div className="text-slate-400 font-bold mt-6 sm:mt-8 uppercase text-[10px] flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shrink-0"></div>
            <span className="capitalize">{dateParisComplet}</span>
          </div>
        </header>
        <div className="mt-8 w-full">
          <Outlet context={{ prof }} />
        </div>
      </main>
    </div>
  );
};

export default DashboardProf;