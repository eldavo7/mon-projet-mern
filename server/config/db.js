// server/config/db.js

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connecté");
    } catch (err) {
        console.error("❌ Erreur de connexion:", err.message);
        process.exit(1);
    }
};

module.exports = connectDB;