import React, { useState, useEffect } from 'react';
import { Search, User, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchResults = async () => {
            if (query.length < 2) {
                setResults([]);
                return;
            }

            try {
                // IMPORTANT : Utilise le port 5001 pour correspondre à ton serveur
                const response = await fetch(`http://localhost:5001/api/students/search?q=${query}`);
                const data = await response.json();
                setResults(data);
            } catch (error) {
                console.error("Erreur recherche:", error);
            }
        };

        const timer = setTimeout(fetchResults, 300); // Debounce pour éviter trop d'appels
        return () => clearTimeout(timer);
    }, [query]);

    return (
        <div className="relative w-full max-w-2xl mb-12">
            <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-600 transition-colors" size={20} />
                <input
                    type="text"
                    placeholder="Rechercher un élève (Nom, Prénom...)"
                    className="w-full bg-white border border-slate-100 py-6 pl-16 pr-8 rounded-[2rem] shadow-xl shadow-slate-200/50 focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-200 transition-all font-medium text-slate-700 italic"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                />
            </div>

            {/* LISTE DES RÉSULTATS (DROPDOWN) */}
            {isOpen && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-4 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="p-4 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 px-8">
                        Résultats trouvés ({results.length})
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                        {results.map((student) => (
                            <div
                                key={student._id}
                                onClick={() => {
                                    navigate(`/etudiant/${student._id}`);
                                    setIsOpen(false);
                                    setQuery('');
                                }}
                                className="flex items-center justify-between p-6 hover:bg-violet-50 cursor-pointer transition-all border-b border-slate-50 last:border-0 group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-violet-600 group-hover:text-white transition-all">
                                        <User size={18} />
                                    </div>
                                    <div>
                                        <p className="font-black italic text-slate-700 uppercase leading-none">
                                            {student.nom} <span className="text-violet-600">{student.prenom}</span>
                                        </p>
                                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Classe : {student.classe || 'N/A'}</p>
                                    </div>
                                </div>
                                <ChevronRight size={18} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchBar;