// server/scripts/syncAbsencesFromAssiduite.js
//
// Script de migration à lancer UNE SEULE FOIS après la mise à jour du serveur.
//
// Pourquoi : depuis le début du projet, faire l'appel (LancerAppel.jsx) écrivait
// uniquement dans la collection `assiduites`, jamais dans `etudiants.absences`.
// Le correctif dans routes/assiduiteRoutes.js ne synchronise que les NOUVEAUX
// appels à partir de maintenant. Ce script rattrape l'historique déjà en base
// pour que les fiches élèves reflètent aussi les absences passées.
//
// Utilisation :
//   cd server
//   node scripts/syncAbsencesFromAssiduite.js
//
// Le script est idempotent : le réexécuter ne crée pas de doublons (déduplication
// via le champ `cle` de chaque entrée, comme dans la route /assiduite/appel).

require('dotenv').config();
const mongoose = require('mongoose');
const Assiduite = require('../models/assiduiteModel');
const User = require('../models/User');

function trimestreFromDate(d) {
  const mois = d.getMonth() + 1;
  if (mois >= 9 || mois === 12) return 'T1';
  if (mois >= 1 && mois <= 3) return 'T2';
  return 'T3';
}

async function run() {
  if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI manquant dans .env");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connecté à MongoDB");

  const appels = await Assiduite.find({}).lean();
  console.log(`📋 ${appels.length} appel(s) trouvé(s) dans la collection assiduites`);

  // On regroupe par élève pour ne charger/sauver chaque document User qu'une fois
  const parEleve = new Map(); // eleveId -> [entrées à insérer]

  for (const appel of appels) {
    const dateObj = new Date(appel.date);
    const dateStr = dateObj.toISOString().split('T')[0];
    const cle = `${appel.classe}|${appel.heure}|${dateStr}`;
    const trimestre = trimestreFromDate(dateObj);

    for (const eleve of appel.eleves || []) {
      if (eleve.statut !== 'absent' && eleve.statut !== 'retard') continue;
      if (!eleve.eleveId) continue;

      const entry = {
        id: `appel-${cle}-${eleve.eleveId}`,
        date: dateStr,
        heure: appel.heure,
        professeur: appel.profNom || 'Enseignant',
        matiere: appel.matiere || '',
        type: eleve.statut === 'absent' ? 'Absence' : 'Retard',
        trimestre,
        justified: false,
        motif: "Enregistré via l'appel de classe (migration)",
        origine: 'appel',
        cle
      };

      if (!parEleve.has(eleve.eleveId)) parEleve.set(eleve.eleveId, []);
      parEleve.get(eleve.eleveId).push(entry);
    }
  }

  console.log(`👥 ${parEleve.size} élève(s) à mettre à jour`);

  let updated = 0;
  let missing = 0;

  for (const [eleveId, entries] of parEleve.entries()) {
    const student = await User.findById(eleveId);
    if (!student) {
      missing++;
      continue;
    }

    const absencesActuelles = Array.isArray(student.absences) ? student.absences : [];
    const clesAMigrer = new Set(entries.map((e) => e.cle));

    // On ne garde que les entrées existantes qui ne sont pas déjà couvertes par la migration
    // (évite les doublons si le script est relancé, ou si le sync "live" a déjà tourné)
    const absencesConservees = absencesActuelles.filter((a) => !clesAMigrer.has(a.cle));

    student.absences = [...entries, ...absencesConservees];
    student.markModified('absences');
    await student.save();
    updated++;
  }

  console.log(`✅ Migration terminée : ${updated} élève(s) mis à jour, ${missing} introuvable(s) en base.`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("🔥 Erreur pendant la migration :", err);
  process.exit(1);
});
