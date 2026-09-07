// server/models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    expediteur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    destinataire: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sujet: {
        type: String,
        required: true,
        trim: true
    },
    contenu: {
        type: String,
        required: true
    },
    lu: {
        type: Boolean,
        default: false
    },
    typeMessage: {
        type: String,
        enum: ['DIRECT', 'SYSTEME_ABSENCE', 'NOTIFICATION'],
        default: 'DIRECT'
    }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);