// server/controllers/authController.js

const User = require('../models/User'); 
const Prof = require('../models/Prof'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { id_unique, prenom, nom, email, password, role, age, genre, classe, matiere, classes } = req.body;

        // 1. Vérifier si l'utilisateur existe déjà (Check sur les deux collections)
        const existingUser = await User.findOne({ email }) || await Prof.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Cet utilisateur existe déjà" });
        }

        // 2. Hashage du mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let newUser;
        
        // 3. Logique de tri selon le rôle (correspondance avec tes scripts Python)
        if (role === 'prof' || role === 'admin') {
            newUser = new Prof({
                id_unique,
                prenom,
                nom,
                email,
                password: hashedPassword,
                role: role,
                matiere,
                classes: classes || [] // Utilise 'classes' (pluriel) du script Python
            });
        } else {
            newUser = new User({
                id_unique,
                prenom,
                nom,
                email,
                password: hashedPassword,
                role: 'etudiant',
                age,
                genre,
                classe // 'classe' (singulier) pour l'étudiant
            });
        }

        await newUser.save();
        res.status(201).json({ success: true, message: "Utilisateur créé avec succès !" });

    } catch (error) {
        console.error("Erreur Register:", error);
        res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Debug pour voir ce qui arrive au serveur
        console.log("Tentative de login pour :", email);

        // 1. Recherche croisée (Etudiants d'abord, puis Profs)
        let user = await User.findOne({ email });
        let userType = 'student';

        if (!user) {
            user = await Prof.findOne({ email });
            userType = 'prof';
        }

        // Si l'utilisateur n'existe dans aucune des deux collections
        if (!user) {
            console.log("Utilisateur non trouvé dans les collections etudiants/profs");
            return res.status(400).json({ success: false, message: "Identifiants invalides" });
        }

        // 2. Vérification Bcrypt (Compare le texte clair avec le hash de la DB)
        const isMatch = (password === user.password) || await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Mot de passe incorrect pour :", email);
            return res.status(400).json({ success: false, message: "Identifiants invalides" });
        }

        // 3. Création du Token JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'votre_cle_secrete_temporaire',
            { expiresIn: '24h' }
        );

        // 4. Construction de la réponse (Nettoyage pour ne pas renvoyer le password)
        const userData = {
            id: user._id,
            id_unique: user.id_unique,
            prenom: user.prenom,
            nom: user.nom,
            role: user.role,
            email: user.email
        };

        // Ajout des infos spécifiques selon le type
        if (userType === 'student') {
            userData.classe = user.classe;
            userData.age = user.age;
            userData.genre = user.genre;
        } else {
            userData.matiere = user.matiere;
            userData.classes = user.classes; // On renvoie bien le tableau des classes du prof
        }

        console.log(`Login réussi : ${userData.prenom} ${userData.nom} (${user.role})`);
        
        res.json({
            success: true,
            token,
            user: userData
        });

    } catch (error) {
        console.error("Erreur Login Controller:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
};