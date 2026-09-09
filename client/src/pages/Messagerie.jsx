// mon-projet-mern/client/src/pages/Messagerie.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Navbar retiré pour éviter la duplication avec le layout parent
import { Send, Inbox, Search, CheckCircle } from 'lucide-react';

const Messagerie = () => {
    const [user, setUser] = useState(null);
    const [tab, setTab] = useState('recus');
    
    const [messagesRecus, setMessagesRecus] = useState([]);
    const [messagesEnvoyes, setMessagesEnvoyes] = useState([]);
    const [profsList, setProfsList] = useState([]);
    const [elevesList, setElevesList] = useState([]);
    
    const [selectedDestinataire, setSelectedDestinataire] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [sujet, setSujet] = useState('');
    const [contenu, setContenu] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
            fetchData(storedUser._id || storedUser.id);
        }
    }, []);

    const fetchData = async (userId) => {
        try {
            const API_BASE = `http://${window.location.hostname}:5001/api`;
            const [resMsgs, resContacts] = await Promise.all([
                axios.get(`${API_BASE}/messages/${userId}`),
                axios.get(`${API_BASE}/messages/destinataires?userId=${userId}`)
            ]);
            
            setMessagesRecus(resMsgs.data.recus || []);
            setMessagesEnvoyes(resMsgs.data.envoyes || []);
            
            const rawContacts = resContacts.data.data || resContacts.data || [];
            
            const profs = [];
            const eleves = [];

            rawContacts
                .filter(c => (c._id || c.id) !== userId)
                .forEach(c => {
                    const isProfContact = c.type === 'PROF' || c.role === 'prof' || c.role === 'PROF' || c.role === 'professeur' || c.matiere;
                    const baseName = c.label || `${c.prenom || ''} ${c.nom || ''}`.trim();
                    
                    const cleanName = baseName
                        .replace(/^\[.*?\]\s*/, '')
                        .replace(/^Prof\.\s*/i, '')
                        .trim();

                    if (isProfContact) {
                        profs.push({
                            _id: c._id || c.id,
                            label: `Prof. ${cleanName}${c.matiere ? ` (${c.matiere})` : ''}`
                        });
                    } else {
                        eleves.push({
                            _id: c._id || c.id,
                            label: `${cleanName}${c.classe ? ` [${c.classe}]` : ''}`
                        });
                    }
                });

            setProfsList(profs);
            setElevesList(eleves);
        } catch (err) {
            console.error("Erreur de chargement de la messagerie", err);
        }
    };

    const filteredProfs = profsList.filter(p => 
        p.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const filteredEleves = elevesList.filter(e => 
        e.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalContacts = filteredProfs.length + filteredEleves.length;

    const handleSend = async (e) => {
        e.preventDefault();
        if (!selectedDestinataire || !contenu) return;

        try {
            const API_BASE = `http://${window.location.hostname}:5001/api`;
            await axios.post(`${API_BASE}/messages/send`, {
                expediteur: user._id || user.id,
                destinataire: selectedDestinataire,
                sujet,
                contenu
            });

            setSuccessMsg('Message envoyé avec succès !');
            setErrorMsg('');
            setSujet('');
            setContenu('');
            setSearchQuery('');
            setSelectedDestinataire('');
            
            fetchData(user._id || user.id);
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            console.error("Erreur lors de l'envoi :", err);
            setErrorMsg("Échec de l'envoi du message.");
        }
    };

    if (!user) return null;

    const userRole = user.role ? String(user.role).toLowerCase() : '';
    const isProf = userRole === 'prof' || userRole === 'professeur' || userRole === 'enseignant';

    const getPersonName = (person) => {
        if (!person) return 'Utilisateur inconnu';
        if (typeof person === 'string') return person;
        if (person.label) return person.label;
        if (person.prenom || person.nom) {
            const roleTag = (person.role === 'prof' || person.role === 'professeur' || person.matiere) ? 'Prof. ' : '';
            return `${roleTag}${person.prenom || ''} ${person.nom || ''}`.trim();
        }
        return 'Inconnu';
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
            {/* Supprimé : <Navbar user={user} /> */}

            <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* --- COLONNE GAUCHE : NOUVEAU MESSAGE --- */}
                <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div>
                        <h2 className="text-xl font-black italic uppercase text-slate-900 mb-6 flex items-center gap-2">
                            <Send size={22} className="text-violet-600" /> Nouveau Message
                        </h2>

                        {successMsg && (
                            <div className="mb-4 p-3 bg-emerald-50 text-emerald-600 rounded-2xl text-xs font-bold flex items-center gap-2">
                                <CheckCircle size={16} /> {successMsg}
                            </div>
                        )}

                        {errorMsg && (
                            <div className="mb-4 p-3 bg-rose-50 text-rose-600 rounded-2xl text-xs font-bold">
                                {errorMsg}
                            </div>
                        )}

                        <form onSubmit={handleSend} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">
                                    Destinataire
                                </label>
                                <div className="relative mb-2">
                                    <Search size={16} className="absolute left-3 top-3 text-slate-400" />
                                    <input 
                                        type="text" 
                                        placeholder={isProf ? "Filtrer un collègue ou un élève..." : "Filtrer un prof ou un élève..."}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-violet-500"
                                    />
                                </div>

                                <select 
                                    value={selectedDestinataire}
                                    onChange={(e) => setSelectedDestinataire(e.target.value)}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-violet-500"
                                    required
                                >
                                    <option value="">-- Sélectionner dans la liste ({totalContacts}) --</option>
                                    
                                    {filteredProfs.length > 0 && (
                                        <optgroup label="--- PROFESSEURS / ENSEIGNANTS ---">
                                            {filteredProfs.map(p => (
                                                <option key={p._id} value={p._id}>
                                                    [PROF] {p.label}
                                                </option>
                                            ))}
                                        </optgroup>
                                    )}

                                    {filteredEleves.length > 0 && (
                                        <optgroup label="--- ÉLÈVES / ÉTUDIANTS ---">
                                            {filteredEleves.map(e => (
                                                <option key={e._id} value={e._id}>
                                                    [ÉLÈVE] {e.label}
                                                </option>
                                            ))}
                                        </optgroup>
                                    )}
                                </select>
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Sujet</label>
                                <input 
                                    type="text" 
                                    placeholder="Sujet de votre message..."
                                    value={sujet}
                                    onChange={(e) => setSujet(e.target.value)}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-violet-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Message</label>
                                <textarea 
                                    rows="5"
                                    placeholder="Rédigez votre message ici..."
                                    value={contenu}
                                    onChange={(e) => setContenu(e.target.value)}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-violet-500 resize-none"
                                    required
                                ></textarea>
                            </div>

                            <button 
                                type="submit" 
                                className="w-full py-3.5 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-violet-200 flex items-center justify-center gap-2"
                            >
                                <Send size={16} /> Envoyer
                            </button>
                        </form>
                    </div>
                </div>

                {/* --- COLONNE DROITE : BOÎTE DE RÉCEPTION / ENVOYÉS --- */}
                <div className="lg:col-span-2 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
                    
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setTab('recus')}
                                className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-2 ${tab === 'recus' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                            >
                                <Inbox size={16} /> Reçus ({messagesRecus.length})
                            </button>
                            <button 
                                onClick={() => setTab('envoyes')}
                                className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-2 ${tab === 'envoyes' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                            >
                                <Send size={16} /> Envoyés ({messagesEnvoyes.length})
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3 overflow-y-auto max-h-[550px] pr-2">
                        {(tab === 'recus' ? messagesRecus : messagesEnvoyes).length === 0 ? (
                            <div className="text-center py-16 text-slate-400 font-bold text-xs uppercase italic">
                                Aucun message dans ce dossier
                            </div>
                        ) : (
                            (tab === 'recus' ? messagesRecus : messagesEnvoyes).map((m) => (
                                <div key={m._id} className="p-4 bg-slate-50 hover:bg-violet-50/50 rounded-2xl border border-slate-100 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <span className="text-[10px] font-black uppercase tracking-wider text-violet-600 block">
                                                {tab === 'recus' 
                                                    ? `De : ${getPersonName(m.expediteur)}` 
                                                    : `À : ${getPersonName(m.destinataire)}`
                                                }
                                            </span>
                                            <h4 className="font-black text-sm text-slate-900">{m.sujet || 'Sans sujet'}</h4>
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400">
                                            {new Date(m.createdAt || m.date).toLocaleDateString('fr-FR', { 
                                                day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' 
                                            })}
                                        </span>
                                    </div>
                                    <p className="text-xs font-medium text-slate-600 leading-relaxed whitespace-pre-line">
                                        {m.contenu}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>

                </div>

            </main>
        </div>
    );
};

export default Messagerie;