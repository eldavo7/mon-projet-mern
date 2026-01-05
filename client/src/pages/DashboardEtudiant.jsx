// client/src/pages/DashboardEtudiant.jsx
// client/src/pages/DashboardEtudiant.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    LogOut, BookOpen, Calendar, Award, 
    Bell, User, GraduationCap, CheckCircle
} from 'lucide-react';

// Importation de la fonction utilitaire
import { formatFullName } from '../utils/formatters';

const DashboardEtudiant = () => {
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);

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

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
            
            {/* --- NAVBAR ÉTUDIANT --- */}
            <nav className="bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
                <div className="flex items-center gap-3 italic font-black text-violet-600 uppercase tracking-tighter">
                    <GraduationCap size={28} /> Honoré d'Urfé
                </div>
                <div className="flex items-center gap-4">
                    <button className="p-2 text-slate-400 hover:text-violet-600 transition-colors relative">
                        <Bell size={24} />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    <button onClick={handleLogout} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all">
                        <LogOut size={24} />
                    </button>
                </div>
            </nav>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 p-6 md:p-12 lg:p-20 max-w-7xl mx-auto w-full">
                
                {/* --- HEADER : APPLICATION DE LA FONCTION --- */}
                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <p className="text-violet-600 font-black text-sm tracking-widest uppercase mb-2">Espace Étudiant</p>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 italic leading-none">
                            Salut, <br/>
                            {/* ICI : Formatage du nom de l'élève */}
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
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group">
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

                    {/* Widget Assiduité */}
                    <div className="bg-violet-600 p-8 rounded-[2.5rem] shadow-lg shadow-violet-200 text-white hover:scale-105 transition-all cursor-pointer">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                            <CheckCircle size={24} />
                        </div>
                        <h3 className="text-lg font-black italic uppercase mb-2">Présence</h3>
                        <p className="text-violet-100 font-bold text-sm uppercase">Zéro absence • Bravo !</p>
                    </div>

                </div>

            </main>
        </div>
    );
};

export default DashboardEtudiant;