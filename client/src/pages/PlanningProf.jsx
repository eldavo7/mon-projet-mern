// client/src/pages/PlanningProf.jsx
import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Calendar, Info, Clock, AlertTriangle, BookOpen, MapPin } from 'lucide-react';
import API from '../api';
import GridPlanning from '../components/GridPlanning';

const PlanningProf = () => {
    const { prof } = useOutletContext();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!prof?.id_unique) {
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

                const extractedEvents = [];
                const targetId = `(${prof.id_unique})`;

                Object.entries(allClasses).forEach(([nomClasse, jours]) => {
                    Object.entries(jours).forEach(([jour, creneaux]) => {
                        Object.entries(creneaux).forEach(([plageHoraire, contenu]) => {
                            if (contenu && contenu.includes(targetId)) {
                                extractedEvents.push({
                                    jour: jour,
                                    debut: plageHoraire.split('-')[0],
                                    duree: plageHoraire,
                                    matiere: prof.matiere || "Cours",
                                    classe: nomClasse,
                                    salle: "SNC"
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
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 w-full space-y-8 pb-12">
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

            {events.length > 0 ? (
                <>
                    {/* Grille PC restaurée avec un conteneur responsive et une taille de vue optimisée */}
                    <div className="hidden lg:block bg-white p-6 sm:p-8 rounded-[3.5rem] shadow-sm border border-slate-100 overflow-x-auto w-full">
                        <div className="min-w-[900px] max-w-6xl mx-auto">
                            <GridPlanning events={events} />
                        </div>
                    </div>

                    {/* Vue Cartes verticale optimisée pour tablettes et téléphones */}
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
                                        <div className="flex items-center gap-2">
                                            <span className="px-3 py-1 bg-violet-50 text-violet-700 font-black text-[10px] uppercase rounded-full tracking-wider">
                                                {ev.jour}
                                            </span>
                                            <span className="px-3 py-1 bg-slate-100 text-slate-700 font-black text-[10px] uppercase rounded-full tracking-wider">
                                                Classe : {ev.classe}
                                            </span>
                                        </div>
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
                                                <MapPin size={12} /> {ev.salle || "SNC"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
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