// client/src/pages/DashboardEtudiant.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Bell, Calendar, BookOpen, MessageSquare, 
    Settings, User, LogOut, LayoutDashboard, 
    Menu, X, GraduationCap, Clock, ClipboardList, ChevronRight
} from 'lucide-react';

const DashboardEtudiant = () => {
    const navigate = useNavigate();
    const [etudiant, setEtudiant] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setEtudiant(JSON.parse(storedUser));
        } else {
            navigate('/');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    if (!etudiant) return null;

    const menuItems = [
        { name: 'Profil', icon: <User size={20}/> },
        { name: 'Paramètres', icon: <Settings size={20}/> },
        { name: 'Planning', icon: <Calendar size={20}/> },
        { name: 'Messagerie', icon: <MessageSquare size={20}/> },
        { name: 'Devoirs', icon: <BookOpen size={20}/> },
        { name: 'Ds / Examens', icon: <ClipboardList size={20}/> },
        { name: 'Notes', icon: <LayoutDashboard size={20}/> },
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex overflow-x-hidden">
            
            {/* --- BOUTON BURGER (Inspiré Gemini) --- */}
            <button 
                onClick={() => setIsSidebarOpen(true)}
                className="fixed top-4 left-4 z-40 p-3 bg-white shadow-md border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all text-violet-600"
            >
                <Menu size={24} />
            </button>

            {/* --- OVERLAY --- */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* --- SIDEBAR COULISSANTE (Blanc & Violet) --- */}
            <aside className={`fixed top-0 left-0 z-50 h-full w-[300px] bg-white shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                
                {/* Header Sidebar avec le nom du Lycée */}
                <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-violet-600 p-2 rounded-xl text-white">
                            <GraduationCap size={24} />
                        </div>
                        <span className="font-black text-lg tracking-tighter italic text-slate-800 uppercase">Honoré d'Urfé</span>
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400 hover:text-slate-600">
                        <X size={24} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-2 mt-4">
                    {menuItems.map((item) => (
                        <button 
                            key={item.name}
                            className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl hover:bg-violet-50 transition-all group"
                        >
                            <div className="flex items-center gap-4 text-slate-600 group-hover:text-violet-600 font-semibold">
                                {item.icon}
                                <span className="text-sm">{item.name}</span>
                            </div>
                            <ChevronRight size={16} className="text-slate-300 group-hover:text-violet-400" />
                        </button>
                    ))}
                </nav>

                {/* Footer Sidebar */}
                <div className="p-6 bg-slate-50">
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl bg-white border border-red-100 text-red-500 hover:bg-red-50 transition-colors font-bold shadow-sm"
                    >
                        <LogOut size={20} />
                        <span>Déconnexion</span>
                    </button>
                </div>
            </aside>

            {/* --- CONTENU PRINCIPAL --- */}
            <main className="flex-1 p-6 md:p-12 lg:p-20 max-w-7xl mx-auto w-full">
                
                {/* Header Infos Étudiant */}
                <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-violet-600 font-bold text-sm uppercase tracking-widest mb-4">
                            <div className="w-8 h-[2px] bg-violet-600"></div>
                            Tableau de Bord
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                            Bienvenue, <br/>
                            <span className="text-violet-600 italic uppercase">{etudiant.prenom} {etudiant.nom}</span>
                        </h1>
                    </div>
                    
                    <div className="bg-white p-4 pr-8 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-4">
                         <div className="w-14 h-14 bg-violet-100 rounded-2xl flex items-center justify-center text-violet-600 font-black text-xl">
                            {etudiant.prenom[0]}{etudiant.nom[0]}
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Classe actuelle</p>
                            <p className="text-lg font-bold text-slate-800 italic">{etudiant.classe}</p>
                         </div>
                    </div>
                </header>

                {/* Grille Inspirée Excalidraw */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Bloc Notifications (2/3 de large) */}
                    <div className="lg:col-span-2 space-y-6">
                        <section className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-slate-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
                            
                            <h2 className="text-2xl font-black mb-10 flex items-center gap-4 text-slate-800">
                                <Bell className="text-violet-600" size={28} />
                                Notifications
                            </h2>
                            
                            <div className="space-y-6">
                                <div className="p-8 bg-slate-50 rounded-[2.5rem] border-l-4 border-violet-500 relative">
                                    <span className="absolute top-4 right-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Urgent</span>
                                    <p className="text-violet-600 font-black text-xs mb-2 italic">MATHÉMATIQUES • POUR LE 15/01</p>
                                    <p className="text-slate-700 font-medium text-lg leading-relaxed">
                                        Faire les exercices 12 à 15 page 54. Relire attentivement le chapitre 4 sur les fonctions.
                                    </p>
                                </div>

                                <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem]">
                                    <p className="text-slate-700 font-medium italic">
                                        L'absence de Mme Laguerla est prolongée. Les cours seront assurés par M. Yui.
                                    </p>
                                </div>

                                <button className="w-full py-5 border-2 border-dashed border-slate-200 rounded-[2.5rem] text-slate-400 font-black uppercase tracking-widest hover:border-violet-300 hover:text-violet-500 transition-all">
                                    + Voir les devoirs d'Histoire
                                </button>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar de droite : DS & Planning */}
                    <div className="space-y-8">
                        <section className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl shadow-violet-200">
                            <h2 className="text-xl font-black mb-8 flex items-center gap-3 italic">
                                <Clock className="text-violet-400" size={24} />
                                DS À VENIR
                            </h2>
                            <div className="space-y-8">
                                <div className="relative pl-6 border-l-2 border-violet-500">
                                    <p className="text-[10px] font-black text-violet-400 uppercase mb-1 tracking-widest">20 JANVIER</p>
                                    <p className="text-xl font-bold uppercase italic">Mathématiques</p>
                                </div>
                                <div className="relative pl-6 border-l-2 border-slate-700">
                                    <p className="text-[10px] font-black text-slate-500 uppercase mb-1 tracking-widest">27 JANVIER</p>
                                    <p className="text-xl font-bold uppercase italic text-slate-400">Anglais</p>
                                </div>
                            </div>
                        </section>

                        <section className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100">
                            <h2 className="text-xl font-black mb-6 flex items-center gap-3 italic text-slate-800">
                                <Calendar className="text-violet-600" size={24} />
                                PLANNING
                            </h2>
                            <div className="aspect-square bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-400 p-6 text-center italic">
                                <Calendar size={40} className="mb-4 opacity-20" />
                                <p className="text-sm font-medium">Cliquez pour voir l'emploi du temps complet</p>
                            </div>
                        </section>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default DashboardEtudiant;