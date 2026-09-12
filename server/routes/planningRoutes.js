// server/routes/planningRoutes.js
const express = require('express');
const router = express.Router();
const Planning = require('../models/Planning');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
    console.log("📢 Requête reçue sur /api/planningProf");
    try {
        const planning = await Planning.findOne();
        
        if (!planning) {
            console.log("❌ Collection 'planningProf' vide ou introuvable.");
            return res.status(404).json({ message: "Base de données vide." });
        }
        
        console.log("✅ Données de planning envoyées au client.");
        res.json(planning);
    } catch (error) {
        console.error("🔥 Erreur serveur planning:", error);
        res.status(500).json({ message: "Erreur interne serveur" });
    }
});

module.exports = router;