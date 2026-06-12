/*
// client/src/pages/GestionEleves.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { 
    Users, ChevronRight, ChevronLeft, Mail, 
    ArrowUpDown, ArrowUp, ArrowDown, Star 
} from 'lucide-react';
import { formatFullName } from '../utils/formatters';

const GestionEleves = () => {
    const navigate = useNavigate();
    const { prof } = useOutletContext();
    
    const [allStudents, setAllStudents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentMyPage, setCurrentMyPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: 'nom', direction: 'asc' });
    const itemsPerPage = 10;

    useEffect(() => {
        // Retour à l'URL initiale qui fonctionnait pour les 1800 élèves
        fetch('http://localhost:5001/api/students')
            .then(res => res.json())
            .then(data => {
                setAllStudents(data);
            })
            .catch(err => console.error("Erreur fetch students:", err));
    }, []);

    const sortedData = (data) => {
        let sortable = [...data];
        if (sortConfig.key !== null) {
            sortable.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return sortable;
    };

    // --- FILTRAGE ULTRA-ROBUSTE ---
    const myStudentsRaw = useMemo(() => {
        if (!allStudents.length || !prof?.classes) return [];

        // On crée une liste de "classes propres" sans espaces et en MAJUSCULES
        // Exemple: "1ère ES 3" devient "1ÈREEES3"
        const cleanProfClasses = prof.classes.map(c => 
            String(c).replace(/\s+/g, '').toUpperCase()
        );

        return allStudents.filter(student => {
            if (!student.classe) return false;
            
            // On nettoie aussi la classe de l'élève
            const cleanStudentClass = String(student.classe).replace(/\s+/g, '').toUpperCase();
            
            // On vérifie si la classe de l'élève est dans la liste du prof
            return cleanProfClasses.includes(cleanStudentClass);
        });
    }, [allStudents, prof]);

    const mySortedStudents = sortedData(myStudentsRaw);
    const myTotalPages = Math.ceil(mySortedStudents.length / itemsPerPage) || 1;
    const currentMyStudents = mySortedStudents.slice((currentMyPage - 1) * itemsPerPage, currentMyPage * itemsPerPage);

    const allSortedStudents = sortedData(allStudents);
    const allTotalPages = Math.ceil(allSortedStudents.length / itemsPerPage) || 1;
    const currentAllStudents = allSortedStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
        setSortConfig({ key, direction });
    };

    const getSortIcon = (name) => {
        if (sortConfig.key !== name) return <ArrowUpDown size={14} className="opacity-20" />;
        return sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 w-full space-y-16 pb-20">
            

                       // SECTION 1 : MES ÉLÈVES (VOS GROUPES) 
            <section>
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-violet-600 rounded-2xl text-white shadow-lg shadow-violet-200">
                        <Star size={22} fill="currentColor" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black italic tracking-tighter text-slate-800">
                            Mes Groupes <span className="text-slate-300 font-medium ml-1">/ {prof?.classes?.join(', ')}</span>
                        </h2>
                        <p className="text-[10px] font-bold text-violet-500 uppercase tracking-widest">
                            {myStudentsRaw.length} élèves correspondants
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border-2 border-violet-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-violet-50 text-violet-600 text-[10px] font-black uppercase tracking-widest">
                                <tr>
                                    <th onClick={() => requestSort('nom')} className="py-5 px-8 cursor-pointer">NOM {getSortIcon('nom')}</th>
                                    <th className="py-5 px-4">AGE</th>
                                    <th onClick={() => requestSort('classe')} className="py-5 px-4 cursor-pointer">CLASSE {getSortIcon('classe')}</th>
                                    <th className="py-5 px-8">EMAIL</th>
                                    <th className="py-5 px-8 text-right">FICHE</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {currentMyStudents.length > 0 ? (
                                    currentMyStudents.map((s) => (
                                        <tr key={s._id} onClick={() => navigate(`/etudiant/${s._id}`)} className="hover:bg-violet-50/50 cursor-pointer transition-all group">
                                            <td className="py-4 px-8 font-bold italic text-slate-700">{formatFullName(s.prenom, s.nom)}</td>
                                            <td className="py-4 px-4 text-slate-500">{s.age || '--'} ans</td>
                                            <td className="py-4 px-4">
                                                <span className="bg-violet-100 text-violet-700 px-3 py-1 rounded-lg text-[10px] font-black">{s.classe}</span>
                                            </td>
                                            <td className="py-4 px-8 text-slate-400 text-sm italic">{s.email || 'n/a'}</td>
                                            <td className="py-4 px-8 text-right">
                                                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-violet-100 group-hover:bg-violet-600 group-hover:text-white transition-all">
                                                    <ChevronRight size={16} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="py-12 text-center text-slate-400 italic">
                                            Recherche de vos élèves dans la base...
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    // PAGINATION MES ÉLÈVES 
                    <div className="bg-violet-50/30 p-4 flex items-center justify-between border-t border-violet-100">
                        <p className="text-[10px] font-black text-violet-400 uppercase ml-4">Page {currentMyPage} sur {myTotalPages}</p>
                        <div className="flex gap-2">
                            <button onClick={() => setCurrentMyPage(p => Math.max(1, p - 1))} disabled={currentMyPage === 1} className="p-2 bg-white border border-violet-200 rounded-xl disabled:opacity-30"><ChevronLeft size={16}/></button>
                            <button onClick={() => setCurrentMyPage(p => Math.min(myTotalPages, p + 1))} disabled={currentMyPage === myTotalPages} className="p-2 bg-white border border-violet-200 rounded-xl disabled:opacity-30"><ChevronRight size={16}/></button>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="border-slate-100" />

            // SECTION 2 : TOUTE LA BASE 
            <section>
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 bg-slate-900 rounded-[1.5rem] text-white shadow-xl shadow-slate-200">
                        <Users size={24} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black italic tracking-tighter text-slate-800">Effectif Global</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{allStudents.length} élèves au total</p>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em]">
                                <tr>
                                    <th onClick={() => requestSort('nom')} className="py-6 px-8 cursor-pointer">NOM {getSortIcon('nom')}</th>
                                    <th className="py-6 px-4">AGE</th>
                                    <th onClick={() => requestSort('classe')} className="py-6 px-4 cursor-pointer">CLASSE {getSortIcon('classe')}</th>
                                    <th className="py-6 px-8">EMAIL</th>
                                    <th className="py-6 px-8 text-right">ACTION</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {currentAllStudents.map((s) => (
                                    <tr key={s._id} onClick={() => navigate(`/etudiant/${s._id}`)} className="hover:bg-slate-50 cursor-pointer group">
                                        <td className="py-5 px-8 font-bold italic text-slate-700">{formatFullName(s.prenom, s.nom)}</td>
                                        <td className="py-5 px-4 text-slate-500">{s.age || '--'} ans</td>
                                        <td className="py-5 px-4">
                                            <span className="bg-slate-100 px-3 py-1 rounded-lg text-[10px] font-black text-slate-500 uppercase">{s.classe}</span>
                                        </td>
                                        <td className="py-5 px-8 text-slate-400 text-sm italic">{s.email || 'n/a'}</td>
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
                    <div className="bg-slate-50 p-6 flex items-center justify-between border-t border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase ml-4">Page {currentPage} sur {allTotalPages}</p>
                        <div className="flex gap-2">
                            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-3 bg-white border border-slate-200 rounded-xl disabled:opacity-30"><ChevronLeft size={18}/></button>
                            <button onClick={() => setCurrentPage(p => Math.min(allTotalPages, p + 1))} disabled={currentPage === allTotalPages} className="p-3 bg-white border border-slate-200 rounded-xl disabled:opacity-30"><ChevronRight size={18}/></button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default GestionEleves;
*/


