// mon-projet-mern/server/routes/assiduiteRoutes.js

const express = require('express');
const router = express.Router();
const Assiduite = require('../models/assiduiteModel');
const User = require('../models/User');
const { protect, restrictTo, STAFF_ROLES } = require('../middleware/auth');

router.use(protect);

// Détermine le trimestre scolaire (T1/T2/T3) à partir d'une date.
// Découpage classique en France : T1 = sept-déc, T2 = janv-mars, T3 = avril-juillet/août.
function trimestreFromDate(d) {
  const mois = d.getMonth() + 1; // 1-12
  if (mois >= 9 || mois === 12) return 'T1';
  if (mois >= 1 && mois <= 3) return 'T2';
  return 'T3';
}

// 1. Route pour enregistrer ou modifier un appel (POST /api/assiduite/appel)
// Réservée au staff : seul un prof/admin peut faire l'appel.
router.post('/appel', restrictTo(...STAFF_ROLES), async (req, res) => {
  try {
    const { profId, profNom, matiere, classe, heure, date, statutsEleves } = req.body;

    if (!classe || !heure || !Array.isArray(statutsEleves)) {
      return res.status(400).json({ message: "Données d'appel incomplètes (classe, heure, statutsEleves requis)." });
    }

    const dateCouranteObj = new Date(date || Date.now());
    const debutJournee = new Date(dateCouranteObj);
    debutJournee.setHours(0, 0, 0, 0);

    const finJournee = new Date(dateCouranteObj);
    finJournee.setHours(23, 59, 59, 999);

    await Assiduite.deleteMany({
      classe: { $regex: new RegExp(`^${classe}$`, 'i') },
      heure: heure,
      date: { $gte: debutJournee, $lte: finJournee }
    });

    // MODIFICATION ICI : On récupère aussi nom et prenom envoyés par le front
    const elevesFormates = statutsEleves.map(item => ({
      eleveId: item.eleveId,
      nom: item.nom,
      prenom: item.prenom,
      statut: item.statut
    }));

    const nouvelAppel = new Assiduite({
      profId,
      profNom,
      matiere,
      classe,
      heure,
      date: date || new Date(),
      eleves: elevesFormates
    });

    await nouvelAppel.save();

    // --- SYNCHRONISATION VERS LA FICHE ÉLÈVE (etudiants.absences) ---
    // `assiduites` est la source de vérité de "ce qui s'est passé en cours".
    // On répercute ici automatiquement vers `absences` (utilisé par ProfilEtudiant.jsx
    // pour l'historique + le workflow de justification), pour que faire l'appel
    // mette réellement à jour la fiche de l'élève. Avant ce correctif, les deux
    // collections vivaient totalement séparées (cf. README, chantier "en cours").
    const dateStr = dateCouranteObj.toISOString().split('T')[0];
    const cleAppel = `${classe}|${heure}|${dateStr}`;
    const trimestre = trimestreFromDate(dateCouranteObj);

    const syncResults = await Promise.allSettled(
      elevesFormates.map(async (eleve) => {
        const student = await User.findById(eleve.eleveId);
        if (!student) return;

        const absencesActuelles = Array.isArray(student.absences) ? student.absences : [];

        // On retire l'éventuelle entrée précédente issue d'un appel précédent sur ce même créneau
        const absencesSansCeCreneau = absencesActuelles.filter((a) => a.cle !== cleAppel);

        let nouvellesAbsences = absencesSansCeCreneau;

        if (eleve.statut === 'absent' || eleve.statut === 'retard') {
          nouvellesAbsences = [
            {
              id: `appel-${cleAppel}-${eleve.eleveId}`,
              date: dateStr,
              heure,
              professeur: profNom || 'Enseignant',
              matiere: matiere || '',
              type: eleve.statut === 'absent' ? 'Absence' : 'Retard',
              trimestre,
              justified: false,
              motif: "Enregistré via l'appel de classe",
              origine: 'appel',
              cle: cleAppel
            },
            ...absencesSansCeCreneau
          ];
        }

        student.absences = nouvellesAbsences;
        student.markModified('absences');
        await student.save();
      })
    );

    const echecs = syncResults.filter((r) => r.status === 'rejected');
    if (echecs.length > 0) {
      console.error(`⚠️ Sync absences : ${echecs.length} élève(s) non synchronisé(s)`, echecs.map(e => e.reason?.message));
    }

    res.status(200).json({ message: "Appel enregistré avec succès.", eleveSyncErrors: echecs.length });
  } catch (err) {
    console.error("Erreur serveur /assiduite/appel:", err);
    res.status(500).json({ message: "Erreur lors de l'enregistrement de l'appel." });
  }
});

// 2. Route pour récupérer tout l'historique d'assiduité (GET /api/assiduite)
router.get('/', async (req, res) => {
  try {
    const liste = await Assiduite.find({});
    res.status(200).json(liste);
  } catch (err) {
    console.error("Erreur récupération assiduité:", err);
    res.status(500).json({ message: "Erreur lors de la récupération de l'assiduité." });
  }
});

module.exports = router;
