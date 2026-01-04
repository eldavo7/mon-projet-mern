// client/src/pages/DashboardEtudiant.jsximport { useEffect } from 'react';

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const DashboardEtudiant = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    
    // Simulation de données (En attendant de les récupérer depuis ton API)
    const etudiant = {
        prenom: "David",
        nom: "Dupont",
        classe: "Terminale Générale B",
        filiere: "Mathématiques & NSI",
        avatar: "https://ui-avatars.com/api/?name=David+Dupont&background=0D8ABC&color=fff"
    };

    useEffect(() => {
        if (!token) {
            navigate('/');
        }
    }, [token, navigate]);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            <main className="p-4 md:p-8 max-w-7xl mx-auto">
                {/* --- BANDEAU PROFIL STYLE --- */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 flex flex-col md:flex-row items-center gap-6">
                    <img 
                        src={etudiant.avatar} 
                        alt="Avatar" 
                        className="w-24 h-24 rounded-full border-4 border-blue-50 shadow-sm"
                    />
                    <div className="text-center md:text-left flex-1">
                        <h2 className="text-3xl font-extrabold text-gray-800">
                            Bonjour, {etudiant.prenom} 👋
                        </h2>
                        <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-2">
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-sm font-semibold">
                                🏫 {etudiant.classe}
                            </span>
                            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-md text-sm font-semibold">
                                📚 {etudiant.filiere}
                            </span>
                        </div>
                    </div>
                    <div className="hidden lg:block border-l pl-8 border-gray-100">
                        <p className="text-sm text-gray-400">Année scolaire</p>
                        <p className="font-bold text-gray-600">2025 - 2026</p>
                    </div>
                </div>

                {/* --- GRILLE DE CARTES --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-600">
                            📅
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Cours du jour</h3>
                        <p className="text-3xl font-bold text-gray-900 mt-1">4 Séances</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4 text-purple-600">
                            ✉️
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Messages</h3>
                        <p className="text-3xl font-bold text-gray-900 mt-1">12 Nouveaux</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4 text-green-600">
                            ✅
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Statut scolaire</h3>
                        <p className="text-xl font-bold text-green-600 mt-1">Dossier Complet</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardEtudiant;