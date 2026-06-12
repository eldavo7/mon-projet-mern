require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const mongoose = require('mongoose');

const app = express();

// 1. Connexion BDD
connectDB();

// 2. Middlewares
app.use(cors());
app.use(express.json()); 



// 3. Définition des routes API (AVANT les autres imports si possible pour tester)
/*
app.get('/api/planningProf', async (req, res) => {
    console.log("📢 Requête reçue sur /api/planningProf"); // Log pour vérifier le passage
    try {
        const planning = await mongoose.connection.db.collection('planningProf').find({}).toArray();
        
        if (!planning || planning.length === 0) {
            console.log("❌ Collection 'planningProf' vide ou introuvable.");
            return res.status(404).json({ message: "Base de données vide." });
        }
        
        console.log("✅ Données de planning envoyées au client.");
        res.json(planning[0]); 
    } catch (error) {
        console.error("🔥 Erreur serveur planning:", error);
        res.status(500).json({ message: "Erreur interne serveur" });
    }
});
*/

app.get('/api/planningProf', async (req, res) => {
    console.log("📢 Requête reçue sur /api/planningProf");
    try {
        // Sécurité : si Mongoose n'est pas encore prêt, on renvoie une erreur propre plutôt que de crasher
        if (!mongoose.connection.db) {
            console.log("⏳ Base de données en cours de connexion, réessaye dans un instant...");
            return res.status(503).json({ message: "Base de données en cours de connexion. Réessaye." });
        }

        const planning = await mongoose.connection.db.collection('planningProf').find({}).toArray();
        
        if (!planning || planning.length === 0) {
            console.log("❌ Collection 'planningProf' vide ou introuvable.");
            return res.status(404).json({ message: "Base de données vide." });
        }
        
        console.log("✅ Données de planning envoyées au client.");
        res.json(planning[0]); 
    } catch (error) {
        console.error("🔥 Erreur serveur planning:", error);
        res.status(500).json({ message: "Erreur interne serveur" });
    }
});

// 4. Autres Routes
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);

// 5. Route de test
app.get('/', (req, res) => {
    res.send("L'API tourne ! 🚀");
});

// 6. Démarrage
const PORT = process.env.PORT || 5001; 
app.listen(PORT, () => {
    console.log(`
    ==========================================
    🚀 SERVEUR DÉMARRÉ SUR LE PORT : ${PORT}
    📡 ROUTE ACTIVE : http://localhost:${PORT}/api/planningProf
    ==========================================
    `);
});