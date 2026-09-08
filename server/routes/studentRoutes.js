// server/routes/studentRoutes.js

const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// 1. RECHERCHE PAR MOT-CLÉ (nom/prénom)
// Placée obligatoirement avant /:id
router.get('/search', studentController.searchStudents);

// 2. RÉCUPÉRATION DE TOUS LES ÉLÈVES (filtrés par classe / rôle)
router.get('/', studentController.getAllStudents);

// 3. RÉCUPÉRATION D'UN ÉLÈVE PAR ID
router.get('/:id', studentController.getStudentById);

// 4. MISE À JOUR D'UN ÉLÈVE (Notes, Absences, Retards, etc.)
router.patch('/:id', studentController.updateStudent);

module.exports = router;