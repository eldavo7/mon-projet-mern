// client/src/pages/ProfilEtudiant.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, GraduationCap, Calendar } from 'lucide-react';

// Importation de la fonction de formatage
import { formatFullName } from '../utils/formatters';

const ProfilEtudiant = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:5001/api/students/${id}`)
            .then(res => res.json())
            .then(data => setStudent(data));
    }, [id]);

    if (!student) return <div className="p-20 font-black italic">Chargement du profil...</div>;

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-20">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-violet-600 font-bold mb-10 hover:gap-4 transition-all uppercase italic">
                <ArrowLeft size={20} /> Retour au Dashboard
            </button>

            <div className="max-w-4xl mx-auto bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
                <div className="bg-violet-600 p-12 text-white flex flex-col md:flex-row items-center gap-8">
                    <div className="w-32 h-32 bg-white rounded-[2.5rem] flex items-center justify-center text-violet-600 text-5xl font-black">
                        {/* Initiales en majuscules */}
                        {student.prenom[0].toUpperCase()}{student.nom[0].toUpperCase()}
                    </div>
                    <div>
                        {/* UTILISATION DU FORMATTER ICI (On enlève 'uppercase' du h1 pour laisser le formatter gérer) */}
                        <h1 className="text-4xl font-black italic tracking-tighter">
                            {formatFullName(student.prenom, student.nom)}
                        </h1>
                        <p className="opacity-80 font-bold text-xl uppercase italic mt-2">{student.classe}</p>
                    </div>
                </div>

                <div className="p-12 grid grid-cols-1 md:grid-cols-2 gap-12 font-medium italic">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-2xl">
                            <User className="text-violet-500" />
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Âge / Genre</p>
                                <p className="text-lg text-slate-700">{student.age} ans • {student.genre}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-2xl">
                            <GraduationCap className="text-violet-500" />
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Identifiant Unique</p>
                                <p className="text-lg text-slate-700">{student.id_unique}</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Zone pour les notes ou absences futures */}
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white">
                        <h3 className="text-lg font-black mb-4 flex items-center gap-3"><Calendar size={20} /> Historique Rapide</h3>
                        <p className="text-slate-400 text-sm">Aucune absence signalée ce mois-ci.</p>
                        <button className="mt-6 w-full py-3 bg-violet-600 rounded-xl font-bold uppercase text-xs">Modifier le dossier</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilEtudiant;