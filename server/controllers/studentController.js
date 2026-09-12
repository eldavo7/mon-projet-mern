// server/controllers/studentController.js

const Notification = require('../models/Notification');

let User;
try { 
  User = require('../models/User'); 
} catch (e) {
  try { 
    User = require('../models/etudiantModel'); 
  } catch (e2) {}
}

// Filtre pour cibler uniquement les élèves
const eleveRoleQuery = {
  $or: [
    { role: { $regex: 'eleve|étudiant|etudiant', $options: 'i' } },
    { role: { $exists: false } },
    { matiere: { $exists: false } }
  ]
};

// Fonction utilitaire pour normaliser les clés de trimestre ("Trimestre 1", "T1", "1" -> "T1")
const normalizeTrimKey = (key) => {
  if (!key) return 'T1';
  const str = String(key).trim().toUpperCase();
  if (str.includes('1')) return 'T1';
  if (str.includes('2')) return 'T2';
  if (str.includes('3')) return 'T3';
  return 'T1';
};

// @desc Recherche par mot-clé (nom / prénom)
exports.searchStudents = async (req, res) => {
  try {
    const query = req.query.q || '';
    const students = await User.find({
      ...eleveRoleQuery,
      $or: [
        { nom: { $regex: query, $options: 'i' } },
        { prenom: { $regex: query, $options: 'i' } }
      ]
    }).limit(10).lean();

    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc Obtenir tous les élèves (avec filtre classe optionnel)
exports.getAllStudents = async (req, res) => {
  try {
    const { classe } = req.query;
    let filter = { ...eleveRoleQuery };

    if (classe) {
      filter.classe = { $regex: classe, $options: 'i' };
    }

    const students = await User.find(filter).sort({ nom: 1 }).lean();
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc Obtenir un élève par ID
exports.getStudentById = async (req, res) => {
  try {
    const student = await User.findById(req.params.id).lean();
    if (!student) {
      return res.status(404).json({ success: false, message: "Élève non trouvé" });
    }

    // Normalisation de la structure des notes en sortie
    const rawNotes = student.notes || {};
    const formattedNotes = {
      T1: rawNotes.T1 || rawNotes["Trimestre 1"] || [],
      T2: rawNotes.T2 || rawNotes["Trimestre 2"] || [],
      T3: rawNotes.T3 || rawNotes["Trimestre 3"] || []
    };

    res.status(200).json({
      ...student,
      notes: formattedNotes,
      absences: student.absences || [],
      motsParents: student.motsParents || []
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc Mettre à jour un élève (Notes, Absences, Justificatifs)
exports.updateStudent = async (req, res) => {
  try {
    const student = await User.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ success: false, message: "Élève non trouvé" });
    }

    // Un élève connecté sur sa propre fiche (req.isStaffRequest === false) ne peut
    // que soumettre un justificatif d'absence : jamais ses notes ni d'autres champs.
    if (!req.isStaffRequest) {
      if (req.body.notes || req.body.nouvelleNote) {
        return res.status(403).json({ success: false, message: "Vous ne pouvez pas modifier vos propres notes." });
      }
      const allowedSelfFields = new Set(['absences']);
      const hasOtherFields = Object.keys(req.body).some((key) => !allowedSelfFields.has(key));
      if (hasOtherFields) {
        return res.status(403).json({ success: false, message: "Modification non autorisée." });
      }
    }

    // --- GESTION DES NOTES SANS ÉCRASEMENT ---
    if (req.body.notes) {
      if (!student.notes) {
        student.notes = { T1: [], T2: [], T3: [] };
      }

      // Cas 1 : Envoi d'une note unique via { nouvelleNote: {...}, trimestre: "T1" }
      if (req.body.nouvelleNote) {
        const trimKey = normalizeTrimKey(req.body.trimestre);
        if (!Array.isArray(student.notes[trimKey])) {
          student.notes[trimKey] = [];
        }
        student.notes[trimKey].push(req.body.nouvelleNote);
      } 
      // Cas 2 : Envoi d'un objet complet de notes { T1: [...], T2: [...] }
      else if (typeof req.body.notes === 'object') {
        Object.keys(req.body.notes).forEach((key) => {
          const trimKey = normalizeTrimKey(key);
          const incomingList = req.body.notes[key];

          if (Array.isArray(incomingList)) {
            if (!Array.isArray(student.notes[trimKey])) {
              student.notes[trimKey] = [];
            }

            // Fusion pour éviter les doublons stricts (même date/matière/note)
            incomingList.forEach((newNote) => {
              const isDuplicate = student.notes[trimKey].some((existingNote) => 
                existingNote.matiere === newNote.matiere &&
                existingNote.note === newNote.note &&
                existingNote.bareme === newNote.bareme &&
                existingNote.date === newNote.date
              );

              if (!isDuplicate) {
                student.notes[trimKey].push(newNote);
              }
            });
          }
        });
      }

      student.markModified('notes');

      try {
        await Notification.create({
          userId: student._id,
          type: 'note',
          title: 'Mise à jour de vos notes',
          description: 'Un enseignant a mis à jour votre relevé de notes.',
        });
      } catch (notifErr) {
        console.error("Erreur création notif note:", notifErr.message);
      }
    }

    // --- GESTION DES ABSENCES ---
    if (req.body.absences) {
      student.absences = req.body.absences;
      student.markModified('absences');

      try {
        await Notification.create({
          userId: student._id,
          type: 'retard',
          title: 'Mise à jour de la vie scolaire',
          description: 'Un nouvel élément a été ajouté concernant vos absences ou retards.',
        });
      } catch (notifErr) {
        console.error("Erreur création notif retard:", notifErr.message);
      }
    }

    // --- MISE À JOUR DES AUTRES CHAMPS (DIVERS) ---
    Object.keys(req.body).forEach((key) => {
      if (!['notes', 'absences', 'nouvelleNote', 'trimestre'].includes(key)) {
        student[key] = req.body[key];
        student.markModified(key);
      }
    });

    const updatedStudent = await student.save();
    res.status(200).json(updatedStudent);

  } catch (err) {
    console.error("Erreur updateStudent :", err);
    res.status(500).json({ success: false, message: err.message });
  }
};