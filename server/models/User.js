// server/models/User.js
const mongoose = require('mongoose');

// Sous-schéma détaillé pour la structure d'une note
const noteItemSchema = new mongoose.Schema({
    matiere: { type: String, required: true },
    note: { type: Number, required: true },
    bareme: { type: Number, default: 20 },
    coef: { type: Number, default: 1 },
    appreciation: { type: String, default: '' },
    professeur: { type: String, default: '' },
    date: { type: String, default: () => new Date().toISOString().split('T')[0] }
}, { _id: true });

const userSchema = new mongoose.Schema({
    // Identifiant unique personnalisé (ex: LYC-0001)
    id_unique: { type: String, required: true, index: true },
    
    // Identité
    prenom: { type: String, required: true },
    nom: { type: String, required: true },
    
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    
    role: { 
        type: String, 
        enum: ['etudiant', 'professeur', 'admin', 'eleve'], 
        default: 'etudiant' 
    },
    
    // Informations scolaires & profil
    age: { type: Number },
    genre: { type: String },
    classe: { type: String },
    filiere: { type: String },

    // --- RELEVÉ DE NOTES TRIMESTRIEL ---
    // Inclus le support des formats "T1/T2/T3" et "Trimestre 1/2/3"
    notes: {
        T1: { type: [noteItemSchema], default: [] },
        T2: { type: [noteItemSchema], default: [] },
        T3: { type: [noteItemSchema], default: [] },
        "Trimestre 1": { type: Array, default: [] },
        "Trimestre 2": { type: Array, default: [] },
        "Trimestre 3": { type: Array, default: [] }
    },

    // --- VIE SCOLAIRE & CORRESPONDANCE ---
    absences: { type: Array, default: [] },
    motsParents: { type: Array, default: [] }

}, { 
    timestamps: true,
    strict: false // Accepte les champs additionnels dynamiques sans rejet Mongoose
});

// Ciblage explicite de la collection 'etudiants' dans MongoDB
module.exports = mongoose.model('User', userSchema, 'etudiants');