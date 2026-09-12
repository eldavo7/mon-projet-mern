// server/routes/studentRoutes.js

const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { protect, restrictTo, restrictToStaffOrSelf, STAFF_ROLES } = require('../middleware/auth');

// Toutes les routes élèves nécessitent d'être connecté
router.use(protect);

// 1. RECHERCHE PAR MOT-CLÉ (nom/prénom)
// Placée obligatoirement avant /:id pour éviter tout conflit de routing
router.get('/search', studentController.searchStudents);

// 2. RÉCUPÉRATION DE TOUS LES ÉLÈVES (filtrés par classe / rôle)
router.get('/', studentController.getAllStudents);

// 3. RÉCUPÉRATION D'UN ÉLÈVE PAR ID
router.get('/:id', studentController.getStudentById);

// 4. MISE À JOUR D'UN ÉLÈVE (Notes, Absences, Retards, etc.)
// Le staff peut tout modifier. Un élève ne peut modifier QUE sa propre fiche,
// et uniquement pour soumettre un justificatif (le contrôleur bloque toute
// tentative de modification des notes si l'appelant n'est pas staff).
// Supporte à la fois PATCH et PUT selon la méthode utilisée côté React
router.patch('/:id', restrictToStaffOrSelf, studentController.updateStudent);
router.put('/:id', restrictToStaffOrSelf, studentController.updateStudent);

// 5. ROUTE DÉDIÉE : AJOUT RAPIDE D'UNE NOTE SANS RISQUE D'ÉCRASEMENT
router.post('/:id/notes', restrictTo(...STAFF_ROLES), studentController.updateStudent);

module.exports = router;