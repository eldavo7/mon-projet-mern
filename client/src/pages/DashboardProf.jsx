// client/src/pages/DashboardProf.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Search, Users, BookOpen, Calendar, 
    Settings, LogOut, Menu, X, GraduationCap,
    CheckCircle, AlertCircle, Filter
} from 'lucide-react';

const DashboardProf = () => {
    const navigate = useNavigate();
    const [prof, setProf] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setProf(JSON.parse(storedUser));
        } else {
            navigate('/');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    if (!prof) return null;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex overflow-x-hidden">
            
            {/* --- BURGER BUTTON --- */}
            <button onClick={() => setIsSidebarOpen(true)} className="fixed top-4 left-4 z-40 p-3 bg-white shadow-md border border-slate-100 rounded-2xl text-violet-600">
                <Menu size={24} />
            </button>

            {/* --- SIDEBAR --- */}
            <aside className={`fixed top-0 left-0 z-50 h-full w-[300px] bg-white shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 border-b flex items-center justify-between">
                    <div className="flex items-center gap-3 italic font-black text-violet-600 uppercase">
                        <GraduationCap size={24} /> Honoré d'Urfé
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)}><X size={24} className="text-slate-400"/></button>
                </div>
                <nav className="flex-1 p-4 space-y-2 mt-4">
                    <button className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl bg-violet-50 text-violet-600 font-bold">
                        <Users size={20}/> Gestion Élèves
                    </button>
                    <button className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-500 hover:bg-slate-50 font-semibold">
                        <Calendar size={20}/> Emploi du temps
                    </button>
                    <button className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-500 hover:bg-slate-50 font-semibold">
                        <BookOpen size={20}/> Cahier de textes
                    </button>
                </nav>
                <div className="p-6"><button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-red-500 bg-red-50 font-bold"><LogOut size={20}/> Déconnexion</button></div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 p-6 md:p-12 lg:p-20 max-w-7xl mx-auto w-full">
                <header className="mb-12">
                    <p className="text-violet-600 font-black text-sm tracking-widest uppercase mb-2">Espace Enseignant</p>
                    <h1 className="text-4xl font-black text-slate-900 uppercase italic">
                        Bonjour, <span className="text-violet-600">Prof. {prof.nom}</span>
                    </h1>
                    <p className="text-slate-400 font-medium mt-2">Matière : {prof.matiere || 'Non renseignée'}</p>
                </header>

                {/* Barre de Recherche (Pour tes 1800 étudiants) */}
                <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 mb-8">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                            <input 
                                type="text" 
                                placeholder="Rechercher un élève (Nom, Prénom ou ID)..."
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-violet-50 outline-none transition-all font-medium"
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="flex items-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all">
                            <Filter size={20}/> Filtres
                        </button>
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Liste Rapide / Appel */}
                    <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                        <h2 className="text-xl font-black mb-6 flex items-center gap-3 italic">
                            <CheckCircle className="text-green-500" size={24} /> Faire l'appel (Cours actuel)
                        </h2>
                        <div className="space-y-3 text-sm font-bold uppercase italic">
                            {["Besson Michel", "Defer Biorne", "Zola Emile"].map((eleve, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <span>{eleve}</span>
                                    <div className="flex gap-2">
                                        <button className="px-3 py-1 bg-green-100 text-green-600 rounded-lg text-[10px]">PRÉSENT</button>
                                        <button className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-[10px]">ABSENT</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Stats / Alertes */}
                    <div className="bg-violet-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-violet-200">
                        <h2 className="text-xl font-black mb-6 flex items-center gap-3 italic text-white">
                            <AlertCircle size={24} /> ALERTES
                        </h2>
                        <div className="bg-white/10 p-4 rounded-2xl mb-4">
                            <p className="text-xs font-black opacity-70">ABSENCES NON JUSTIFIÉES</p>
                            <p className="text-2xl font-black">12 Élèves</p>
                        </div>
                        <div className="bg-white/10 p-4 rounded-2xl">
                            <p className="text-xs font-black opacity-70">CONSEIL DE CLASSE</p>
                            <p className="text-lg font-bold">Prévu le 15/01</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardProf;