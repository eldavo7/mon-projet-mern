const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['etudiant', 'professeur', 'admin'], 
        default: 'etudiant' 
    },
    classe: { type: String },
    filiere: { type: String }
}, { timestamps: true });

// CORRECTION : 'etudiants' avec un "s" pour correspondre exactement à Compass
module.exports = mongoose.model('User', userSchema, 'etudiants');