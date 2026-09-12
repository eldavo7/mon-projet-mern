// server/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const notificationRoutes = require('./routes/notificationRoutes');
const app = express();

connectDB();

// 2. Middlewares (CORS ouvert pour autoriser localhost ET ton téléphone)
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json()); 

// 3. Importation des Routes
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const planningRoutes = require('./routes/planningRoutes');
const messageRoutes = require('./routes/messageRoutes');
const assiduiteRoutes = require('./routes/assiduiteRoutes');

// 4. Déclaration des endpoints API
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/eleves', studentRoutes); // Alias en français pour correspondre au front-end
app.use('/api/planning', planningRoutes);
app.use('/api/planningProf', planningRoutes); // Alias legacy (front historique)

app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/assiduite', assiduiteRoutes);


// 5. Route de test
app.get('/', (req, res) => {
    res.send("L'API tourne ! 🚀");
});

// 6. 404 pour toute route API inconnue
app.use('/api', (req, res) => {
    res.status(404).json({ success: false, message: `Route API introuvable : ${req.method} ${req.originalUrl}` });
});

// 7. Gestionnaire d'erreurs global (filet de sécurité pour toute erreur non gérée)
app.use((err, req, res, next) => {
    console.error("🔥 Erreur non gérée :", err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Erreur interne du serveur"
    });
});

// 6. Démarrage du serveur sur 0.0.0.0 (Accessible depuis Mac et Téléphone)
const PORT = process.env.PORT || 5001; 
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
    console.log(`
    ==========================================
    🚀 SERVEUR DÉMARRÉ SUR LE PORT : ${PORT}
    💻 MAC (Local)   : http://localhost:${PORT}/api
    📱 TÉLÉPHONE (IP) : http://192.168.1.95:${PORT}/api
    ==========================================
    `);
});