// client/src/components/Navbar.jsx

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Mail, 
  LogOut, 
  User as UserIcon, 
  ChevronDown 
} from 'lucide-react';
import { formatFullName } from '../utils/formatters';

export default function Navbar({ user }) {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const isProf = user?.role?.toLowerCase() === 'prof' || user?.role?.toLowerCase() === 'professeur' || user?.role?.toLowerCase() === 'admin';
  const basePath = isProf ? '/DashboardProf' : '/DashboardEtudiant';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const closeDropdown = () => setIsDropdownOpen(false);

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* LOGO ET BRAND */}
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${isProf ? 'bg-violet-600 shadow-violet-200' : 'bg-indigo-600 shadow-indigo-200'} text-white rounded-2xl flex items-center justify-center font-black text-xl italic shadow-md`}>
            {isProf ? 'P' : 'E'}
          </div>
          <div>
            <span className="font-black text-slate-800 text-lg tracking-tight block leading-none">ENT Honoré d' Urfé </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {isProf ? 'Espace Enseignant' : 'Espace Élève'}
            </span>
          </div>
        </div>

        {/* NAVIGATION DESKTOP */}
        <nav className="hidden md:flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
          <NavLink
            to={basePath}
            end
            className={({ isActive }) =>
              `flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                isActive
                  ? `bg-white ${isProf ? 'text-violet-600' : 'text-indigo-600'} shadow-sm border border-slate-100`
                  : 'text-slate-500 hover:text-slate-800'
              }`
            }
          >
            <LayoutDashboard size={16} />
            <span>Accueil</span>
          </NavLink>

          <NavLink
            to={`${basePath}/planning`}
            className={({ isActive }) =>
              `flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                isActive
                  ? `bg-white ${isProf ? 'text-violet-600' : 'text-indigo-600'} shadow-sm border border-slate-100`
                  : 'text-slate-500 hover:text-slate-800'
              }`
            }
          >
            <Calendar size={16} />
            <span>Planning</span>
          </NavLink>

          {isProf ? (
            <NavLink
              to="/DashboardProf/gestion-eleve"
              className={({ isActive }) =>
                `flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                  isActive
                    ? 'bg-white text-violet-600 shadow-sm border border-slate-100'
                    : 'text-slate-500 hover:text-slate-800'
                }`
              }
            >
              <Users size={16} />
              <span>Gestion Élèves</span>
            </NavLink>
          ) : (
            <NavLink
              to={`/etudiant/${user?._id || user?.id}`}
              className={({ isActive }) =>
                `flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                  isActive
                    ? 'bg-white text-indigo-600 shadow-sm border border-slate-100'
                    : 'text-slate-500 hover:text-slate-800'
                }`
              }
            >
              <UserIcon size={16} />
              <span>Mon Profil & Notes</span>
            </NavLink>
          )}

          <NavLink
            to={`${basePath}/messagerie`}
            className={({ isActive }) =>
              `flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                isActive
                  ? `bg-white ${isProf ? 'text-violet-600' : 'text-indigo-600'} shadow-sm border border-slate-100`
                  : 'text-slate-500 hover:text-slate-800'
              }`
            }
          >
            <Mail size={16} />
            <span>Messagerie ENT</span>
          </NavLink>
        </nav>

        {/* PROFIL & BTN LISTE DÉROULANTE MOBILE */}
        <div className="relative flex items-center gap-3">
          
          {/* Bloc Profil (Cache sur tres petits ecrans) */}
          <div className="hidden sm:flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
            <div className={`w-8 h-8 ${isProf ? 'bg-violet-100 text-violet-600' : 'bg-indigo-100 text-indigo-600'} rounded-xl flex items-center justify-center font-bold`}>
              <UserIcon size={16} />
            </div>
            <div className="text-left">
              <p className="text-xs font-black text-slate-800">
                {formatFullName(user?.prenom, user?.nom)}
              </p>
              <p className="text-[10px] font-bold text-slate-400 capitalize">
                {user?.role || 'Utilisateur'}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Déconnexion"
            className="hidden sm:flex p-3 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-2xl border border-slate-100 transition-all"
          >
            <LogOut size={18} />
          </button>

          {/* Bouton déclencheur de la Liste Déroulante (visibles uniquement sur mobile) */}
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`md:hidden flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs border border-slate-100 transition-all ${
              isDropdownOpen ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-700'
            }`}
          >
            <span>Menu</span>
            <ChevronDown size={16} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* LISTE DÉROULANTE MOBILE */}
          {isDropdownOpen && (
            <div className="md:hidden absolute right-0 top-14 w-60 bg-white rounded-3xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-3 border-b border-slate-100 mb-1 sm:hidden">
                <p className="text-xs font-black text-slate-800">
                  {formatFullName(user?.prenom, user?.nom)}
                </p>
                <p className="text-[10px] font-bold text-slate-400 capitalize">
                  {user?.role || 'Utilisateur'}
                </p>
              </div>

              <NavLink
                to={basePath}
                end
                onClick={closeDropdown}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs transition-all ${
                    isActive
                      ? `${isProf ? 'bg-violet-50 text-violet-600' : 'bg-indigo-50 text-indigo-600'}`
                      : 'text-slate-600 hover:bg-slate-50'
                  }`
                }
              >
                <LayoutDashboard size={16} /> Accueil
              </NavLink>

              <NavLink
                to={`${basePath}/planning`}
                onClick={closeDropdown}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs transition-all ${
                    isActive
                      ? `${isProf ? 'bg-violet-50 text-violet-600' : 'bg-indigo-50 text-indigo-600'}`
                      : 'text-slate-600 hover:bg-slate-50'
                  }`
                }
              >
                <Calendar size={16} /> Planning
              </NavLink>

              {isProf ? (
                <NavLink
                  to="/DashboardProf/gestion-eleve"
                  onClick={closeDropdown}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs transition-all ${
                      isActive ? 'bg-violet-50 text-violet-600' : 'text-slate-600 hover:bg-slate-50'
                    }`
                  }
                >
                  <Users size={16} /> Gestion Élèves
                </NavLink>
              ) : (
                <NavLink
                  to={`/etudiant/${user?._id || user?.id}`}
                  onClick={closeDropdown}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs transition-all ${
                      isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'
                    }`
                  }
                >
                  <UserIcon size={16} /> Mon Profil & Notes
                </NavLink>
              )}

              <NavLink
                to={`${basePath}/messagerie`}
                onClick={closeDropdown}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs transition-all ${
                    isActive
                      ? `${isProf ? 'bg-violet-50 text-violet-600' : 'bg-indigo-50 text-indigo-600'}`
                      : 'text-slate-600 hover:bg-slate-50'
                  }`
                }
              >
                <Mail size={16} /> Messagerie ENT
              </NavLink>

              <div className="pt-2 border-t border-slate-100 mt-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-xs text-red-500 hover:bg-red-50 transition-all"
                >
                  <span>Déconnexion</span>
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </header>
  );
}