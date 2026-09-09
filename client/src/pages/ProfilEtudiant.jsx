// client/src/pages/ProfilEtudiant.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  GraduationCap, 
  Calendar, 
  BookOpen, 
  MessageSquare, 
  Edit3, 
  Check, 
  Plus,
  Layers,
  FileText,
  Download,
  AlertTriangle,
  Clock,
  Send,
  X,
  CheckCircle2,
  XCircle,
  Filter
} from 'lucide-react';

import Navbar from '../components/Navbar';
import { formatFullName } from '../utils/formatters';

const LISTE_MATIERES = [
  'Anglais', 'Mathématiques', 'Français', 'Histoire-Géographie',
  'Physique-Chimie', 'SVT', 'Espagnol', 'Allemand', 'Philosophie', 'EPS', 'SES', 'Informatique / NSI'
];

const ProfilEtudiant = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [student, setStudent] = useState(null);
  
  const [activeTab, setActiveTab] = useState('releve');
  
  const [selectedTrimestreBulletin, setSelectedTrimestreBulletin] = useState('T1');
  const [selectedTrimestreMatiere, setSelectedTrimestreMatiere] = useState('T1');
  const [selectedMatiere, setSelectedMatiere] = useState('Toutes');
  
  // Filtre Trimestre pour la vue Assiduité
  const [selectedTrimestreAssiduite, setSelectedTrimestreAssiduite] = useState('Tous');

  // Filtre précis issu des cartes cliquables du bilan (ex: { trimestre: 'T1', type: 'Absence' } ou null)
  const [filterBilanDetail, setFilterBilanDetail] = useState(null);

  const [isEditing, setIsEditing] = useState(false);

  // <-- AJOUTE LES 2 LIGNES ICI :
  const [editingNoteIndex, setEditingNoteIndex] = useState(null);
  const [editNoteForm, setEditNoteForm] = useState({ matiere: '', note: '', coef: 1, appreciation: '', trimestre: 'T1' });


  // Modale & état pour la soumission de justificatif (Élève/Parent)
  const [selectedAbsenceForJustify, setSelectedAbsenceForJustify] = useState(null);
  const [justificationForm, setJustificationForm] = useState({ motif: 'Raison médicale / Maladie', explication: '' });
// Formulaires
  const [newNote, setNewNote] = useState({ matiere: '', note: '', noteSur: 20, coef: 1, appreciation: '', trimestre: 'T1' });
  const [newMot, setNewMot] = useState('');
  const [newAbsence, setNewAbsence] = useState({ motif: '', cours: '', date: '', type: 'Absence', trimestre: 'T1' });

  useEffect(() => {
    const stored = localStorage.getItem('user');
    let userObj = null;
    if (stored) {
      userObj = JSON.parse(stored);
      setCurrentUser(userObj);
    }

    const profMatiere = userObj?.matiere || userObj?.subject || 'Anglais';
    setNewNote(prev => ({ ...prev, matiere: profMatiere }));
    setNewAbsence(prev => ({ ...prev, cours: profMatiere }));

    fetch(`http://${window.location.hostname}:5001/api/students/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setStudent({
          ...data,
          notes: data.notes || { T1: [], T2: [], T3: [] },
          motsParents: data.motsParents || [],
          absences: data.absences || []
        });
      })
      .catch((err) => console.error('Erreur chargement élève:', err));
  }, [id]);

  if (!student) return <div className="p-20 font-black italic text-center">Chargement du profil...</div>;

  const isProf = currentUser?.role?.toLowerCase() === 'prof' || 
                 currentUser?.role?.toLowerCase() === 'professeur' || 
                 currentUser?.role?.toLowerCase() === 'admin';

  const allNotesList = Object.entries(student.notes || {}).flatMap(([t, notes]) => 
    (notes || []).map(n => ({ ...n, trimestre: t }))
  );
  
  const matieresDisponibles = Array.from(new Set(allNotesList.map(n => n.matiere)));

  const filteredNotesByMatiere = allNotesList.filter((n) => {
    const matchMatiere = selectedMatiere === 'Toutes' || n.matiere === selectedMatiere;
    const matchTrimestre = selectedTrimestreMatiere === 'Tous' || n.trimestre === selectedTrimestreMatiere;
    return matchMatiere && matchTrimestre;
  });

  const moyenneMatiere = filteredNotesByMatiere.length > 0
    ? (filteredNotesByMatiere.reduce((acc, curr) => acc + (curr.note * curr.coef), 0) / 
       filteredNotesByMatiere.reduce((acc, curr) => acc + curr.coef, 0)).toFixed(2)
    : null;

  // 1. Filtrage strict pour la vue "Assiduité & Signalements" : UNIQUEMENT les éléments en cours (non justifiés)
  const activeAbsences = (student.absences || []).filter(item => {
    const isJustified = item.justified || item.statut === 'JUSTIFIÉE' || item.justificatif?.statut === 'Approuvé';
    if (isJustified) return false; // On exclut du flux "en cours" si c'est déjà justifié

    if (selectedTrimestreAssiduite === 'Tous') return true;
    return (item.trimestre || 'T1') === selectedTrimestreAssiduite;
  });

  // 2. Filtrage pour l'historique détaillé piloté par les cartes du Bilan global en bas
  const filteredAbsencesBilan = (student.absences || []).filter(item => {
    const itemTrim = item.trimestre || 'T1';
    const typeStr = String(item.type || '').toLowerCase();

    if (filterBilanDetail) {
      const matchTrim = itemTrim === filterBilanDetail.trimestre;
      const matchType = filterBilanDetail.type === 'Absence' 
        ? typeStr.includes('absence') 
        : typeStr.includes('retard');
      return matchTrim && matchType;
    }
    return true;
  });

  // Calcul du bilan global DYNAMIQUE par trimestre
  const getBilanTrimestre = (trim) => {
    const items = (student.absences || []).filter(item => {
      const itemTrim = item.trimestre || 'T1';
      if (trim === 'Tous') return true;
      return itemTrim === trim;
    });
    
    const totalAbsences = items.filter(i => {
      const type = String(i.type || '').toLowerCase();
      return type.includes('absence') || type.includes('absent');
    }).length;

    const totalRetards = items.filter(i => {
      const type = String(i.type || '').toLowerCase();
      return type.includes('retard') || type.includes('late');
    }).length;
    
    const justifiees = items.filter(i => 
      i.justified || 
      i.statut === 'JUSTIFIÉE' || 
      i.justificatif?.statut === 'Approuvé'
    ).length;
    
    const enAttente = items.filter(i => 
      i.justificatif?.statut === 'En attente' || 
      (!i.justified && i.statut !== 'JUSTIFIÉE' && i.justificatif)
    ).length;

    return { totalAbsences, totalRetards, justifiees, enAttente, total: items.length };
  };

  // Soumission d'un justificatif par l'élève ou le parent
  const handleSubmitJustificatif = async (e) => {
    e.preventDefault();
    if (!selectedAbsenceForJustify) return;

    const updatedAbsences = student.absences.map((abs) => {
      if (abs.id === selectedAbsenceForJustify.id) {
        return {
          ...abs,
          justificatif: {
            motif: justificationForm.motif,
            explication: justificationForm.explication,
            dateEnvoi: new Date().toLocaleDateString('fr-FR'),
            statut: 'En attente'
          }
        };
      }
      return abs;
    });

    setStudent({ ...student, absences: updatedAbsences });
    setSelectedAbsenceForJustify(null);
    setJustificationForm({ motif: 'Raison médicale / Maladie', explication: '' });

    try {
      await fetch(`http://localhost:5001/api/students/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ absences: updatedAbsences })
      });
    } catch (err) {
      console.error('Erreur lors de la soumission du justificatif:', err);
    }
  };

  // Validation ou refus d'un justificatif par l'enseignant

