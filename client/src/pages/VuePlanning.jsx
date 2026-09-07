// mon-projet-mern/client/src/pages/VuePlanning.jsx


import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, BookOpen, AlertCircle } from 'lucide-react';

const VuePlanning = () => {
    const [planning, setPlanning] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        fetch('http://localhost:5001/api/planningProf')
            .then((res) => {
                if (!res.ok) throw new Error("Impossible de récupérer l'emploi du temps");
                return res.json();
            })
            .then((data) => {
                setPlanning(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Erreur chargement planning:", err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center p-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 border border-red-100">
                <AlertCircle size={20} />
                <span>{error}</span>
            </div>
        );
    }

    // Récupération du tableau de cours (adapte le nom de la propriété selon ton document MongoDB)
    const coursList = planning?.cours || planning?.emploiDuTemps || [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                    <Calendar className="text-indigo-600" size={24} />
                    <span>Mon Emploi du Temps</span>
                </h2>
            </div>

            {coursList.length === 0 ? (
                <p className="text-slate-400 italic">Aucun cours disponible dans le planning.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {coursList.map((c, index) => (
                        <div key={c._id || index} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                            <div className="flex justify-between items-start">
                                <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-lg">
                                    {c.jour || 'Lundi'}
                                </span>
                                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                                    <Clock size={14} />
                                    {c.horaire || c.heure || 'N/A'}
                                </span>
                            </div>

                            <div>
                                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                                    <BookOpen size={18} className="text-indigo-500" />
                                    {c.matiere || c.titre}
                                </h3>
                                <p className="text-sm font-medium text-slate-500">{c.classe}</p>
                            </div>

                            {c.salle && (
                                <div className="text-xs font-semibold text-slate-400 flex items-center gap-1 pt-2 border-t border-slate-50">
                                    <MapPin size={14} />
                                    <span>Salle : {c.salle}</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VuePlanning;