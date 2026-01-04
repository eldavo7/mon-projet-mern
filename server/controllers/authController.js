// server/controllers/authController.js

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // 1. Vérifier si l'utilisateur existe déjà
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "Cet utilisateur existe déjà" });

        // 2. Crypter le mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Créer l'utilisateur
        user = new User({
            name,
            email,
            password: hashedPassword,
            role // 'etudiant' ou 'professeur'
        });

        await user.save();
        res.status(201).json({ message: "Utilisateur créé avec succès !" });

    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Vérifier si l'utilisateur existe
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Identifiants invalides" });

        // 2. Vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Identifiants invalides" });

        // 3. Créer le Token JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' } // Le token expire après 24h
        );

        res.json({
            token,
            user: { id: user._id, name: user.name, role: user.role }
        });

    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};