// client/src/pages/GestionEleves.jsx


import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { 
    Users, ChevronRight, ChevronLeft, 
    ArrowUpDown, ArrowUp, ArrowDown, Star 
} from 'lucide-react';
import { formatFullName } from '../utils/formatters';

const GestionEleves = () => {
    const navigate = useNavigate();
    const { prof } = useOutletContext();
    
    const [allStudents, setAllStudents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentMyPage, setCurrentMyPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: 'nom', direction: 'asc' });
    const itemsPerPage = 10;

    // Récupération de l'effectif global (1800 élèves)
    useEffect(() => {
        fetch('http://localhost:5001/api/students')
            .then(res => res.json())
            .then(data => {
                setAllStudents(data);
            })
            .catch(err => console.error("Erreur fetch students:", err));
    }, []);

    // Gestion du tri des colonnes
    const sortedData = (data) => {
        let sortable = [...data];
        if (sortConfig.key !== null) {
            sortable.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return sortable;
    };

    // --- FONCTION DE NETTOYAGE (ACCENTS + ESPACES + CASSE) ---
    const AlignerTexte = (str) => {
        if (!str) return '';
        return String(str)
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
            .replace(/\s+/g, '')             // Supprime tous les espaces
            .toUpperCase();                  // Tout en majuscules
    };

    // --- FILTRAGE CHIRURGICAL PAR NIVEAU, FILIÈRE ET NUMÉRO DE GROUPE ---
    const myStudentsRaw = useMemo(() => {
        if (!allStudents.length || !prof?.classes) return [];

        const cleanProfClasses = prof.classes.map(c => AlignerTexte(c));

        return allStudents.filter(student => {
            const studentClassRaw = student.classe || student.classes;
            if (!studentClassRaw) return false;

            const verifierMatchChirurgical = (classeEleve) => {
                const cleanStudentClass = AlignerTexte(classeEleve);
                
                return cleanProfClasses.some(cleanProfClass => {
                    // 1. Match parfait direct
                    if (cleanStudentClass === cleanProfClass) return true;

                    // 2. Extraction du numéro de groupe à la fin (ex: "2NDE8" -> 8, "1ERESTG2" -> 2)
                    const numeroProf = cleanProfClass.match(/\d+$/)?.[0];
                    const numeroEleve = cleanStudentClass.match(/\d+$/)?.[0];

                    // 3. Extraction du niveau principal
                    const estSecondeProf = cleanProfClass.startsWith('2NDE');
                    const estSecondeEleve = cleanStudentClass.startsWith('2NDE');

                    const estPremiereProf = cleanProfClass.startsWith('1ERE');
                    const estPremiereEleve = cleanStudentClass.startsWith('1ERE');

                    const estTerminaleProf = cleanProfClass.startsWith('TERM') || cleanProfClass.startsWith('TLE');
                    const estTerminaleEleve = cleanStudentClass.startsWith('TERM') || cleanStudentClass.startsWith('TLE');

                    // --- LOGIQUE SECONDE ---
                    if (estSecondeProf && estSecondeEleve) {
                        return numeroProf === numeroEleve;
                    }

                    // --- LOGIQUE PREMIÈRE ---
                    if (estPremiereProf && estPremiereEleve) {
                        // On isole la filière (ex: "1ERESTG2" sans "1ERE" et sans "2" -> "STG")
                        const filiereProf = cleanProfClass.replace('1ERE', '').replace(/\d+$/, '');
                        const filiereEleve = cleanStudentClass.replace('1ERE', '').replace(/\d+$/, '');

                        // Match si c'est le même numéro de groupe ET que les filières se correspondent
                        const matchFiliere = filiereEleve.includes(filiereProf) || filiereProf.includes(filiereEleve) || filiereProf === '';
                        return numeroProf === numeroEleve && matchFiliere;
                    }

                    // --- LOGIQUE TERMINALE ---
                    if (estTerminaleProf && estTerminaleEleve) {
                        // On isole la filière (ex: "TERMS2" -> "S")
                        const filiereProf = cleanProfClass.replace(/TERM|TLE/, '').replace(/\d+$/, '');
                        const filiereEleve = cleanStudentClass.replace(/TERM|TLE/, '').replace(/\d+$/, '');

                        const matchFiliere = filiereEleve.includes(filiereProf) || filiereProf.includes(filiereEleve) || filiereProf === '';
                        return numeroProf === numeroEleve && matchFiliere;
                    }

                    return false;
                });
            };

            if (Array.isArray(studentClassRaw)) {
                return studentClassRaw.some(c => verifierMatchChirurgical(c));
            }
            return verifierMatchChirurgical(studentClassRaw);
        });
    }, [allStudents, prof]);

    // Pagination et tri pour "Mes Groupes"
    const mySortedStudents = sortedData(myStudentsRaw);
    const myTotalPages = Math.ceil(mySortedStudents.length / itemsPerPage) || 1;

    // Sécurité au cas où la page courante dépasse le nombre total de pages recalculé
    const safeCurrentMyPage = currentMyPage > myTotalPages ? 1 : currentMyPage;
    const currentMyStudents = mySortedStudents.slice((safeCurrentMyPage - 1) * itemsPerPage, safeCurrentMyPage * itemsPerPage);

    // Pagination et tri pour "Effectif Global"
    const allSortedStudents = sortedData(allStudents);
    const allTotalPages = Math.ceil(allSortedStudents.length / itemsPerPage) || 1;
    const currentAllStudents = allSortedStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
        setSortConfig({ key, direction });
    };

    const getSortIcon = (name) => {
        if (sortConfig.key !== name) return <ArrowUpDown size={14} className="opacity-20" />;
        return sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 w-full space-y-16 pb-20">
            
            {/* SECTION 1 : MES ÉLÈVES (LES GROUPES DU PROF CONNECTÉ) */}
            <section>
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-violet-600 rounded-2xl text-white shadow-lg shadow-violet-200">
                        <Star size={22} fill="currentColor" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black italic tracking-tighter text-slate-800">
                            Mes Groupes <span className="text-slate-300 font-medium ml-1">/ {prof?.classes?.join(', ')}</span>
                        </h2>
                        <p className="text-[10px] font-bold text-violet-500 uppercase tracking-widest">
                            {myStudentsRaw.length} élèves correspondants
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border-2 border-violet-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-violet-50 text-violet-600 text-[10px] font-black uppercase tracking-widest">
                                <tr>
                                    <th onClick={() => requestSort('nom')} className="py-5 px-8 cursor-pointer">NOM {getSortIcon('nom')}</th>
                                    <th className="py-5 px-4">AGE</th>
                                    <th onClick={() => requestSort('classe')} className="py-5 px-4 cursor-pointer">CLASSE {getSortIcon('classe')}</th>
                                    <th className="py-5 px-8">EMAIL</th>
                                    <th className="py-5 px-8 text-right">FICHE</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {currentMyStudents.length > 0 ? (
                                    currentMyStudents.map((s) => (
                                        <tr key={s._id} onClick={() => navigate(`/etudiant/${s._id}`)} className="hover:bg-violet-50/50 cursor-pointer transition-all group">
                                            <td className="py-4 px-8 font-bold italic text-slate-700">{formatFullName(s.prenom, s.nom)}</td>
                                            <td className="py-4 px-4 text-slate-500">{s.age || '--'} ans</td>
                                            <td className="py-4 px-4">
                                                <span className="bg-violet-100 text-violet-700 px-3 py-1 rounded-lg text-[10px] font-black">{s.classe || s.classes?.join(', ')}</span>
                                            </td>
                                            <td className="py-4 px-8 text-slate-400 text-sm italic">{s.email || 'n/a'}</td>
                                            <td className="py-4 px-8 text-right">
                                                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-violet-100 group-hover:bg-violet-600 group-hover:text-white transition-all">
                                                    <ChevronRight size={16} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="py-12 text-center text-slate-400 italic">
                                            Aucun élève trouvé dans la base pour vos classes spécifiques.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* PAGINATION MES ÉLÈVES */}
                    <div className="bg-violet-50/30 p-4 flex items-center justify-between border-t border-violet-100">
                        <p className="text-[10px] font-black text-violet-400 uppercase ml-4">Page {safeCurrentMyPage} sur {myTotalPages}</p>
                        <div className="flex gap-2">
                            <button onClick={() => setCurrentMyPage(p => Math.max(1, p - 1))} disabled={safeCurrentMyPage === 1} className="p-2 bg-white border border-violet-200 rounded-xl disabled:opacity-30"><ChevronLeft size={16}/></button>
                            <button onClick={() => setCurrentMyPage(p => Math.min(myTotalPages, p + 1))} disabled={safeCurrentMyPage === myTotalPages} className="p-2 bg-white border border-violet-200 rounded-xl disabled:opacity-30"><ChevronRight size={16}/></button>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="border-slate-100" />

            {/* SECTION 2 : EFFECTIF GLOBAL (TOUTE LA BASE) */}
            <section>
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 bg-slate-900 rounded-[1.5rem] text-white shadow-xl shadow-slate-200">
                        <Users size={24} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black italic tracking-tighter text-slate-800">Effectif Global</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{allStudents.length} élèves au total</p>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em]">
                                <tr>
                                    <th onClick={() => requestSort('nom')} className="py-6 px-8 cursor-pointer">NOM {getSortIcon('nom')}</th>
                                    <th className="py-6 px-4">AGE</th>
                                    <th onClick={() => requestSort('classe')} className="py-6 px-4 cursor-pointer">CLASSE {getSortIcon('classe')}</th>
                                    <th className="py-6 px-8">EMAIL</th>
                                    <th className="py-6 px-8 text-right">ACTION</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {currentAllStudents.map((s) => (
                                    <tr key={s._id} onClick={() => navigate(`/etudiant/${s._id}`)} className="hover:bg-slate-50 cursor-pointer group">
                                        <td className="py-5 px-8 font-bold italic text-slate-700">{formatFullName(s.prenom, s.nom)}</td>
                                        <td className="py-5 px-4 text-slate-500">{s.age || '--'} ans</td>
                                        <td className="py-5 px-4">
                                            <span className="bg-slate-100 px-3 py-1 rounded-lg text-[10px] font-black text-slate-500 uppercase">{s.classe || s.classes?.join(', ')}</span>
                                        </td>
                                        <td className="py-5 px-8 text-slate-400 text-sm italic">{s.email || 'n/a'}</td>
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
                    
                    {/* PAGINATION EFFECTIF GLOBAL */}
                    <div className="bg-slate-50 p-6 flex items-center justify-between border-t border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase ml-4">Page {currentPage} sur {allTotalPages}</p>
                        <div className="flex gap-2">
                            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-3 bg-white border border-slate-200 rounded-xl disabled:opacity-30"><ChevronLeft size={18}/></button>
                            <button onClick={() => setCurrentPage(p => Math.min(allTotalPages, p + 1))} disabled={currentPage === allTotalPages} className="p-3 bg-white border border-slate-200 rounded-xl disabled:opacity-30"><ChevronRight size={18}/></button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default GestionEleves;