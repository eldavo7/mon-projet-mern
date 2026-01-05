// server/models/Prof.js
const mongoose = require('mongoose');

const profSchema = new mongoose.Schema({
    id_unique: { type: String, required: true, unique: true },
    prenom: { type: String, required: true },
    nom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Attention : doit être haché !
    role: { 
        type: String, 
        // On harmonise : 'prof' pour correspondre au controller
        enum: ['prof', 'admin', 'surveillant', 'direction', 'technique'], 
        default: 'prof' 
    },
    matiere: { type: String },
    classes: [{ type: String }] // On utilise 'classes' pour simplifier
}, { timestamps: true });

module.exports = mongoose.model('Prof', profSchema, 'profs');