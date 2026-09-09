// client/src/pages/PlanningEtudiant.jsx
import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Calendar, Info, Clock, AlertTriangle, BookOpen, MapPin } from 'lucide-react';
import API from '../api';
import GridPlanning from '../components/GridPlanning';

const PlanningEtudiant = () => {
    const { user: etudiant } = useOutletContext();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!etudiant?.classe) {
            setLoading(false);
            return;
        }

        const fetchPlanning = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await API.get('/planningProf');
                const data = response.data;

                const allClasses = data.par_classe;
                if (!allClasses) {
                    throw new Error("Structure de données invalide : 'par_classe' manquante.");
                }

                const normalizeStr = (str) => 
                    str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase() : "";

                const keys = Object.keys(allClasses);
                const targetClasseNormalized = normalizeStr(etudiant.classe);

                let targetClasse = keys.find(c => normalizeStr(c) === targetClasseNormalized);

                if (!targetClasse) {
                    const matchNums = etudiant.classe.match(/\d+/g);
                    const numero = matchNums ? matchNums[matchNums.length - 1] : "";
                    
                    if (targetClasseNormalized.includes("2nde") && numero) {
                        targetClasse = keys.find(c => {
                            const nc = normalizeStr(c);
                            return nc.includes("2nde") && nc.endsWith(` ${numero}`);
                        });
                    } else if (targetClasseNormalized.includes("1ere") && numero) {
                        targetClasse = keys.find(c => {
                            const nc = normalizeStr(c);
                            return nc.includes("1ere") && nc.endsWith(` ${numero}`);
                        });
                    } else if (targetClasseNormalized.includes("term") && numero) {
                        targetClasse = keys.find(c => {
                            const nc = normalizeStr(c);
                            return nc.includes("term") && nc.endsWith(` ${numero}`);
                        });
                    }
                }

                if (!targetClasse || !allClasses[targetClasse]) {
                    throw new Error(`Aucun emploi du temps trouvé pour la classe : ${etudiant.classe}`);
                }

                const joursClasse = allClasses[targetClasse];
                const extractedEvents = [];

                Object.entries(joursClasse).forEach(([jour, creneaux]) => {
                    Object.entries(creneaux).forEach(([plageHoraire, contenu]) => {
                        if (contenu && contenu.trim() !== "" && contenu.toLowerCase() !== "vide") {
                            extractedEvents.push({
                                jour: jour,
                                debut: plageHoraire.split('-')[0],
                                duree: plageHoraire,
                                matiere: contenu,
                                classe: targetClasse,
                                salle: "SNC"
                            });
                        }
                    });
                });

                setEvents(extractedEvents);
            } catch (err) {
                console.error("Détails de l'erreur planning étudiant:", err);
                setError(err.response?.data?.message || err.message || "Erreur de chargement du planning");
            } finally {
                setLoading(false);
            }
        };

        fetchPlanning();
    }, [etudiant]);

    if (loading) {
        return (
            <div className="h-[400px] sm:h-[500px] flex flex-col items-center justify-center bg-white rounded-[2.5rem] sm:rounded-[3.5rem] border border-dashed border-slate-200 gap-4 m-2 sm:m-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-slate-100 border-t-violet-600 rounded-full animate-spin"></div>
                <p className="font-black italic text-slate-400 uppercase text-[10px] sm:text-xs tracking-widest animate-pulse">
                    Chargement de l'emploi du temps...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border-2 border-dashed border-red-200 rounded-[2.5rem] sm:rounded-[3.5rem] p-6 sm:p-12 text-center mx-2 sm:mx-0">
                <AlertTriangle size={40} className="text-red-500 mx-auto mb-4 sm:w-12 sm:h-12" />
                <h3 className="text-lg sm:text-xl font-black text-red-800 italic mb-2">Erreur de chargement</h3>
                <p className="text-xs sm:text-sm text-red-600 font-medium mb-6 max-w-md mx-auto">{error}</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-red-600 text-white rounded-2xl font-black italic hover:bg-red-700 transition-all text-xs sm:text-sm shadow-lg shadow-red-200"
                >
                    Réessayer
                </button>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 w-full space-y-6 sm:space-y-8 pb-12 px-2 sm:px-0">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 sm:p-10 rounded-[2.5rem] sm:rounded-[3.5rem] border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4 sm:gap-6">
                    <div className="p-4 sm:p-5 bg-violet-600 rounded-[1.8rem] text-white shadow-xl shadow-violet-200 shrink-0">
                        <Calendar size={28} className="sm:w-8 sm:h-8" />
                    </div>
                    <div>
                        <h2 className="text-2xl sm:text-4xl font-black italic tracking-tighter text-slate-800 leading-none">
                            Mon Emploi <span className="text-slate-300 font-medium ml-1">/ Temps</span>
                        </h2>
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                            <span className="px-3 py-1 bg-slate-100 rounded-full text-[9px] sm:text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                Élève : {etudiant?.prenom} {etudiant?.nom}
                            </span>
                            <span className="px-3 py-1 bg-violet-50 rounded-full text-[9px] sm:text-[10px] font-black text-violet-600 uppercase tracking-widest">
                                Classe : {etudiant?.classe || "Non renseignée"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-3xl border border-slate-100">
                    <div className="p-2.5 bg-amber-100 text-amber-600 rounded-2xl shrink-0">
                        <Clock size={18} />
                    </div>
                    <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase leading-tight">
                        Statut : <br/><span className="text-slate-800 font-black">Classe Synchronisée</span>
                    </p>
                </div>
            </div>

            {events.length > 0 ? (
                <>
                    {/* Grille visible uniquement sur grand écran (largeur minimale 'lg' au lieu de 'md') */}
                    <div className="hidden lg:block bg-white p-4 rounded-[3.5rem] shadow-sm border border-slate-100 overflow-hidden">
                        <GridPlanning events={events} />
                    </div>

                    {/* Vue Cartes verticale optimisée pour tablettes et téléphones (affichée par défaut dès qu'on passe sous 'lg') */}
                    <div className="block lg:hidden space-y-4">
                        <div className="px-2">
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 italic">
                                Planning détaillé de la semaine
                            </h3>
                        </div>
                        <div className="space-y-3">
                            {events.map((ev, index) => (
                                <div 
                                    key={index} 
                                    className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col gap-3 relative overflow-hidden group hover:border-violet-200 transition-all"
                                >
                                    <div className="absolute top-0 left-0 w-2 h-full bg-violet-600"></div>
                                    <div className="flex justify-between items-center">
                                        <span className="px-3 py-1 bg-violet-50 text-violet-700 font-black text-[10px] uppercase rounded-full tracking-wider">
                                            {ev.jour}
                                        </span>
                                        <div className="flex items-center gap-1.5 text-slate-400 font-bold text-xs">
                                            <Clock size={14} className="text-violet-500" />
                                            <span>{ev.duree}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 pt-1">
                                        <div className="p-2.5 bg-slate-50 rounded-2xl text-slate-700 mt-0.5">
                                            <BookOpen size={18} className="text-violet-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-800 text-base italic leading-snug">
                                                {ev.matiere}
                                            </h4>
                                            <p className="text-[11px] font-semibold text-slate-400 mt-1 flex items-center gap-1">
                                                <MapPin size={12} /> Salle standard / Distanciel
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                <div className="h-80 sm:h-96 flex flex-col items-center justify-center bg-white rounded-[2.5rem] sm:rounded-[3.5rem] border-2 border-dashed border-slate-200 text-center p-8 sm:p-12 shadow-sm">
                    <Info size={40} className="text-slate-300 mb-4" />
                    <h3 className="text-lg sm:text-xl font-black italic text-slate-800 mb-2">Aucun cours trouvé</h3>
                    <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-xs">
                        Aucun créneau n'est actuellement disponible pour la classe <span className="text-violet-600 font-bold">{etudiant?.classe}</span>.
                    </p>
                </div>
            )}
        </div>
    );
};

export default PlanningEtudiant;