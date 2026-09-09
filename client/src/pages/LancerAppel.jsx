// client/src/pages/LancerAppel.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Calendar, CheckCircle2, XCircle, Clock, AlertTriangle, ArrowLeft, Save, UserCheck, ShieldAlert } from 'lucide-react';
import API from '../api';

const LancerAppel = () => {
    const prof = JSON.parse(localStorage.getItem('user')) || {};
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const classeParam = searchParams.get('classe') || '';
    const matiereParam = searchParams.get('matiere') || prof?.matiere || 'Cours';
    const heureParam = searchParams.get('heure') || '';

    const [eleves, setEleves] = useState([]);
    const [statuts, setStatuts] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        const fetchElevesEtAssiduite = async () => {
            try {
                setLoading(true);
                setError(null);

                // Récupération de tous les élèves pour filtrer par classe
                const resEleves = await API.get('/eleves');
                const listeEleves = resEleves.data || [];

                const normalizeStr = (str) => 
                    str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase() : "";

                const targetClasseNorm = normalizeStr(classeParam);
                const elevesFiltres = listeEleves.filter(e => normalizeStr(e.classe) === targetClasseNorm);

                setEleves(elevesFiltres);

                // Initialisation des statuts par défaut ("present")
                const initialStatuts = {};
                elevesFiltres.forEach(e => {
                    initialStatuts[e._id || e.id] = 'present';
                });

                // Si une API d'assiduité existe déjà pour récupérer les absences existantes du jour
                try {
                    const resAssiduite = await API.get('/assiduite');
                    const dataAssiduite = resAssiduite.data || [];
                    
                    const aujourdhui = new Date().toISOString().split('T')[0];
                    dataAssiduite.forEach(item => {
                        if (item.date && item.date.startsWith(aujourdhui) && normalizeStr(item.classe) === targetClasseNorm) {
                            // On parcourt le tableau des élèves enregistré dans le nouveau format
                            if (item.eleves && Array.isArray(item.eleves)) {
                                item.eleves.forEach(eleveObj => {
                                    const eleveId = eleveObj.eleveId;
                                    if (eleveId && initialStatuts[eleveId]) {
                                        initialStatuts[eleveId] = eleveObj.statut || 'present';
                                    }
                                });
                            }
                        }
                    });
                } catch (err) {
                    console.log("Pas d'historique d'assiduité récupéré ou route non bloquante", err);
                }

                setStatuts(initialStatuts);
            } catch (err) {
                console.error("Erreur lors du chargement des élèves pour l'appel :", err);
                setError("Impossible de charger la liste des élèves pour cette classe.");
            } finally {
                setLoading(false);
            }
        };

        if (classeParam) {
            fetchElevesEtAssiduite();
        } else {
            setLoading(false);
            setError("Aucune classe spécifiée pour lancer l'appel.");
        }
    }, [classeParam]);

    const handleStatutChange = (eleveId, statut) => {
        setStatuts(prev => ({
            ...prev,
            [eleveId]: statut
        }));
    };

    const handleSetAllStatuts = (statut) => {
        const updated = {};
        eleves.forEach(e => {
            updated[e._id || e.id] = statut;
        });
        setStatuts(updated);
    };

    const handleEnregistrerAppel = async () => {
        try {
            setSaving(true);
            setError(null);
            setSuccessMessage(null);

            // MODIFICATION ICI : On intègre le nom et le prénom dans le payload envoyé au backend
            const statutsElevesPayload = eleves.map(eleve => {
                const id = eleve._id || eleve.id;
                return {
                    eleveId: id,
                    nom: eleve.nom,
                    prenom: eleve.prenom,
                    statut: statuts[id] || 'present'
                };
            });

            const payload = {
                profId: prof?.id_unique,
                profNom: prof?.nom || 'Enseignant',
                matiere: matiereParam,
                classe: classeParam,
                heure: heureParam,
                date: new Date().toISOString(),
                statutsEleves: statutsElevesPayload
            };

            await API.post('/assiduite/appel', payload);

            setSuccessMessage("Appel enregistré avec succès ! Les données d'assiduité ont été mises à jour.");
            setTimeout(() => {
                navigate('/DashboardProf');
            }, 1500);

        } catch (err) {
            console.error("Erreur lors de l'enregistrement de l'appel :", err);
            setError(err.response?.data?.message || "Erreur lors de l'enregistrement de l'appel.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="h-[500px] flex flex-col items-center justify-center bg-white rounded-[3.5rem] border border-dashed border-slate-200 gap-4">
                <div className="w-12 h-12 border-4 border-slate-100 border-t-violet-600 rounded-full animate-spin"></div>
                <p className="font-black italic text-slate-400 uppercase text-xs tracking-widest animate-pulse">
                    Chargement de la classe et des élèves...
                </p>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 w-full space-y-6 sm:space-y-8 pb-12 px-2 sm:px-0">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 sm:p-10 rounded-[2.5rem] sm:rounded-[3.5rem] border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4 sm:gap-6">
                    <button 
                        onClick={() => navigate('/DashboardProf')}
                        className="p-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-[1.8rem] transition-all shrink-0 active:scale-95"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 bg-violet-50 text-violet-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                                Appel en cours
                            </span>
                            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                                Classe : {classeParam}
                            </span>
                        </div>
                        <h2 className="text-2xl sm:text-4xl font-black italic tracking-tighter text-slate-800 leading-none">
                            Feuille <span className="text-slate-300 font-medium ml-1">/ d'Appel</span>
                        </h2>
                    </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-3xl border border-slate-100">
                    <div className="p-2.5 bg-violet-100 text-violet-600 rounded-2xl shrink-0">
                        <Clock size={18} />
                    </div>
                    <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase leading-tight">
                        Matière : <br/><span className="text-slate-800 font-black">{matiereParam}</span>
                    </p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border-2 border-dashed border-red-200 rounded-[2.5rem] p-6 text-center">
                    <AlertTriangle size={32} className="text-red-500 mx-auto mb-2" />
                    <p className="text-sm text-red-600 font-bold">{error}</p>
                </div>
            )}

            {successMessage && (
                <div className="bg-emerald-50 border-2 border-dashed border-emerald-200 rounded-[2.5rem] p-6 text-center">
                    <CheckCircle2 size={32} className="text-emerald-500 mx-auto mb-2" />
                    <p className="text-sm text-emerald-700 font-bold">{successMessage}</p>
                </div>
            )}

            {/* Liste des élèves avec taille et scroll contrôlés */}
            <div className="bg-white p-6 sm:p-8 rounded-[3.5rem] shadow-sm border border-slate-100 space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-2">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 italic">
                        Liste des étudiants ({eleves.length})
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                        {eleves.length > 0 && (
                            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl">
                                <button
                                    type="button"
                                    onClick={() => handleSetAllStatuts('present')}
                                    className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase bg-white text-emerald-600 shadow-sm transition-all"
                                >
                                    Tout Présent
                                </button>
                            </div>
                        )}
                        <div className="flex gap-3 text-xs font-bold text-slate-500">
                            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> Présent</span>
                            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> Retard</span>
                            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span> Absent</span>
                        </div>
                    </div>
                </div>

                {eleves.length > 0 ? (
                    <div className="max-h-[480px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                        {eleves.map((eleve) => {
                            const id = eleve._id || eleve.id;
                            const statutActuel = statuts[id] || 'present';

                            return (
                                <div 
                                    key={id}
                                    className="flex flex-col md:flex-row md:items-center justify-between p-3.5 sm:p-4 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-violet-200 transition-all gap-3"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-violet-100 text-violet-700 font-black flex items-center justify-center text-xs shrink-0">
                                            {eleve.prenom?.[0]}{eleve.nom?.[0]}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-800 text-sm sm:text-base italic leading-snug">
                                                {eleve.nom} {eleve.prenom}
                                            </h4>
                                            <p className="text-[10px] font-semibold text-slate-400">
                                                ID : {eleve.identifiantUnique || eleve.id_unique || 'N/A'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 sm:flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-slate-200 w-full md:w-auto">
                                        <button
                                            type="button"
                                            onClick={() => handleStatutChange(id, 'present')}
                                            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all text-center ${
                                                statutActuel === 'present' 
                                                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200' 
                                                    : 'text-slate-400 hover:text-slate-600'
                                            }`}
                                        >
                                            Présent
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleStatutChange(id, 'retard')}
                                            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all text-center ${
                                                statutActuel === 'retard' 
                                                    ? 'bg-amber-500 text-white shadow-md shadow-amber-200' 
                                                    : 'text-slate-400 hover:text-slate-600'
                                            }`}
                                        >
                                            Retard
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleStatutChange(id, 'absent')}
                                            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all text-center ${
                                                statutActuel === 'absent' 
                                                    ? 'bg-red-600 text-white shadow-md shadow-red-200' 
                                                    : 'text-slate-400 hover:text-slate-600'
                                            }`}
                                        >
                                            Absent
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="h-60 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 rounded-[2.5rem]">
                        <ShieldAlert size={36} className="text-slate-300 mb-3" />
                        <p className="text-sm font-bold text-slate-500">Aucun élève trouvé pour la classe {classeParam}.</p>
                    </div>
                )}

                {eleves.length > 0 && (
                    <div className="pt-4 flex justify-end border-t border-slate-100">
                        <button
                            type="button"
                            disabled={saving}
                            onClick={handleEnregistrerAppel}
                            className="w-full sm:w-auto px-8 py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-[2rem] font-black italic tracking-wider uppercase text-xs flex items-center justify-center gap-3 shadow-xl shadow-violet-200 transition-all disabled:opacity-50 active:scale-95"
                        >
                            <Save size={18} />
                            {saving ? "Enregistrement en cours..." : "Enregistrer l'appel"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LancerAppel;