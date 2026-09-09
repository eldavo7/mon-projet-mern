//mon-projet-mern/server/models/assiduiteModel.js

const mongoose = require('mongoose');

const assiduiteSchema = new mongoose.Schema({
  profId: { type: String, required: true },
  profNom: { type: String },
  matiere: { type: String },
  classe: { type: String, required: true },
  heure: { type: String, required: true },
  date: { type: Date, default: Date.now },
  eleves: [
    {
      prenom: { type: String }, 
      nom: { type: String },
      eleveId: { type: String, required: true },
      statut: { type: String, enum: ['present', 'retard', 'absent'], default: 'present' }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Assiduite', assiduiteSchema);