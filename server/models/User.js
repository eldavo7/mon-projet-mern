// server/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // Correspond au champ "id_unique" (ex: LYC-0001)
    id_unique: { type: String, required: true },
    
    // Identité
    prenom: { type: String, required: true },
    nom: { type: String, required: true },
    
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    
    role: { 
        type: String, 
        enum: ['etudiant', 'professeur', 'admin'], 
        default: 'etudiant' 
    },
    
    // Informations scolaires & profil
    age: { type: Number },
    genre: { type: String },
    classe: { type: String },
    filiere: { type: String },

    // --- AJOUTS POUR LES NOTES, ABSENCES ET MOTS ---
    notes: {
        T1: { type: Array, default: [] },
        T2: { type: Array, default: [] },
        T3: { type: Array, default: [] }
    },
    absences: { type: Array, default: [] },
    motsParents: { type: Array, default: [] }

}, { 
    timestamps: true,
    strict: false // Garantit que tout champ additionnel envoyé sera accepté en BDD
});

// Target la collection 'etudiants' dans MongoDB
module.exports = mongoose.model('User', userSchema, 'etudiants');