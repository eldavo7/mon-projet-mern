// server/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // Correspond au champ "id_unique" (ex: LYC-0001)
    id_unique: { type: String, required: true },
    
    // On remplace 'name' par 'prenom' et 'nom'
    prenom: { type: String, required: true },
    nom: { type: String, required: true },
    
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    
    role: { 
        type: String, 
        enum: ['etudiant', 'professeur', 'admin'], 
        default: 'etudiant' 
    },
    
    // Champs supplémentaires de tes 1800 étudiants
    age: { type: Number },
    genre: { type: String },
    classe: { type: String },
    filiere: { type: String } // Si présent dans ton JSON Python
}, { timestamps: true });

// 'etudiants' avec un "s" pour correspondre exactement à Compass
module.exports = mongoose.model('User', userSchema, 'etudiants');