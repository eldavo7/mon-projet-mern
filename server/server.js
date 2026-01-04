// server/server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
const authRoutes = require('./routes/authRoutes');

// Connexion BDD
connectDB();

// Middlewares
app.use(cors());
app.use(express.json()); // Permet de lire le JSON dans les requêtes (req.body)

app.use('/api/auth', authRoutes);

// Route de test
app.get('/', (req, res) => {
    res.send("L'API tourne ! 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));