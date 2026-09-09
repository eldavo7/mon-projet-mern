// client/src/pages/PlanningProf.jsx
import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Calendar, Info, Clock, AlertTriangle } from 'lucide-react';
import API from '../api'; // <-- Utilisation de l'instance API configurée
import GridPlanning from '../components/GridPlanning';

const PlanningProf = () => {
    // Récupération du prof via le contexte du DashboardProf
    const { prof } = useOutletContext();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Sécurité : si pas de prof ou pas d'ID, on arrête
        if (!prof?.id_unique) {
            setLoading(false);
            return;
        }

        const fetchPlanning = async () => {
            try {
                setLoading(true);
                setError(null);

                // Appel via l'instance API (dynamique Mac/Mobile)
                const response = await API.get('/planningProf');
                const data = response.data;

                // Extraction des données de la section 'par_classe'
                const allClasses = data.par_classe;
                if (!allClasses) {
                    throw new Error("Structure de données invalide : 'par_classe' manquante.");
                }

                const extractedEvents = [];
                // On prépare l'ID à chercher, ex: "(PROF-104)"
                const targetId = `(${prof.id_unique})`;

                // --- ALGORITHME DE RECHERCHE ---
                // On parcourt chaque classe (ex: "2nde 10", "1ère S 3"...)
                Object.entries(allClasses).forEach(([nomClasse, jours]) => {
                    // On parcourt chaque jour (Lundi, Mardi...)
                    Object.entries(jours).forEach(([jour, creneaux]) => {
                        // On parcourt chaque heure (8h-9h...)
                        Object.entries(creneaux).forEach(([plageHoraire, contenu]) => {
                            
                            // Si la cellule contient l'ID du prof (ex: "RENAUD (SVT) (PROF-051)")
                            if (contenu && contenu.includes(targetId)) {
                                extractedEvents.push({
                                    jour: jour,
                                    debut: plageHoraire.split('-')[0], // Récupère "8h"
                                    duree: plageHoraire,
                                    matiere: prof.matiere || "Cours",
                                    classe: nomClasse,
                                    salle: "SNC" // Salle Non Communiquée ou à extraire si présente
                                });
                            }
                        });
                    });
                });

                setEvents(extractedEvents);
            } catch (err) {
                console.error("Détails de l'erreur planning:", err);
                setError(err.response?.data?.message || err.message || "Erreur de chargement du planning");
            } finally {
                setLoading(false);
            }
        };

        fetchPlanning();
    }, [prof]);

    // 1. État de chargement
    if (loading) {
        return (
            <div className="h-[500px] flex flex-col items-center justify-center bg-white rounded-[3.5rem] border border-dashed border-slate-200 gap-4">
                <div className="w-12 h-12 border-4 border-slate-100 border-t-violet-600 rounded-full animate-spin"></div>
                <p className="font-black italic text-slate-400 uppercase text-xs tracking-widest animate-pulse">
                    Synchronisation avec Honoré d'Urfé...
                </p>
            </div>
        );
    }

    // 2. État d'erreur (404 ou erreur serveur)
    if (error) {
        return (
            <div className="bg-red-50 border-2 border-dashed border-red-200 rounded-[3.5rem] p-12 text-center">
                <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-black text-red-800 italic mb-2">Erreur de connexion</h3>
                <p className="text-sm text-red-600 font-medium mb-6">{error}</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="px-8 py-3 bg-red-600 text-white rounded-2xl font-black italic hover:bg-red-700 transition-all"
                >
                    Réessayer
                </button>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 w-full space-y-8">
            {/* Header du planning */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-violet-600 rounded-[1.8rem] text-white shadow-xl shadow-violet-200">
                        <Calendar size={28} />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black italic tracking-tighter text-slate-800 leading-none">
                            Mon Emploi <span className="text-slate-300 font-medium ml-1">/ Temps</span>
                        </h2>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="px-3 py-1 bg-slate-100 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                Identifiant : {prof?.id_unique}
                            </span>
                            <span className="px-3 py-1 bg-violet-50 rounded-full text-[9px] font-black text-violet-600 uppercase tracking-widest">
                                {prof?.matiere}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="p-2 bg-amber-100 text-amber-600 rounded-xl">
                        <Clock size={18} />
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase leading-tight">
                        Statut : <br/><span className="text-slate-800">Données Temps Réel</span>
                    </p>
                </div>
            </div>

            {/* Affichage de la grille ou message "vide" */}
            {events.length > 0 ? (
                <div className="bg-white p-2 rounded-[3.5rem] shadow-sm border border-slate-100 overflow-hidden">
                    <GridPlanning events={events} />
                </div>
            ) : (
                <div className="h-96 flex flex-col items-center justify-center bg-slate-50 rounded-[3.5rem] border-2 border-dashed border-slate-200 text-center p-12">
                    <Info size={40} className="text-slate-300 mb-4" />
                    <h3 className="text-xl font-black italic text-slate-800 mb-2">Aucun cours trouvé</h3>
                    <p className="text-sm text-slate-400 font-medium max-w-xs">
                        L'identifiant <span className="text-violet-600 font-bold">{prof?.id_unique}</span> n'apparaît dans aucun créneau du planning actuel.
                    </p>
                </div>
            )}
        </div>
    );
};

export default PlanningProf;