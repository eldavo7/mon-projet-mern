const express = require('express');
const router = express.Router();
const User = require('../models/User'); // On pointe vers User.js

// server/routes/studentRoutes.js

router.get('/search', async (req, res) => {
    try {
        const query = req.query.q;
        // Si tu n'as pas de champ "role", enlève { role: 'student' }
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

// server/routes/studentRoutes.js

router.get('/', async (req, res) => {
    try {
        const { classe } = req.query;
        let filtre = {};

        // Si on demande une classe, on cherche de manière souple (ignore majuscules/minuscules)
        if (classe) {
            filtre.classe = { $regex: classe, $options: 'i' };
        }

        // On récupère les utilisateurs
        const students = await User.find(filtre).sort({ nom: 1 });
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ROUTE POUR RÉCUPÉRER UN ÉLÈVE PAR SON ID
router.get('/:id', async (req, res) => {
    try {
        // IMPORTANT: Utiliser User car Student n'existe pas dans tes modèles
        const student = await User.findById(req.params.id);
        
        if (!student) {
            return res.status(404).json({ message: "Élève non trouvé" });
        }
        
        res.json(student);
    } catch (err) {
        console.error("Erreur récup élève:", err);
        // Si l'ID est mal formé, MongoDB renvoie une erreur cast
        res.status(500).json({ message: "Erreur lors de la récupération des données" });
    }
});



module.exports = router;