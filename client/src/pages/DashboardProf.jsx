// client/src/pages/DashboardProf.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet, NavLink } from 'react-router-dom';
import { 
    Users, Calendar, LogOut, Menu, X, 
    CheckCircle, AlertCircle, Clock 
} from 'lucide-react';
import { formatFullName } from '../utils/formatters';
import SearchBar from '../components/SearchBar';

// --- COMPOSANT 1 : L'ACCUEIL (Vue d'ensemble) ---
export const VueAccueilProf = () => {
    const prof = JSON.parse(localStorage.getItem('user'));
    const dateParis = new Intl.DateTimeFormat('fr-FR', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long' 
    }).format(new Date());

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in fade-in duration-500">
            {/* Colonne Gauche : Prochain Cours / Appel */}
            <div className="lg:col-span-2 bg-white rounded-[3.5rem] p-12 shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-12">
                    <h2 className="text-3xl font-black flex items-center gap-4 italic text-slate-800 tracking-tighter">
                        <div className="p-3 bg-green-100 rounded-2xl">
                            <CheckCircle className="text-green-600" size={28} />
                        </div>
                        Prochain cours
                    </h2>
                    <span className="bg-slate-50 px-6 py-3 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">
                        {dateParis}
                    </span>
                </div>
                
                <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                    <p className="font-black italic text-slate-400 text-lg mb-4 italic uppercase tracking-tight">
                        {prof?.matiere ? `Session de ${prof.matiere}` : "Prêt pour votre prochain cours ?"}
                    </p>
                    <button className="px-8 py-4 bg-violet-600 text-white rounded-2xl font-black italic hover:bg-violet-700 transition-all shadow-lg shadow-violet-100 active:scale-95">
                        Lancer l'appel
                    </button>
                </div>
            </div>

            {/* Colonne Droite : Infos Enseignant */}
            <section className="bg-violet-600 rounded-[3.5rem] p-12 text-white shadow-2xl relative overflow-hidden">
                <h2 className="text-2xl font-black mb-10 flex items-center gap-3 italic tracking-tighter">
                    <AlertCircle size={28} /> Infos Poste
                </h2>
                <div className="space-y-6">
                    <div className="bg-white/10 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10">
                        <p className="text-[10px] font-black opacity-60 uppercase tracking-[0.2em] mb-2">Matière Enseignée</p>
                        <p className="text-2xl font-black italic uppercase">{prof?.matiere || 'Non définie'}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10">
                        <p className="text-[10px] font-black opacity-60 uppercase tracking-[0.2em] mb-2">Identifiant Unique</p>
                        <p className="text-xl font-black">{prof?.id_unique}</p>
                    </div>
                </div>
                {/* Décoration subtile en arrière-plan */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
            </section>
        </div>
    );
};

// --- LE LAYOUT PRINCIPAL DU DASHBOARD ---
const DashboardProf = () => {
    const navigate = useNavigate();
    const [prof, setProf] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    const dateParisComplet = new Intl.DateTimeFormat('fr-FR', { 
        timeZone: 'Europe/Paris', 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    }).format(new Date());

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser.role !== 'prof') {
                navigate('/');
            } else {
                setProf(parsedUser);
            }
        } else {
            navigate('/');
        }
    }, [navigate]);

    if (!prof) return null;

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex overflow-x-hidden relative">
            
            {/* BOUTON MENU MOBILE */}
            <button 
                onClick={() => setIsSidebarOpen(true)} 
                className="fixed top-6 right-6 z-40 p-4 bg-white shadow-xl border border-slate-100 rounded-[1.2rem] text-violet-600 hover:scale-110 transition-all active:scale-90"
            >
                <Menu size={24} />
            </button>

            {/* SIDEBAR NAVIGATION (DRAWER) */}
            <aside className={`fixed top-0 right-0 z-50 h-full w-[320px] bg-white shadow-2xl transition-transform duration-500 flex flex-col ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                        <X size={24} className="text-slate-400"/>
                    </button>
                    <div className="italic font-black text-violet-600 uppercase text-xl">Honoré d'Urfé</div>
                </div>

                <nav className="flex-1 p-6 space-y-3 mt-4 text-right">
                    <NavLink 
                        to="/DashboardProf" 
                        end 
                        onClick={() => setIsSidebarOpen(false)}
                        className={({ isActive }) => `w-full flex items-center justify-end gap-4 px-6 py-4 rounded-[1.5rem] font-black italic transition-all ${isActive ? 'bg-violet-600 text-white shadow-lg shadow-violet-100' : 'text-slate-400 hover:bg-slate-50'}`}
                    >
                        Vue d'ensemble <Clock size={22}/>
                    </NavLink>
                    <NavLink 
                        to="/DashboardProf/planning" 
                        onClick={() => setIsSidebarOpen(false)}
                        className={({ isActive }) => `w-full flex items-center justify-end gap-4 px-6 py-4 rounded-[1.5rem] font-black italic transition-all ${isActive ? 'bg-violet-600 text-white shadow-lg shadow-violet-100' : 'text-slate-400 hover:bg-slate-50'}`}
                    >
                        Emploi du temps <Calendar size={22}/>
                    </NavLink>
                    <NavLink 
                        to="/DashboardProf/gestion-eleve" 
                        onClick={() => setIsSidebarOpen(false)}
                        className={({ isActive }) => `w-full flex items-center justify-end gap-4 px-6 py-4 rounded-[1.5rem] font-black italic transition-all ${isActive ? 'bg-violet-600 text-white shadow-lg shadow-violet-100' : 'text-slate-400 hover:bg-slate-50'}`}
                    >
                        Gestion Élèves <Users size={22}/>
                    </NavLink>
                </nav>

                <div className="p-8">
                    <button 
                        onClick={handleLogout} 
                        className="w-full py-4 rounded-[1.5rem] text-red-500 bg-red-50 font-black italic hover:bg-red-100 transition-colors flex items-center justify-center gap-3"
                    >
                        <LogOut size={20}/> Déconnexion
                    </button>
                </div>
            </aside>

            {/* CONTENU PRINCIPAL */}
            <main className="flex-1 p-6 md:p-12 lg:p-24 max-w-7xl mx-auto w-full">
                <header className="mb-16">
                    <p className="text-violet-600 font-black text-xs tracking-[0.2em] uppercase mb-3">Espace Enseignant</p>
                    <h1 className="text-5xl md:text-6xl font-black text-slate-900 italic tracking-tighter leading-[0.9]">
                        Bonjour, <br/>
                        <span className="text-violet-600 underline decoration-slate-200 underline-offset-[12px]">
                            Prof. {prof ? formatFullName(prof.prenom, prof.nom) : ''}
                        </span>
                    </h1>
                    <div className="text-slate-400 font-bold mt-10 uppercase text-[10px] flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> 
                        {dateParisComplet}
                    </div>
                </header>

                <SearchBar />

                {/* ZONE DE RENDU DYNAMIQUE */}
                <div className="mt-12">
                    <Outlet context={{ prof }} />
                </div>
            </main>
        </div>
    );
};

export default DashboardProf;

// --- EXPORTS POUR APP.JSX ---
export { default as VuePlanning } from './PlanningProf';