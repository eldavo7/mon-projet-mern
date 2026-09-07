// server/routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Utilisation du modèle User

// 1. RECHERCHE PAR MOT-CLÉ (nom/prénom)
// Doit obligatoirement être placée AVANT la route avec l'ID /:id
router.get('/search', async (req, res) => {
    try {
        const query = req.query.q || '';
        
        const students = await User.find({
            $or: [
                { nom: { $regex: query, $options: 'i' } },
                { prenom: { $regex: query, $options: 'i' } }
            ]
        }).limit(10);
        
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. RÉCUPÉRATION DE TOUS LES ÉLÈVES (ou filtrés par classe)
router.get('/', async (req, res) => {
    try {
        const { classe } = req.query;
        let filtre = {};

        if (classe) {
            filtre.classe = { $regex: classe, $options: 'i' };
        }

        const students = await User.find(filtre).sort({ nom: 1 });
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. RÉCUPÉRATION D'UN ÉLÈVE SPÉCIFIQUE PAR SON ID MONGODB
router.get('/:id', async (req, res) => {
    try {
        const student = await User.findById(req.params.id);
        
        if (!student) {
            return res.status(404).json({ message: "Élève non trouvé" });
        }
        
        res.json(student);
    } catch (err) {
        console.error("Erreur récupération élève:", err);
        res.status(500).json({ message: "Erreur serveur lors de la récupération de l'élève" });
    }
});

module.exports = router;