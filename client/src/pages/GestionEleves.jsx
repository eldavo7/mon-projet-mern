// client/src/pages/GestionEleves.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, Users, GraduationCap, ChevronRight, 
    ChevronLeft, Mail, ArrowUpDown, ArrowUp, ArrowDown 
} from 'lucide-react';
import { formatFullName } from '../utils/formatters';
import SearchBar from '../components/SearchBar'; 

const GestionEleves = () => {
    const navigate = useNavigate();
    const [allStudents, setAllStudents] = useState([]);
    const [myStudents, setMyStudents] = useState([]);
    const [prof, setProf] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: 'nom', direction: 'asc' });
    const itemsPerPage = 10;

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const profData = JSON.parse(storedUser);
            setProf(profData);
            
            fetch('http://localhost:5001/api/students')
                .then(res => res.json())
                .then(data => setAllStudents(data))
                .catch(err => console.error("Erreur fetch:", err));

            fetch(`http://localhost:5001/api/students?classe=${profData.classe_responsable || '2de1'}`)
                .then(res => res.json())
                .then(data => setMyStudents(data))
                .catch(err => console.error("Erreur mes élèves:", err));
        }
    }, []);

    const sortedStudents = React.useMemo(() => {
        let sortableStudents = [...allStudents];
        if (sortConfig.key !== null) {
            sortableStudents.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return sortableStudents;
    }, [allStudents, sortConfig]);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
        setSortConfig({ key, direction });
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentStudents = sortedStudents.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sortedStudents.length / itemsPerPage);

    const getSortIcon = (name) => {
        if (sortConfig.key !== name) return <ArrowUpDown size={14} className="opacity-20" />;
        return sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-12 lg:p-20">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-violet-600 font-black mb-10 hover:translate-x-[-5px] transition-all uppercase italic text-xs tracking-widest">
                <ArrowLeft size={18} /> Retour Dashboard
            </button>

            <div className="max-w-7xl mx-auto space-y-16">
                <section>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 ml-2">Recherche rapide</p>
                    <SearchBar />
                </section>

                <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-slate-800 rounded-[1.5rem] text-white shadow-xl shadow-slate-200">
                                <GraduationCap size={24} />
                            </div>
                            <h2 className="text-3xl font-black italic tracking-tighter text-slate-800">
                                Base de données <span className="text-slate-300 text-xl font-medium ml-2">/ Élèves</span>
                            </h2>
                        </div>
                    </div>

                    <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                        {/* WRAPPER POUR LE SCROLL HORIZONTAL */}
                        <div className="w-full overflow-x-auto">
                            <table className="w-full text-left min-w-[800px]">
                                <thead className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em]">
                                    <tr>
                                        <th onClick={() => requestSort('nom')} className="py-6 px-8 italic cursor-pointer hover:bg-slate-800 transition-colors whitespace-nowrap">
                                            <div className="flex items-center gap-2">Nom & Prénom {getSortIcon('nom')}</div>
                                        </th>
                                        <th onClick={() => requestSort('age')} className="py-6 px-4 cursor-pointer hover:bg-slate-800 transition-colors whitespace-nowrap">
                                            <div className="flex items-center gap-2">Âge {getSortIcon('age')}</div>
                                        </th>
                                        <th onClick={() => requestSort('classe')} className="py-6 px-4 cursor-pointer hover:bg-slate-800 transition-colors whitespace-nowrap">
                                            <div className="flex items-center gap-2">Classe {getSortIcon('classe')}</div>
                                        </th>
                                        <th className="py-6 px-8 whitespace-nowrap">Email</th>
                                        <th className="py-6 px-8 text-right whitespace-nowrap">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {currentStudents.map((s) => (
                                        <tr key={s._id} onClick={() => navigate(`/etudiant/${s._id}`)} className="hover:bg-violet-50/50 cursor-pointer transition-all group">
                                            <td className="py-5 px-8 font-bold italic text-slate-700 whitespace-nowrap">{formatFullName(s.prenom, s.nom)}</td>
                                            <td className="py-5 px-4 text-slate-500 font-medium whitespace-nowrap">{s.age || '--'} ans</td>
                                            <td className="py-5 px-4 whitespace-nowrap">
                                                <span className="bg-slate-100 px-3 py-1 rounded-lg text-[10px] font-black text-slate-500 uppercase">{s.classe}</span>
                                            </td>
                                            <td className="py-5 px-8 text-slate-400 text-sm flex items-center gap-2 whitespace-nowrap">
                                                <Mail size={14} className="text-slate-300" /> {s.email || 'n/a'}
                                            </td>
                                            <td className="py-5 px-8 text-right">
                                                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 group-hover:bg-violet-600 group-hover:text-white transition-all">
                                                    <ChevronRight size={16} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="bg-slate-50 p-6 flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 gap-4">
                            <p className="text-xs font-bold italic text-slate-400">
                                Affichage {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, allStudents.length)} sur {allStudents.length}
                            </p>
                            
                            <div className="flex gap-2">
                                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-3 bg-white border border-slate-200 rounded-xl disabled:opacity-30 hover:border-violet-400 transition-all">
                                    <ChevronLeft size={18} />
                                </button>
                                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-3 bg-white border border-slate-200 rounded-xl disabled:opacity-30 hover:border-violet-400 transition-all">
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default GestionEleves;