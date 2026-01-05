// client/src/pages/DashboardProf.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet, NavLink } from 'react-router-dom';
import { 
    Users, BookOpen, Calendar, LogOut, Menu, X, 
    GraduationCap, CheckCircle, AlertCircle, Clock 
} from 'lucide-react';
import { formatFullName } from '../utils/formatters';
import SearchBar from '../components/SearchBar';

// --- COMPOSANT 1 : L'ACCUEIL (Appel du jour) ---
export const VueAccueilProf = () => {
    const [prof, setProf] = useState(JSON.parse(localStorage.getItem('user')));
    const dateParis = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in fade-in duration-500">
            <div className="lg:col-span-2 bg-white rounded-[3.5rem] p-12 shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-12">
                    <h2 className="text-3xl font-black flex items-center gap-4 italic text-slate-800 tracking-tighter">
                        <div className="p-3 bg-green-100 rounded-2xl"><CheckCircle className="text-green-600" size={28} /></div>
                        Appel du jour
                    </h2>
                    <span className="bg-slate-50 px-6 py-3 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">
                        {dateParis}
                    </span>
                </div>
                <div className="space-y-4">
                    {[{p: "michel", n: "besson"}, {p: "biorne", n: "defer"}, {p: "emile", n: "zola"}].map((eleve, i) => (
                        <div key={i} className="flex items-center justify-between p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:border-violet-200 hover:bg-white transition-all group">
                            <span className="font-black italic text-slate-700 group-hover:text-violet-600 text-lg">{formatFullName(eleve.p, eleve.n)}</span>
                            <div className="flex gap-3">
                                <button className="px-6 py-3 bg-white border border-slate-200 text-slate-400 rounded-xl text-[10px] font-black uppercase hover:bg-green-500 hover:text-white transition-all">Présent</button>
                                <button className="px-6 py-3 bg-white border border-slate-200 text-slate-400 rounded-xl text-[10px] font-black uppercase hover:bg-red-500 hover:text-white transition-all">Absent</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <section className="bg-violet-600 rounded-[3.5rem] p-12 text-white shadow-2xl relative overflow-hidden">
                <h2 className="text-2xl font-black mb-10 flex items-center gap-3 italic tracking-tighter"><AlertCircle size={28} /> Alertes</h2>
                <div className="bg-white/10 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10">
                    <p className="text-[10px] font-black opacity-60 uppercase tracking-[0.2em] mb-2">Discipline</p>
                    <p className="text-2xl font-black italic">{prof?.matiere || 'Général'}</p>
                </div>
            </section>
        </div>
    );
};

// --- COMPOSANT 2 : LE PLANNING ---
export const VuePlanning = () => {
    const now = new Date();
    const getWeekDays = () => {
        const curr = new Date(now);
        const first = curr.getDate() - curr.getDay() + 1;
        return Array.from({ length: 5 }, (_, i) => {
            const d = new Date(curr.setDate(first + i));
            return { nom: d.toLocaleDateString('fr-FR', { weekday: 'short' }), num: d.getDate(), isToday: d.getDate() === now.getDate() };
        });
    };

    return (
        <div className="bg-white rounded-[3.5rem] p-12 shadow-sm border border-slate-100 animate-in slide-in-from-right-8 duration-500">
            <h2 className="text-3xl font-black mb-12 italic text-slate-800 flex items-center gap-4">
                <div className="p-3 bg-violet-100 rounded-2xl text-violet-600"><Calendar size={28} /></div> Emploi du temps
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {getWeekDays().map((day, i) => (
                    <div key={i} className={`p-8 rounded-[2.5rem] border transition-all ${day.isToday ? 'bg-violet-600 text-white shadow-2xl border-violet-600' : 'bg-slate-50 border-slate-100'}`}>
                        <p className="text-[10px] font-black uppercase mb-2">{day.nom}</p>
                        <p className="text-4xl font-black italic mb-8">{day.num}</p>
                        <div className="h-40 rounded-[1.5rem] border-2 border-dashed border-slate-200 bg-white flex items-center justify-center p-4">
                            <p className="text-[10px] font-bold italic uppercase text-slate-300">Aucun cours</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- LE LAYOUT PRINCIPAL ---
const DashboardProf = () => {
    const navigate = useNavigate();
    const [prof, setProf] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const dateParis = new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setProf(JSON.parse(storedUser));
        else navigate('/');
    }, [navigate]);

    if (!prof) return null;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex overflow-x-hidden relative">
            <button onClick={() => setIsSidebarOpen(true)} className="fixed top-6 right-6 z-40 p-4 bg-white shadow-xl border border-slate-100 rounded-[1.2rem] text-violet-600 hover:scale-110 transition-all">
                <Menu size={24} />
            </button>

            <aside className={`fixed top-0 right-0 z-50 h-full w-[320px] bg-white shadow-2xl transition-transform duration-500 flex flex-col ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-slate-50 rounded-xl"><X size={24} className="text-slate-400"/></button>
                    <div className="italic font-black text-violet-600 uppercase text-xl">Honoré d'Urfé</div>
                </div>

                <nav className="flex-1 p-6 space-y-3 mt-4 text-right">
                    <NavLink to="/DashboardProf" end className={({ isActive }) => `w-full flex items-center justify-end gap-4 px-6 py-4 rounded-[1.5rem] font-black italic transition-all ${isActive ? 'bg-violet-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>
                        Vue d'ensemble <Clock size={22}/>
                    </NavLink>
                    <NavLink to="/DashboardProf/planning" className={({ isActive }) => `w-full flex items-center justify-end gap-4 px-6 py-4 rounded-[1.5rem] font-black italic transition-all ${isActive ? 'bg-violet-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>
                        Emploi du temps <Calendar size={22}/>
                    </NavLink>
                    <NavLink to="/DashboardProf/gestion-eleve" className={({ isActive }) => `w-full flex items-center justify-end gap-4 px-6 py-4 rounded-[1.5rem] font-black italic transition-all ${isActive ? 'bg-violet-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>
                        Gestion Élèves <Users size={22}/>
                    </NavLink>
                </nav>

                <div className="p-8">
                    <button onClick={() => { localStorage.clear(); navigate('/'); }} className="w-full py-4 rounded-[1.5rem] text-red-500 bg-red-50 font-black italic">Déconnexion</button>
                </div>
            </aside>

            <main className="flex-1 p-6 md:p-12 lg:p-24 max-w-7xl mx-auto w-full">
                <header className="mb-16">
                    <p className="text-violet-600 font-black text-xs tracking-widest uppercase mb-3">Espace Enseignant</p>
                    <h1 className="text-5xl md:text-6xl font-black text-slate-900 italic tracking-tighter leading-[0.9]">
                        Bonjour, <br/><span className="text-violet-600 underline decoration-slate-200 underline-offset-[12px]">Prof. {formatFullName(prof.prenom, prof.nom)}</span>
                    </h1>
                    <div className="text-slate-400 font-bold mt-8 uppercase text-[10px] flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> {dateParis}
                    </div>
                </header>

                <SearchBar />

                {/* --- ICI S'INJECTENT LES SOUS-VUES --- */}
                <div className="mt-12">
                    <Outlet context={{ prof }} />
                </div>
            </main>
        </div>
    );
};

export default DashboardProf;