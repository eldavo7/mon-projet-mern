// server/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');

// Connexion BDD
connectDB();

// Middlewares
app.use(cors());
app.use(express.json()); 

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes); // Cette ligne doit correspondre au fichier ci-dessous

// Route de test
app.get('/', (req, res) => {
    res.send("L'API tourne ! 🚀");
});

// Utilise 5001 pour correspondre à tes appels fetch frontend
const PORT = process.env.PORT || 5001; 
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));