// mon-projet-mern/server/routes/assiduiteRoutes.js

const express = require('express');
const router = express.Router();
const Assiduite = require('../models/assiduiteModel');

// 1. Route pour enregistrer ou modifier un appel (POST /api/assiduite/appel)
router.post('/appel', async (req, res) => {
  try {
    const { profId, profNom, matiere, classe, heure, date, statutsEleves } = req.body;
    
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

    res.status(200).json({ message: "Appel enregistré avec succès." });
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