// Validation ou refus d'un justificatif par l'enseignant
  const handleValidateJustificatif = async (absenceId, approved) => {
    const updatedAbsences = student.absences.map((abs) => {
      if (abs.id === absenceId) {
        return {
          ...abs,
          justified: approved,
          statut: approved ? 'JUSTIFIÉE' : 'NON_JUSTIFIÉE',
          justificatif: {
            ...abs.justificatif,
            statut: approved ? 'Approuvé' : 'Refusé'
          }
        };
      }
      return abs;
    });

    setStudent({ ...student, absences: updatedAbsences });

    try {
      await fetch(`http://localhost:5001/api/students/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ absences: updatedAbsences })
      });
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut du justificatif:', err);
    }
  };

    const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.matiere || newNote.note === '') return;

    const t = newNote.trimestre;
    const updatedNotes = {
      ...student.notes,
      [t]: [
        ...(student.notes[t] || []),
        { 
          matiere: newNote.matiere, 
          note: Number(newNote.note), 
          noteSur: Number(newNote.noteSur) || 20, // <-- Ajout du barème ici
          coef: Number(newNote.coef), 
          appreciation: newNote.appreciation 
        }
      ]
    };
    
    
    setStudent({ ...student, notes: updatedNotes });
    const profMatiere = currentUser?.matiere || currentUser?.subject || newNote.matiere;
    setNewNote({ matiere: profMatiere, note: '', noteSur: 20, coef: 1, appreciation: '', trimestre: t });

    try {
      await fetch(`http://localhost:5001/api/students/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: updatedNotes })
      });
    } catch (err) {
      console.error('Erreur lors de la mise à jour des notes:', err);
    }
  };

  const handleDeleteNote = async (trimestre, index) => {
    const updatedNotesList = [...(student.notes[trimestre] || [])];
    updatedNotesList.splice(index, 1);
    
    const updatedNotes = {
      ...student.notes,
      [trimestre]: updatedNotesList
    };

    setStudent({ ...student, notes: updatedNotes });

    try {
      await fetch(`http://localhost:5001/api/students/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: updatedNotes })
      });
    } catch (err) {
      console.error('Erreur suppression note:', err);
    }
  };

  const handleStartEditNote = (trimestre, index, item) => {
    setEditingNoteIndex({ trimestre, index });
    setEditNoteForm({ ...item, trimestre });
  };
const handleSaveEditNote = async (e) => {
    e.preventDefault();
    if (!editingNoteIndex) return;

    const { trimestre, index } = editingNoteIndex;
    const targetTrimestre = editNoteForm.trimestre;

    let updatedNotes = { ...student.notes };

    if (trimestre === targetTrimestre) {
      const list = [...(updatedNotes[trimestre] || [])];
      list[index] = {
        matiere: editNoteForm.matiere,
        note: Number(editNoteForm.note),
        noteSur: Number(editNoteForm.noteSur) || 20, // <-- Ajout ici
        coef: Number(editNoteForm.coef),
        appreciation: editNoteForm.appreciation
      };
      updatedNotes[trimestre] = list;
    } else {
      const oldList = [...(updatedNotes[trimestre] || [])];
      oldList.splice(index, 1);
      updatedNotes[trimestre] = oldList;

      updatedNotes[targetTrimestre] = [
        ...(updatedNotes[targetTrimestre] || []),
        {
          matiere: editNoteForm.matiere,
          note: Number(editNoteForm.note),
          noteSur: Number(editNoteForm.noteSur) || 20, // <-- Et ici aussi
          coef: Number(editNoteForm.coef),
          appreciation: editNoteForm.appreciation
        }
      ];
    }

    setStudent({ ...student, notes: updatedNotes });
    setEditingNoteIndex(null);

    try {
      await fetch(`http://localhost:5001/api/students/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: updatedNotes })
      });
    } catch (err) {
      console.error('Erreur modification note:', err);
    }
  };
  const handleAddMot = async (e) => {
    e.preventDefault();
    if (!newMot) return;

    const updatedMots = [
      ...student.motsParents,
      {
        id: Date.now(),
        date: new Date().toLocaleDateString('fr-FR'),
        auteur: formatFullName(currentUser?.prenom, currentUser?.nom),
        texte: newMot
      }
    ];

    setStudent({ ...student, motsParents: updatedMots });
    setNewMot('');

    try {
      await fetch(`http://localhost:5001/api/students/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ motsParents: updatedMots })
      });
    } catch (err) {
      console.error('Erreur lors de la mise à jour des mots:', err);
    }
  };

  const handleAddAbsence = async (e) => {
    e.preventDefault();
    if (!newAbsence.cours || !newAbsence.date) return;

    const newAbsenceEntry = {
      id: Date.now(),
      date: newAbsence.date,
      heure: 'Heure de cours',
      professeur: formatFullName(currentUser?.prenom, currentUser?.nom) || 'Enseignant',
      matiere: newAbsence.cours,
      type: newAbsence.type,
      trimestre: newAbsence.trimestre || 'T1',
      justified: false,
      motif: newAbsence.motif || 'En attente de justification'
    };

    const updatedAbsences = [newAbsenceEntry, ...(student.absences || [])];

    setStudent({ ...student, absences: updatedAbsences });
    
    const profMatiere = currentUser?.matiere || currentUser?.subject || 'Anglais';
    setNewAbsence({ motif: '', cours: profMatiere, date: '', type: 'Absence', trimestre: 'T1' });

    try {
      await fetch(`http://localhost:5001/api/students/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ absences: updatedAbsences })
      });
    } catch (err) {
      console.error('Erreur lors de la sauvegarde du signalement:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-16">
      <Navbar user={currentUser || student} />

      <datalist id="liste-matieres">
        {LISTE_MATIERES.map((mat) => (
          <option key={mat} value={mat} />
        ))}
      </datalist>

      <main className="max-w-6xl mx-auto px-6 pt-8">
        
        {/* EN-TÊTE */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-violet-600 font-black text-xs uppercase tracking-widest hover:gap-3 transition-all"
          >
            <ArrowLeft size={18} /> Retour
          </button>

          <div className="flex items-center gap-3 bg-white border border-slate-100 shadow-sm px-4 py-2 rounded-2xl">
            <div className="w-9 h-9 bg-violet-600 text-white rounded-xl flex items-center justify-center font-black text-xs">
              {student.prenom?.[0]?.toUpperCase()}{student.nom?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="text-xs font-black text-slate-800 leading-none">
                {formatFullName(student.prenom, student.nom)}
              </p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                {student.classe || 'Élève'}
              </p>
            </div>

            {isProf && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`ml-2 p-2 rounded-xl transition-all ${
                  isEditing ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                title="Mode édition enseignant"
              >
                {isEditing ? <Check size={16} /> : <Edit3 size={16} />}
              </button>
            )}
          </div>
        </div>

        {/* ONGLETS */}
        <div className="flex border-b border-slate-200 mb-8 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('releve')}
            className={`pb-4 px-5 font-black text-xs uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'releve'
                ? 'border-violet-600 text-violet-600'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <BookOpen size={16} /> Relevé de Notes
          </button>

          <button
            onClick={() => setActiveTab('bulletin')}
            className={`pb-4 px-5 font-black text-xs uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'bulletin'
                ? 'border-violet-600 text-violet-600'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <FileText size={16} /> Bulletin Officiel
          </button>

          <button
            onClick={() => setActiveTab('matieres')}
            className={`pb-4 px-5 font-black text-xs uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'matieres'
                ? 'border-violet-600 text-violet-600'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <Layers size={16} /> Notes par Matières
          </button>

          <button
            onClick={() => setActiveTab('mots')}
            className={`pb-4 px-5 font-black text-xs uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'mots'
                ? 'border-violet-600 text-violet-600'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <MessageSquare size={16} /> Observations
          </button>

          <button
            onClick={() => setActiveTab('infos')}
            className={`pb-4 px-5 font-black text-xs uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'infos'
                ? 'border-violet-600 text-violet-600'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <User size={16} /> Infos Élève
          </button>
        </div>


        {/* VUE 1 : RELEVÉ DE NOTES */}
        {activeTab === 'releve' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              {['T1', 'T2', 'T3'].map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTrimestreBulletin(t)}
                  className={`px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                    selectedTrimestreBulletin === t
                      ? 'bg-violet-600 text-white shadow-md shadow-violet-200'
                      : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-100'
                  }`}
                >
                  Trimestre {t.replace('T', '')}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
              <h3 className="font-black text-slate-800 text-xl italic mb-6">
                Relevé de notes — Trimestre {selectedTrimestreBulletin.replace('T', '')}
              </h3>

              {student.notes?.[selectedTrimestreBulletin]?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                        <th className="pb-4">Matière</th>
                        <th className="pb-4">Note</th>
                        <th className="pb-4">Coef</th>
                        <th className="pb-4">Appréciation</th>
                        {isProf && isEditing && <th className="pb-4 text-right">Actions</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-sm font-medium text-slate-700">
                      {student.notes[selectedTrimestreBulletin].map((item, idx) => {
                        const isEditingThis = editingNoteIndex?.trimestre === selectedTrimestreBulletin && editingNoteIndex?.index === idx;

                        if (isEditingThis) {
                          return (
                            <tr key={idx} className="bg-violet-50/50">
                              <td className="py-3">
                                <input
                                  type="text"
                                  list="liste-matieres"
                                  value={editNoteForm.matiere}
                                  onChange={(e) => setEditNoteForm({ ...editNoteForm, matiere: e.target.value })}
                                  className="bg-white border border-slate-200 text-xs font-bold p-2 rounded-lg w-full"
                                />
                              </td>
                              <td className="py-3">
                                <div className="flex items-center gap-1">
                                  <input
                                    type="number"
                                    step="0.5"
                                    value={editNoteForm.note}
                                    onChange={(e) => setEditNoteForm({ ...editNoteForm, note: e.target.value })}
                                    className="bg-white border border-slate-200 text-xs font-bold p-2 rounded-lg w-16"
                                  />
                                  <span className="text-slate-400">/</span>
                                  <select
                                    value={editNoteForm.noteSur || 20}
                                    onChange={(e) => setEditNoteForm({ ...editNoteForm, noteSur: e.target.value })}
                                    className="bg-white border border-slate-200 text-xs font-bold p-2 rounded-lg"
                                  >
                                    <option value="20">20</option>
                                    <option value="10">10</option>
                                    <option value="5">5</option>
                                    <option value="40">40</option>
                                    <option value="100">100</option>
                                  </select>
                                </div>
                              </td>
                              <td className="py-3">
                                <input
                                  type="number"
                                  step="1"
                                  value={editNoteForm.coef}
                                  onChange={(e) => setEditNoteForm({ ...editNoteForm, coef: e.target.value })}
                                  className="bg-white border border-slate-200 text-xs font-bold p-2 rounded-lg w-16"
                                />
                              </td>
                              <td className="py-3">
                                <input
                                  type="text"
                                  value={editNoteForm.appreciation}
                                  onChange={(e) => setEditNoteForm({ ...editNoteForm, appreciation: e.target.value })}
                                  className="bg-white border border-slate-200 text-xs font-bold p-2 rounded-lg w-full"
                                  placeholder="Appréciation..."
                                />
                              </td>
                              <td className="py-3 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <button onClick={handleSaveEditNote} className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold">Enregistrer</button>
                                  <button onClick={() => setEditingNoteIndex(null)} className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-bold">Annuler</button>
                                </div>
                              </td>
                            </tr>
                          );
                        }

                        return (
                          <tr key={idx}>
                            <td className="py-4 font-black text-slate-900">{item.matiere}</td>
                            <td className="py-4">
                              <span className="font-black text-violet-600 bg-violet-50 px-3.5 py-1.5 rounded-xl">
                                {item.note} / {item.noteSur || 20}
                              </span>
                            </td>
                            <td className="py-4 font-bold">{item.coef}</td>
                            <td className="py-4 text-slate-500 italic">{item.appreciation || '—'}</td>
                            {isProf && isEditing && (
                              <td className="py-4 text-right space-x-2">
                                <button
                                  onClick={() => handleStartEditNote(selectedTrimestreBulletin, idx, item)}
                                  className="text-xs font-bold text-violet-600 hover:underline"
                                >
                                  Modifier
                                </button>
                                <button
                                  onClick={() => handleDeleteNote(selectedTrimestreBulletin, idx)}
                                  className="text-xs font-bold text-rose-500 hover:underline"
                                >
                                  Supprimer
                                </button>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-slate-400 font-bold italic text-sm">
                  Aucune note enregistrée pour le moment.
                </p>
              )}

              {/* Formulaire prof pour ajouter une note (intégré proprement ici) */}
              {isProf && isEditing && (
                <div className="mt-8 bg-violet-50/70 p-6 rounded-[2.5rem] border border-violet-100 space-y-4">
                  <h4 className="font-black text-xs text-violet-900 uppercase tracking-widest">Ajouter une nouvelle note</h4>
                  <form onSubmit={handleAddNote} className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-violet-700 mb-1">Matière</label>
                      <input
                        type="text"
                        list="liste-matieres"
                        placeholder="Matière"
                        value={newNote.matiere}
                        onChange={(e) => setNewNote({ ...newNote, matiere: e.target.value })}
                        className="w-full bg-white border border-violet-200 text-xs font-bold p-3 rounded-xl text-slate-800 focus:outline-none focus:border-violet-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase text-violet-700 mb-1">Note / Barème</label>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          step="0.5"
                          placeholder="Note"
                          value={newNote.note}
                          onChange={(e) => setNewNote({ ...newNote, note: e.target.value })}
                          className="w-full bg-white border border-violet-200 text-xs font-bold p-3 rounded-xl text-slate-800 focus:outline-none focus:border-violet-600"
                        />
                        <span className="text-slate-400 font-bold">/</span>
                        <select
                          value={newNote.noteSur || 20}
                          onChange={(e) => setNewNote({ ...newNote, noteSur: e.target.value })}
                          className="bg-white border border-violet-200 text-xs font-bold p-3 rounded-xl text-slate-800 focus:outline-none focus:border-violet-600"
                        >
                          <option value="20">20</option>
                          <option value="10">10</option>
                          <option value="5">5</option>
                          <option value="40">40</option>
                          <option value="100">100</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase text-violet-700 mb-1">Coefficient</label>
                      <input
                        type="number"
                        step="1"
                        value={newNote.coef}
                        onChange={(e) => setNewNote({ ...newNote, coef: e.target.value })}
                        className="w-full bg-white border border-violet-200 text-xs font-bold p-3 rounded-xl text-slate-800 focus:outline-none focus:border-violet-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase text-violet-700 mb-1">Trimestre</label>
                      <select
                        value={newNote.trimestre}
                        onChange={(e) => setNewNote({ ...newNote, trimestre: e.target.value })}
                        className="w-full bg-white border border-violet-200 text-xs font-bold p-3 rounded-xl text-slate-800 focus:outline-none focus:border-violet-600"
                      >
                        <option value="T1">Trimestre 1</option>
                        <option value="T2">Trimestre 2</option>
                        <option value="T3">Trimestre 3</option>
                      </select>
                    </div>

                    <div className="sm:col-span-5">
                      <label className="block text-[10px] font-black uppercase text-violet-700 mb-1">Appréciation (optionnelle)</label>
                      <div className="flex gap-3">
                        <input
                          type="text"
                          placeholder="Commentaire de l'évaluation..."
                          value={newNote.appreciation}
                          onChange={(e) => setNewNote({ ...newNote, appreciation: e.target.value })}
                          className="flex-1 bg-white border border-violet-200 text-xs font-bold p-3 rounded-xl text-slate-800 focus:outline-none focus:border-violet-600"
                        />
                        <button
                          type="submit"
                          className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-violet-200 shrink-0"
                        >
                          Enregistrer la note
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}

            </div>
          </div>
        )}



        {/* VUE 2 : BULLETIN OFFICIEL */}
        {activeTab === 'bulletin' && (
          <div className="space-y-6">
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 text-center max-w-2xl mx-auto space-y-4 my-8">
              <div className="w-16 h-16 bg-violet-50 text-violet-600 rounded-3xl flex items-center justify-center mx-auto">
                <FileText size={32} />
              </div>
              <h3 className="font-black text-slate-800 text-xl italic">
                Bulletin Trimestriel Officiel
              </h3>
              <p className="text-slate-500 text-xs font-medium leading-relaxed">
                Le bulletin officiel sera disponible à la clôture du conseil de classe du 1er trimestre.
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <button 
                  disabled
                  className="px-5 py-3 rounded-2xl bg-slate-100 text-slate-400 font-black text-xs uppercase tracking-wider flex items-center gap-2 cursor-not-allowed"
                >
                  <Download size={16} /> Télécharger le PDF (Indisponible)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VUE 3 : NOTES PAR MATIÈRES */}
        {activeTab === 'matieres' && (
          <div className="space-y-6">
            <div className="space-y-3 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 overflow-x-auto">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider w-20 shrink-0">Trimestre :</span>
                {['T1', 'T2', 'T3', 'Tous'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTrimestreMatiere(t)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                      selectedTrimestreMatiere === t
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {t === 'Tous' ? 'Tous les trimestres' : `Trimestre ${t.replace('T', '')}`}
                  </button>
                ))}
              </div>

              <hr className="border-slate-100" />

              <div className="flex items-center gap-2 overflow-x-auto">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider w-20 shrink-0">Matière :</span>
                <button
                  onClick={() => setSelectedMatiere('Toutes')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                    selectedMatiere === 'Toutes'
                      ? 'bg-violet-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Toutes
                </button>

                {matieresDisponibles.map((mat) => (
                  <button
                    key={mat}
                    onClick={() => setSelectedMatiere(mat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                      selectedMatiere === mat
                        ? 'bg-violet-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {mat}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-black text-slate-800 text-xl italic">
                    {selectedMatiere === 'Toutes' ? 'Toutes les évaluations' : `Notes en ${selectedMatiere}`}
                  </h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">
                    {selectedTrimestreMatiere === 'Tous' ? 'Tous les trimestres' : `Trimestre ${selectedTrimestreMatiere.replace('T', '')}`}
                  </p>
                </div>

                {moyenneMatiere && (
                  <div className="bg-violet-50 px-4 py-2 rounded-2xl border border-violet-100 text-right">
                    <span className="text-[10px] font-black uppercase text-violet-400 block leading-none">Moyenne</span>
                    <span className="text-lg font-black text-violet-600">{moyenneMatiere} / 20</span>
                  </div>
                )}
              </div>

              {filteredNotesByMatiere.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {filteredNotesByMatiere.map((item, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col gap-1 min-w-[150px]">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-violet-600 bg-violet-100 px-2 py-0.5 rounded-md uppercase">
                          {item.trimestre}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">Coef {item.coef}</span>
                      </div>
                      <span className="text-xl font-black text-slate-900 mt-1">{item.note} / 20</span>
                      <span className="text-xs font-bold text-slate-600">{item.matiere}</span>
                      {item.appreciation && (
                        <p className="text-[11px] text-slate-500 italic mt-1">{item.appreciation}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 font-bold italic text-sm">
                  Aucune note saisie pour cette période.
                </p>
              )}
            </div>
          </div>
        )}

        {/* VUE 4 : OBSERVATIONS */}
        {activeTab === 'mots' && (
          <div className="space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 space-y-4">
              <h3 className="font-black text-slate-800 text-xl italic mb-4">
                Observations & Mots aux parents
              </h3>
              {student.motsParents?.map((mot) => (
                <div key={mot.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-black text-xs text-violet-600 uppercase">{mot.auteur}</span>
                    <span className="text-[10px] text-slate-400 font-bold">{mot.date}</span>
                  </div>
                  <p className="text-sm text-slate-700 font-medium">{mot.texte}</p>
                </div>
              ))}
            </div>

            {isEditing && (
              <form onSubmit={handleAddMot} className="bg-violet-50 p-6 rounded-[2.5rem] border border-violet-100 space-y-3">
                <h4 className="font-black text-violet-900 text-xs uppercase tracking-wider">Ajouter une observation</h4>
                <textarea
                  rows="2"
                  placeholder="Rédiger votre remarque..."
                  value={newMot}
                  onChange={(e) => setNewMot(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                />
                <button type="submit" className="px-5 py-2.5 bg-violet-600 text-white rounded-xl font-black text-xs uppercase tracking-wider">
                  Publier
                </button>
              </form>
            )}
          </div>
        )}

        {/* VUE 5 : INFOS ÉLÈVE & ASSIDUITÉ + BILAN */}
        {activeTab === 'infos' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* FICHE INFOS */}
              <div className="lg:col-span-3 bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm space-y-3">
                <h3 className="font-black text-slate-800 text-base italic mb-1">
                  Informations personnelles
                </h3>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-8 h-8 bg-violet-100 text-violet-600 rounded-xl flex items-center justify-center shrink-0">
                    <User size={16} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Âge / Genre</p>
                    <p className="text-xs font-black text-slate-800 mt-0.5">{student.age || '17'} ans • {student.genre || 'Garçon'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-8 h-8 bg-violet-100 text-violet-600 rounded-xl flex items-center justify-center shrink-0">
                    <GraduationCap size={16} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Identifiant Unique</p>
                    <p className="text-xs font-black text-slate-800 mt-0.5">{student.id_unique || 'LYC-1428'}</p>
                  </div>
                </div>
              </div>

              {/* LISTE DES SIGNALEMENTS EN COURS (Absences/Retards non encore justifiés) */}
              <div className="lg:col-span-9 bg-[#0b1021] text-white rounded-[2.5rem] p-7 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-lg font-black italic flex items-center gap-3">
                      <Calendar size={20} className="text-violet-400" /> Assiduité & Signalements en cours
                    </h3>
                    <p className="text-slate-400 text-xs font-medium mt-0.5">
                      Les absences et retards validés ou dont le justificatif a été transmis sont archivés dans le bilan ci-dessous.
                    </p>
                  </div>

                  {/* Boutons de filtrage rapide par trimestre */}
                  <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-2xl border border-slate-800 shrink-0">
                    <Filter size={12} className="text-slate-500 ml-2" />
                    {['Tous', 'T1', 'T2', 'T3'].map((t) => (
                      <button
                        key={t}
                        onClick={() => setSelectedTrimestreAssiduite(t)}
                        className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase transition-all ${
                          selectedTrimestreAssiduite === t
                            ? 'bg-violet-600 text-white'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {t === 'Tous' ? 'Global' : t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  {activeAbsences && activeAbsences.length > 0 ? (
                    activeAbsences.map((item) => (
                      <div 
                        key={item.id} 
                        className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 space-y-3 hover:border-slate-700 transition-all"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-start gap-3.5">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                              item.type === 'Absence' 
                                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                              {item.type === 'Absence' ? <AlertTriangle size={18} /> : <Clock size={18} />}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-black text-slate-200">{item.matiere}</span>
                                <span className="text-[10px] font-bold text-slate-500">•</span>
                                <span className="text-[11px] font-bold text-slate-400">{item.professeur}</span>
                                <span className="text-[9px] font-black uppercase text-violet-400 bg-violet-500/20 px-2 py-0.5 rounded-md ml-1">
                                  {item.trimestre || 'T1'}
                                </span>
                              </div>
                              <p className="text-xs text-slate-300 mt-1 font-medium">
                                <strong className={item.type === 'Absence' ? 'text-rose-400' : 'text-amber-400'}>{item.type}</strong>
                                {item.duree ? ` (${item.duree})` : ''} — {item.motif}
                              </p>
                              <p className="text-[10px] font-bold text-slate-500 mt-1">
                                Signalé le {item.date} {item.heure ? `à ${item.heure}` : ''}
                              </p>
                            </div>
                          </div>

                          <div className="sm:text-right shrink-0 flex flex-col items-start sm:items-end gap-2">
                            {item.justificatif ? (
                              <div className="bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl text-left sm:text-right">
                                <p className="text-[10px] font-black uppercase text-amber-400">Justificatif transmis</p>
                                <p className="text-[10px] font-medium text-slate-300">{item.justificatif.motif}</p>
                              </div>
                            ) : (
                              <button
                                onClick={() => setSelectedAbsenceForJustify(item)}
                                className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-sm flex items-center gap-2"
                              >
                                <Send size={12} /> Transmettre un justificatif
                              </button>
                            )}

                            {/* Actions prof si besoin de valider */}
                            {isProf && item.justificatif && !item.justified && (
                              <div className="flex items-center gap-2 pt-1">
                                <button
                                  onClick={() => handleValidateJustificatif(item.id, true)}
                                  className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-[10px] font-black uppercase flex items-center gap-1 hover:bg-emerald-500/30"
                                >
                                  <CheckCircle2 size={12} /> Valider
                                </button>
                                <button
                                  onClick={() => handleValidateJustificatif(item.id, false)}
                                  className="px-2.5 py-1 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg text-[10px] font-black uppercase flex items-center gap-1 hover:bg-rose-500/30"
                                >
                                  <XCircle size={12} /> Refuser
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 space-y-2">
                      <CheckCircle2 size={36} className="text-emerald-400 mx-auto" />
                      <p className="text-slate-300 font-bold text-sm">Aucun signalement en cours</p>
                      <p className="text-slate-500 text-xs">Tout est en ordre ! Consultez le bilan trimestriel ci-dessous pour l'historique global.</p>
                    </div>
                  )}
                </div>

                {/* Formulaire prof pour ajouter un signalement */}
                {isProf && (
                  <form onSubmit={handleAddAbsence} className="pt-6 border-t border-slate-800 space-y-4">
                    <h4 className="font-black text-xs text-violet-400 uppercase tracking-widest">Signaler une absence ou un retard</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <select
                        value={newAbsence.type}
                        onChange={(e) => setNewAbsence({ ...newAbsence, type: e.target.value })}
                        className="bg-slate-900 border border-slate-800 text-xs font-bold p-3 rounded-xl text-white"
                      >
                        <option value="Absence">Absence</option>
                        <option value="Retard">Retard</option>
                      </select>

                      <input
                        type="text"
                        list="liste-matieres"
                        placeholder="Matière / Cours"
                        value={newAbsence.cours}
                        onChange={(e) => setNewAbsence({ ...newAbsence, cours: e.target.value })}
                        className="bg-slate-900 border border-slate-800 text-xs font-bold p-3 rounded-xl text-white"
                      />

                        {/* Champ Date avec mini-calendrier intégré */}
                        <div className="relative">
                        <input
                            type="date"
                            required
                            value={newAbsence.date}
                            onChange={(e) => setNewAbsence({ ...newAbsence, date: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 text-xs font-bold p-3 rounded-xl text-white [color-scheme:dark] focus:outline-none focus:border-violet-600 cursor-pointer"
                        />
                        </div>

                      <select
                        value={newAbsence.trimestre}
                        onChange={(e) => setNewAbsence({ ...newAbsence, trimestre: e.target.value })}
                        className="bg-slate-900 border border-slate-800 text-xs font-bold p-3 rounded-xl text-white"
                      >
                        <option value="T1">Trimestre 1</option>
                        <option value="T2">Trimestre 2</option>
                        <option value="T3">Trimestre 3</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-black text-xs uppercase tracking-wider transition-all"
                    >
                      Enregistrer le signalement
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* BILAN GLOBAL TRIMESTRIEL (CLIQUABLE) AVEC HISTORIQUE DÉTAILLÉ */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-black text-slate-800 text-xl italic">Bilan d'assiduité par Trimestre</h3>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-0.5">
                    Synthèse globale des retards, absences et justificatifs — Cliquez sur une carte pour filtrer l'historique
                  </p>
                </div>
                {filterBilanDetail && (
                  <button
                    onClick={() => setFilterBilanDetail(null)}
                    className="px-3.5 py-1.5 bg-violet-50 text-violet-600 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-violet-100 transition-all"
                  >
                    Réinitialiser le filtre ({filterBilanDetail.trimestre} - {filterBilanDetail.type})
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['T1', 'T2', 'T3'].map((trim, index) => {
                  const stats = getBilanTrimestre(trim);
                  return (
                    <div key={trim} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                        <span className="font-black text-xs uppercase tracking-wider text-slate-900">
                          Trimestre {index + 1}
                        </span>
                        <span className="text-[10px] font-black uppercase text-violet-600 bg-violet-100 px-2.5 py-1 rounded-lg">
                          {stats.total} Événement(s)
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {/* Carte Absences Cliquable */}
                        <div 
                          onClick={() => setFilterBilanDetail({ trimestre: trim, type: 'Absence' })}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
                            filterBilanDetail?.trimestre === trim && filterBilanDetail?.type === 'Absence'
                              ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-400/20'
                              : 'bg-white border-slate-100 hover:border-rose-200'
                          }`}
                        >
                          <p className="text-[9px] font-black text-rose-500 uppercase tracking-wider">Absences</p>
                          <p className="text-xl font-black text-slate-900 mt-1">{stats.totalAbsences}</p>
                        </div>

                        {/* Carte Retards Cliquable */}
                        <div 
                          onClick={() => setFilterBilanDetail({ trimestre: trim, type: 'Retard' })}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
                            filterBilanDetail?.trimestre === trim && filterBilanDetail?.type === 'Retard'
                              ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400/20'
                              : 'bg-white border-slate-100 hover:border-amber-200'
                          }`}
                        >
                          <p className="text-[9px] font-black text-amber-500 uppercase tracking-wider">Retards</p>
                          <p className="text-xl font-black text-slate-900 mt-1">{stats.totalRetards}</p>
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-2 text-xs font-bold text-slate-500">
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Justifiés :
                          </span>
                          <span className="text-slate-900 font-black">{stats.justifiees}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-500"></span> En attente :
                          </span>
                          <span className="text-slate-900 font-black">{stats.enAttente}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* LISTE HISTORIQUE FILTRÉE PAR LE BILAN */}
              {filterBilanDetail && (
                <div className="mt-8 pt-6 border-t border-slate-200 space-y-4">
                  <h4 className="font-black text-slate-800 text-sm uppercase tracking-wider">
                    Détail pour : Trimestre {filterBilanDetail.trimestre.replace('T', '')} — {filterBilanDetail.type}s
                  </h4>
                  <div className="space-y-3">
                    {filteredAbsencesBilan.length > 0 ? (
                      filteredAbsencesBilan.map(item => (
                        <div key={item.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center text-xs">
                          <div>
                            <span className="font-black text-slate-900">{item.matiere}</span> — 
                            <span className="text-slate-500 ml-1">Signalé le {item.date}</span>
                            <p className="text-[11px] text-slate-600 mt-0.5">Motif : {item.motif}</p>
                          </div>
                          <div>
                            {item.justified || item.statut === 'JUSTIFIÉE' ? (
                              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 font-black text-[10px] rounded-lg">JUSTIFIÉE</span>
                            ) : (
                              <span className="px-2.5 py-1 bg-amber-100 text-amber-700 font-black text-[10px] rounded-lg">EN COURS / ATTENTE</span>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400 text-xs italic">Aucun élément trouvé pour cette sélection.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* MODALE DE SOUMISSION DE JUSTIFICATIF */}
      {selectedAbsenceForJustify && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl border border-slate-100 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-black text-slate-800 text-lg italic">Transmettre un justificatif</h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-0.5">
                  {selectedAbsenceForJustify.matiere} • {selectedAbsenceForJustify.date}
                </p>
              </div>
              <button 
                onClick={() => setSelectedAbsenceForJustify(null)}
                className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitJustificatif} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Motif principal</label>
                <select
                  value={justificationForm.motif}
                  onChange={(e) => setJustificationForm({ ...justificationForm, motif: e.target.value })}
                  className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900"
                >
                  <option value="Raison médicale / Maladie">Raison médicale / Maladie</option>
                  <option value="Impératif familial">Impératif familial</option>
                  <option value="Transport / Retard de bus">Transport / Retard de bus</option>
                  <option value="Autre motif légitime">Autre motif légitime</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Explication détaillée</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Précisez les détails..."
                  value={justificationForm.explication}
                  onChange={(e) => setJustificationForm({ ...justificationForm, explication: e.target.value })}
                  className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedAbsenceForJustify(null)}
                  className="px-5 py-3 rounded-2xl bg-slate-100 text-slate-600 font-black text-xs uppercase tracking-wider hover:bg-slate-200 transition-all"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-violet-600 text-white font-black text-xs uppercase tracking-wider hover:bg-violet-500 transition-all shadow-md shadow-violet-200"
                >
                  Envoyer le justificatif
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilEtudiant;