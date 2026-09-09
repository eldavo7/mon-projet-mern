// client/src/components/Navbar.jsx

import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Mail, 
  LogOut, 
  User as UserIcon, 
  ChevronDown,
  Bell,
  Award,
  MessageSquare,
  Newspaper,
  CheckCheck
} from 'lucide-react';
import { formatFullName } from '../utils/formatters';
import axios from 'axios';

export default function Navbar({ user, notifications = [], setNotifications }) {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);

  const isProf = user?.role?.toLowerCase() === 'prof' || user?.role?.toLowerCase() === 'professeur' || user?.role?.toLowerCase() === 'admin';
  const basePath = isProf ? '/DashboardProf' : '/DashboardEtudiant';

  // Fermer le centre de notifications si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };
    if (isNotifOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotifOpen]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const closeDropdown = () => setIsDropdownOpen(false);

  // Filtrer les notifications non lues pour le badge
  const unreadCount = notifications.filter(n => !n.read).length;

  // Marquer toutes les notifications comme lues via l'API backend
  const handleMarkAllAsRead = async () => {
    try {
      const userId = user?._id || user?.id;
      const API_BASE = `http://${window.location.hostname}:5001/api`;
      await axios.put(`${API_BASE}/notifications/read-all/${userId}`);
      
      // Mettre à jour l'état localement
      if (setNotifications) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      }
    } catch (err) {
      console.error("Erreur lors de la mise à jour des notifications :", err);
    }
  };

  // Gérer le clic sur une notification spécifique
  const handleNotifClick = async (notif) => {
    try {
      const API_BASE = `http://${window.location.hostname}:5001/api`;
      if (!notif.read && notif._id) {
        await axios.put(`${API_BASE}/notifications/read/${notif._id}`);
        if (setNotifications) {
          setNotifications(prev => prev.map(n => (n._id === notif._id ? { ...n, read: true } : n)));
        }
      }
    } catch (err) {
      console.error("Erreur lecture notification:", err);
    }

    if (notif.type === 'note' || notif.type === 'retard') {
      navigate(isProf ? '/DashboardProf/gestion-eleve' : `/etudiant/${user?._id || user?.id}`);
    } else if (notif.type === 'message') {
      navigate(`${basePath}/messagerie`);
    }
    setIsNotifOpen(false);
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'note':
      case 'retard':
        return <Award className="w-4 h-4 text-violet-600" />;
      case 'message':
        return <MessageSquare className="w-4 h-4 text-emerald-600" />;
      case 'actualite':
      default:
        return <Newspaper className="w-4 h-4 text-amber-600" />;
    }
  };

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

        {/* PROFIL & NOTIFICATIONS & DROPDOWNS */}
        <div className="relative flex items-center gap-3">
          
          {/* CENTRE DE NOTIFICATIONS STYLÉ */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-3 bg-slate-50 hover:bg-violet-50 text-slate-600 hover:text-violet-600 rounded-2xl border border-slate-100 transition-all"
              title="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-pulse shadow-md shadow-rose-200">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown Notifications */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-3 w-96 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-6 z-50 animate-in fade-in slide-in-from-top-2">
                
                <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2 shrink-0">
                    <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider">Notifications</h4>
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${isProf ? 'bg-violet-50 text-violet-600' : 'bg-indigo-50 text-indigo-600'}`}>
                      {unreadCount}
                    </span>
                  </div>
                  {unreadCount > 0 && (
                    <button 
                      onClick={handleMarkAllAsRead}
                      className="text-[11px] font-bold text-slate-400 hover:text-violet-600 flex items-center gap-1.5 transition-colors bg-slate-50 hover:bg-violet-50 px-3 py-1.5 rounded-xl border border-slate-100 shrink-0"
                    >
                      <CheckCheck size={14} /> Tout marquer comme lu
                    </button>
                  )}
                </div>

                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {notifications.length > 0 ? (
                    notifications.map((notif, idx) => (
                      <div
                        key={notif._id || idx}
                        onClick={() => handleNotifClick(notif)}
                        className={`p-3.5 rounded-2xl transition-all border flex items-start gap-3 cursor-pointer hover:scale-[1.01] ${
                          notif.read ? 'bg-slate-50/50 border-slate-100 opacity-75' : 'bg-slate-50 border-violet-100 hover:bg-violet-50/50 shadow-sm'
                        }`}
                      >
                        <div className="p-2 rounded-xl bg-white shadow-sm shrink-0 border border-slate-100">
                          {getNotifIcon(notif.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h5 className="font-black text-xs text-slate-800">{notif.title}</h5>
                            {!notif.read && <span className="w-2.5 h-2.5 rounded-full bg-violet-600 shrink-0"></span>}
                          </div>
                          <p className="text-[11px] font-medium text-slate-500 mt-0.5">{notif.description}</p>
                          <span className="text-[9px] font-bold text-slate-400 mt-1.5 block">
                            {notif.time || (notif.createdAt ? new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "À l'instant")}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2 animate-bounce" />
                      <p className="text-slate-400 text-xs font-bold italic">
                        Aucune notification pour le moment
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Bloc Profil */}
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

          {/* Bouton Menu Mobile */}
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