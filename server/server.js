// server/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const notificationRoutes = require('./routes/notificationRoutes');
const app = express();

connectDB();

// 2. Middlewares
app.use(cors());
app.use(express.json()); 

// 3. Importation des Routes
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const planningRoutes = require('./routes/planningRoutes');
const messageRoutes = require('./routes/messageRoutes');



// 4. Déclaration des endpoints API
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/planningProf', planningRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);

// 5. Route de test
app.get('/', (req, res) => {
    res.send("L'API tourne ! 🚀");
});

// 6. Démarrage du serveur
const PORT = process.env.PORT || 5001; 
app.listen(PORT, () => {
    console.log(`
    ==========================================
    🚀 SERVEUR DÉMARRÉ SUR LE PORT : ${PORT}
    📡 ROUTE PLANNING : http://localhost:${PORT}/api/planningProf
    📡 ROUTE ÉLÈVES   : http://localhost:${PORT}/api/students
    ==========================================
    `);
});