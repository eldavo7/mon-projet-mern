// client/src/pages/DashboardEtudiant.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    LogOut, BookOpen, Calendar, Award, 
    Bell, GraduationCap, Mail, ChevronDown, 
    User, Home
} from 'lucide-react';

import { formatFullName } from '../utils/formatters';

const DashboardEtudiant = () => {
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setStudent(JSON.parse(storedUser));
        } else {
            navigate('/');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    if (!student) return null;

    // Liste des routes accessibles par l'étudiant
    const studentRoutes = [
        { label: "Accueil / Dashboard", path: "/DashboardEtudiant", icon: Home },
        { label: "Messagerie", path: "/messagerie", icon: Mail },
        { label: "Mon Planning", path: "/planning", icon: Calendar },
        { label: "Mon Profil", path: `/profil-etudiant/${student._id || student.id_unique}`, icon: User },
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
            
            {/* --- NAVBAR ÉTUDIANT --- */}
            <nav className="bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
                
                {/* MENU DÉROULANT DES ROUTES */}
                <div className="relative">
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2 rounded-2xl transition-all font-black text-sm uppercase italic"
                    >
                        <GraduationCap size={22} className="text-violet-600" />
                        <span>Honoré d'Urfé</span>
                        <ChevronDown size={18} className={`transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* MENU POPUP */}
                    {isMenuOpen && (
                        <div className="absolute top-full left-0 mt-2 w-60 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-50">
                            <p className="px-4 py-2 text-[10px] font-black uppercase text-slate-400 tracking-wider">Navigation</p>
                            {studentRoutes.map((route, idx) => {
                                const IconComponent = route.icon;
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            navigate(route.path);
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-2.5 flex items-center gap-3 text-sm font-bold text-slate-700 hover:bg-violet-50 hover:text-violet-600 transition-colors"
                                    >
                                        <IconComponent size={18} />
                                        {route.label}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* ACTIONS BOUTONS */}
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/messagerie')}
                        className="p-2 text-slate-400 hover:text-violet-600 transition-colors relative"
                        title="Ouvrir la messagerie ENT"
                    >
                        <Bell size={24} />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    <button onClick={handleLogout} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Déconnexion">
                        <LogOut size={24} />
                    </button>
                </div>
            </nav>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 p-6 md:p-12 lg:p-20 max-w-7xl mx-auto w-full">
                
                {/* --- HEADER --- */}
                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <p className="text-violet-600 font-black text-sm tracking-widest uppercase mb-2">Espace Étudiant</p>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 italic leading-none">
                            Salut, <br/>
                            <span className="text-violet-600">
                                {formatFullName(student.prenom, student.nom)}
                            </span>
                        </h1>
                        <div className="flex items-center gap-3 mt-4">
                            <span className="px-4 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                                {student.classe}
                            </span>
                            <span className="text-slate-400 font-bold text-xs uppercase italic">
                                ID: {student.id_unique}
                            </span>
                        </div>
                    </div>
                    
                    <div className="hidden md:flex items-center gap-4 bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm">
                        <div className="w-12 h-12 bg-violet-100 rounded-2xl flex items-center justify-center text-violet-600 font-black italic">
                            {student.prenom[0].toUpperCase()}
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Dernière connexion</p>
                            <p className="text-sm font-bold text-slate-700">Aujourd'hui, 08:15</p>
                        </div>
                    </div>
                </header>

                {/* --- GRILLE DE BORD --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    {/* Widget Emploi du Temps */}
                    <div 
                        onClick={() => navigate('/planning')}
                        className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
                    >
                        <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                            <Calendar size={24} />
                        </div>
                        <h3 className="text-lg font-black italic uppercase mb-2">Cours de 10h</h3>
                        <p className="text-slate-400 font-bold text-sm uppercase">Mathématiques • Salle 204</p>
                    </div>

                    {/* Widget Notes */}
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group">
                        <div className="w-12 h-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-500 group-hover:text-white transition-colors">
                            <Award size={24} />
                        </div>
                        <h3 className="text-lg font-black italic uppercase mb-2">Moyenne</h3>
                        <p className="text-slate-400 font-bold text-sm uppercase">14.5 / 20 • 2ème Trimestre</p>
                    </div>

                    {/* Widget Travail à faire */}
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group">
                        <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                            <BookOpen size={24} />
                        </div>
                        <h3 className="text-lg font-black italic uppercase mb-2">Devoirs</h3>
                        <p className="text-slate-400 font-bold text-sm uppercase">3 exercices • À rendre demain</p>
                    </div>

                    {/* Widget Messagerie ENT */}
                    <div 
                        onClick={() => navigate('/messagerie')}
                        className="bg-violet-600 p-8 rounded-[2.5rem] shadow-lg shadow-violet-200 text-white hover:scale-105 transition-all cursor-pointer"
                    >
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                            <Mail size={24} />
                        </div>
                        <h3 className="text-lg font-black italic uppercase mb-2">Messagerie</h3>
                        <p className="text-violet-100 font-bold text-sm uppercase">Consulter tes messages</p>
                    </div>

                </div>

            </main>
        </div>
    );
};

export default DashboardEtudiant;