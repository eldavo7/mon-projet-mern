// client/src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api'; 
// Import des icônes Lucide
import { Eye, EyeOff, Lock, Mail, GraduationCap } from 'lucide-react';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Redirection automatique si déjà connecté
    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        if (token && role) {
            const target = role === 'admin' ? '/DashboardProf' : '/DashboardEtudiant';
            navigate(target);
        }
    }, [navigate]);

    // LA FONCTION QUI MANQUAIT :
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const result = await login(email, password);

        if (result.success) {
            const userRole = result.data.user.role;
            const token = result.data.token;

            localStorage.setItem('token', token);
            localStorage.setItem('role', userRole);

            onLogin(userRole);

            if (userRole === 'admin') {
                navigate('/DashboardProf');
            } else {
                navigate('/DashboardEtudiant');
            }
        } else {
            setError(result.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 font-sans text-slate-900">
            <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
                <div className="p-10">
                    <div className="text-center mb-10">
                        <div className="bg-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
                            <GraduationCap size={32} color="white" />
                        </div>
                        <h2 className="text-3xl font-black tracking-tight">Content de vous revoir</h2>
                        <p className="text-slate-400 mt-2 font-medium">Connectez-vous à votre espace</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm font-bold rounded-2xl border border-red-100 flex items-center gap-2">
                             <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse shrink-0"></div>
                             {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div className="relative">
                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1 mb-2 block tracking-widest">Email Professionnel</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                                <input 
                                    type="email" 
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all font-medium"
                                    placeholder="nom@ecole.com"
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        
                        {/* Mot de passe */}
                        <div className="relative">
                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1 mb-2 block tracking-widest">Mot de passe</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all font-medium"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors p-1"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button 
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-4 rounded-2xl font-black text-white shadow-xl shadow-indigo-100 transition-all active:scale-[0.98] mt-4 tracking-wide ${
                                isLoading ? 'bg-slate-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                            }`}
                        >
                            {isLoading ? 'VÉRIFICATION...' : 'SE CONNECTER'}
                        </button>
                    </form>
                </div>
                
                <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
                    <button onClick={() => navigate('/conditions')} className="text-[10px] font-black text-slate-400 hover:text-indigo-600 transition uppercase tracking-[0.2em]">
                        Conditions & Confidentialité
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;