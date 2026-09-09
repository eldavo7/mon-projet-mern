// server/routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const Message = require('../models/Message');

// 1. Routes spécifiques et statiques (OBLIGATOIREMENT avant les routes dynamiques `/:userId`)
router.get('/destinataires', messageController.getDestinataires);

router.get('/boite-reception/:userId', async (req, res) => {
    try {
        const messages = await Message.find({ destinataire: req.params.userId })
            .lean()
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: messages });
    } catch (error) {
        console.error("Erreur boite-reception :", error);
        res.status(500).json({ success: false, message: "Erreur lors de la récupération des messages", error: error.message });
    }
});

router.get('/messages-envoyes/:userId', async (req, res) => {
    try {
        const messages = await Message.find({ expediteur: req.params.userId })
            .lean()
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: messages });
    } catch (error) {
        console.error("Erreur messages-envoyes :", error);
        res.status(500).json({ success: false, message: "Erreur lors de la récupération des messages", error: error.message });
    }
});

// 2. Envoi de message
router.post('/', messageController.sendMessage);
router.post('/send', messageController.sendMessage);

// 3. Route dynamique générale (Récupération globale Reçus + Envoyés)
router.get('/:userId', messageController.getMessages);

// 4. Marquer un message comme lu
router.patch('/:id/lire', async (req, res) => {
    try {
        const updated = await Message.findByIdAndUpdate(
            req.params.id, 
            { lu: true }, 
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ success: false, message: "Message introuvable" });
        }

        res.status(200).json({ success: true, message: "Message marqué comme lu", data: updated });
    } catch (error) {
        console.error("Erreur lecture message :", error);
        res.status(500).json({ success: false, message: "Erreur de mise à jour", error: error.message });
    }
});

module.exports = router;