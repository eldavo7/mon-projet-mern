// client/src/pages/DashboardProf.jsx

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const DashboardProf = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    
    // Simulation de données Professeur
    const prof = {
        prenom: "Jean-Pierre",
        nom: "Martin",
        matiere: "Mathématiques",
        classes: ["Terminale A", "1ère Générale", "2nde 4"],
        avatar: "https://ui-avatars.com/api/?name=Jean+Pierre+Martin&background=4F46E5&color=fff"
    };

    useEffect(() => {
        if (!token) {
            navigate('/');
        }
    }, [token, navigate]);

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            
            <main className="p-4 md:p-8 max-w-7xl mx-auto">
                {/* --- BANDEAU PROFESSEUR --- */}
                <div className="bg-indigo-700 rounded-2xl shadow-lg p-8 mb-8 text-white flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                    {/* Décoration en arrière-plan */}
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full"></div>
                    
                    <img 
                        src={prof.avatar} 
                        alt="Avatar Prof" 
                        className="w-28 h-28 rounded-2xl border-4 border-indigo-400/30 shadow-xl z-10"
                    />
                    
                    <div className="text-center md:text-left z-10">
                        <h2 className="text-3xl font-black italic tracking-tight">
                            ESPACE ENSEIGNANT
                        </h2>
                        <p className="text-xl mt-1 text-indigo-100 font-light">
                            Ravi de vous revoir, <span className="font-bold">M. {prof.nom}</span>
                        </p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                            {prof.classes.map((classe, index) => (
                                <span key={index} className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold border border-white/10">
                                    {classe}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- ACTIONS RAPIDES --- */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <button className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-indigo-500 hover:shadow-md transition group">
                        <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">📝</span>
                        <span className="text-sm font-bold text-gray-700">Faire l'appel</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-indigo-500 hover:shadow-md transition group">
                        <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">📊</span>
                        <span className="text-sm font-bold text-gray-700">Saisir Notes</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-indigo-500 hover:shadow-md transition group">
                        <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">📚</span>
                        <span className="text-sm font-bold text-gray-700">Déposer un cours</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-indigo-500 hover:shadow-md transition group">
                        <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">📣</span>
                        <span className="text-sm font-bold text-gray-700">Annonce</span>
                    </button>
                </div>

                {/* --- STATISTIQUES --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
                            Prochains Cours
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                <div>
                                    <p className="font-bold text-gray-700 text-sm">Terminale A - Mathématiques</p>
                                    <p className="text-xs text-gray-500">Salle 204 • 14:00 - 15:30</p>
                                </div>
                                <span className="bg-indigo-100 text-indigo-700 text-[10px] px-2 py-1 rounded font-black uppercase">Dans 1h</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="w-2 h-6 bg-orange-400 rounded-full"></span>
                            Alertes Absences
                        </h3>
                        <div className="flex items-center justify-center h-24 border-2 border-dashed border-gray-100 rounded-xl">
                            <p className="text-gray-400 text-sm italic">Aucune alerte critique aujourd'hui</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardProf;