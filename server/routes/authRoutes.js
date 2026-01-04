// server/routes/authRoutes.js

const express = require('express');
const router = express.Router();

// MODIFICATION ICI : Il faut ajouter "login" dans la déstructuration
const { register, login } = require('../controllers/authController');

// Route : POST /api/auth/register
router.post('/register', register);
// Test temporaire dans authRoutes.js
/*
router.post('/register', (req, res) => {
    res.status(200).json({ message: "Le serveur a bien reçu la requête !" });
});
*/

// Maintenant "login" est défini et ne causera plus d'erreur
router.post('/login', login);

module.exports = router;