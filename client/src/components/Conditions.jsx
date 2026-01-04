// mon-projet-mern/client/src/components/Conditions.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ShieldCheck, FileText, Info, Lock, Scale } from 'lucide-react';

function Conditions() {
  const navigate = useNavigate();

  const articles = [
    { id: 1, title: "Objet des CGU", icon: <FileText size={18} />, content: "Les présentes conditions encadrent l'utilisation des services numériques de l'école." },
    { id: 2, title: "Accès au service", icon: <ShieldCheck size={18} />, content: "L'accès est strictement réservé au personnel administratif, enseignants et élèves munis d'un compte valide." },
    { id: 3, title: "Propriété intellectuelle", icon: <Scale size={18} />, content: "Tous les contenus pédagogiques partagés restent la propriété de leurs auteurs respectifs." },
    { id: 4, title: "Données personnelles", icon: <Lock size={18} />, content: "Conformément au RGPD, vos données sont utilisées uniquement à des fins éducatives et administratives." },
    { id: 5, title: "Support technique", icon: <Info size={18} />, content: "En cas de perte de mot de passe, contactez l'administrateur ou votre professeur principal." },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="max-w-3xl w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
        
        {/* Header Styleé */}
        <div className="bg-indigo-600 p-10 text-white relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
                <Scale size={120} />
            </div>
            <h2 className="text-4xl font-black tracking-tight mb-2">Mentions Légales</h2>
            <p className="text-indigo-100 font-medium">Conditions Générales d'Utilisation de la plateforme</p>
        </div>

        <div className="p-8 md:p-10">
            {/* Zone de texte avec scroll stylé */}
            <div className="space-y-6 overflow-y-auto max-h-[50vh] pr-4 custom-scrollbar scrollbar-thin scrollbar-thumb-indigo-200">
                <p className="text-slate-500 font-medium italic leading-relaxed">
                    Bienvenue sur notre application. En utilisant nos services, vous acceptez sans réserve les présentes conditions générales d'utilisation visant à garantir un environnement numérique sécurisé.
                </p>

                <div className="grid gap-6">
                    {articles.map((art) => (
                        <div key={art.id} className="group p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all hover:bg-white hover:shadow-md">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="p-2 bg-indigo-100 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    {art.icon}
                                </span>
                                <h3 className="font-bold text-slate-800 uppercase text-xs tracking-wider">
                                    Article {art.id} : {art.title}
                                </h3>
                            </div>
                            <p className="text-slate-600 text-sm leading-relaxed ml-11">
                                {art.content}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer de la carte */}
            <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">
                    Dernière mise à jour : 12 juin 2025
                </p>
                
                <button 
                    onClick={() => navigate('/')} 
                    className="flex items-center gap-2 px-8 py-4 bg-slate-900 hover:bg-black text-white font-black rounded-2xl transition-all active:scale-95 shadow-lg shadow-slate-200 group text-sm uppercase tracking-widest"
                >
                    <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Retour au Login
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Conditions;