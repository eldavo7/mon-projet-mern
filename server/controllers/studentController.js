// server/controllers/studentController.js

const Notification = require('../models/Notification'); // <-- 1. Import du modèle

let User;
try { User = require('../models/User'); } catch (e) {
  try { User = require('../models/etudiantModel'); } catch (e2) {}
}

// Filtre pour cibler uniquement les élèves
const eleveRoleQuery = {
  $or: [
    { role: { $regex: 'eleve|étudiant|etudiant', $options: 'i' } },
    { role: { $exists: false } },
    { matiere: { $exists: false } }
  ]
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

    res.status(200).json({
      ...student,
      notes: student.notes || { T1: [], T2: [], T3: [] },
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

    if (req.body.notes) {
      student.notes = req.body.notes;
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

    Object.keys(req.body).forEach((key) => {
      if (key !== 'notes' && key !== 'absences') {
        student[key] = req.body[key];
        student.markModified(key);
      }
    });

    const updatedStudent = await student.save();
    res.status(200).json(updatedStudent);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};