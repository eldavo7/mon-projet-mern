import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    GraduationCap, ChevronDown, Home, Mail, 
    Calendar, User, LogOut, Bell 
} from 'lucide-react';

const Navbar = ({ user }) => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // Ferme le menu déroulant lors d'un clic à l'extérieur
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!user) return null;

    // Normalisation du rôle utilisateur
    const userRole = user.role ? String(user.role).toLowerCase() : '';
    const isProf = userRole === 'prof' || userRole === 'professeur' || userRole === 'enseignant';
    
    // Routes dynamiques selon le rôle
    const routes = isProf ? [
        { label: "Accueil Professeur", path: "/DashboardProf", icon: Home },
        { label: "Messagerie ENT", path: "/DashboardProf/messagerie", icon: Mail },
        { label: "Gestion Élèves", path: "/gestion-eleves", icon: User },
        { label: "Planning", path: "/planning-prof", icon: Calendar }
    ] : [
        { label: "Accueil Étudiant", path: "/DashboardEtudiant", icon: Home },
        { label: "Messagerie ENT", path: "/messagerie", icon: Mail },
        { label: "Mon Planning", path: "/planning", icon: Calendar },
        { label: "Mon Profil", path: `/profil-etudiant/${user._id || user.id || user.id_unique}`, icon: User }
    ];

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const targetMessagerie = isProf ? '/DashboardProf/messagerie' : '/messagerie';

    return (
        <nav className="bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
            {/* MENU DÉROULANT DE NAVIGATION */}
            <div className="relative" ref={menuRef}>
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2 rounded-2xl transition-all font-black text-sm uppercase italic"
                >
                    <GraduationCap size={22} className={isProf ? "text-indigo-600" : "text-violet-600"} />
                    <span>{user.lycee || user.etablissement || "Honoré d'Urfé"}</span>
                    <ChevronDown size={18} className={`transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isMenuOpen && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-50">
                        <p className="px-4 py-2 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                            Espace {isProf ? 'Enseignant' : 'Élève'}
                        </p>
                        {routes.map((r, idx) => {
                            const Icon = r.icon;
                            return (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        navigate(r.path);
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-2.5 flex items-center gap-3 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                                >
                                    <Icon size={18} />
                                    {r.label}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* NOTIFICATIONS & DÉCONNEXION */}
            <div className="flex items-center gap-3">
                <button 
                    onClick={() => navigate(targetMessagerie)}
                    className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-2xl transition-all relative"
                    title="Messagerie"
                >
                    <Bell size={22} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                </button>

                <button 
                    onClick={handleLogout} 
                    className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-2xl transition-all" 
                    title="Déconnexion"
                >
                    <LogOut size={22} />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;