// server/controllers/messageController.js

const Message = require('../models/Message');

// Tentatives de chargement dynamique des modèles
let Etudiant, Prof, User;

try { Etudiant = require('../models/etudiantModel'); } catch (e) {
  try { Etudiant = require('../models/Eleve'); } catch (e2) {}
}

try { Prof = require('../models/profModel'); } catch (e) {
  try { Prof = require('../models/Professeur'); } catch (e2) {
    try { Prof = require('../models/Prof'); } catch (e3) {}
  }
}

try { User = require('../models/User'); } catch (e) {
  try { User = require('../models/userModel'); } catch (e2) {}
}

// Helper pour vérifier si un utilisateur est professeur
const checkIsProf = (u) => {
  if (!u) return false;
  if (u.matiere) return true;
  if (u.role) {
    const roleLower = String(u.role).toLowerCase();
    return roleLower.includes('prof') || roleLower.includes('enseignant');
  }
  return false;
};

// Helper pour retrouver un utilisateur dans n'importe quelle collection
const findUserById = async (id) => {
  if (!id) return null;

  if (Prof) {
    const prof = await Prof.findById(id, 'nom prenom matiere role email').lean();
    if (prof) return { ...prof, isProf: true };
  }

  if (Etudiant) {
    const etudiant = await Etudiant.findById(id, 'nom prenom classe role email').lean();
    if (etudiant) return { ...etudiant, isProf: false };
  }

  if (User) {
    const user = await User.findById(id, 'nom prenom role classe matiere email').lean();
    if (user) {
      return { ...user, isProf: checkIsProf(user) };
    }
  }

  return null;
};

// @desc Envoyer un message
exports.sendMessage = async (req, res) => {
  try {
    const { destinataire, sujet, contenu, expediteur: bodyExpediteur } = req.body;
    const expediteur = req.user?._id || req.user?.id || bodyExpediteur;

    if (!expediteur || !destinataire || !contenu) {
      return res.status(400).json({
        success: false,
        message: "L'expéditeur, le destinataire et le contenu sont requis."
      });
    }

    const newMessage = new Message({
      expediteur,
      destinataire,
      sujet: sujet || 'Sans objet',
      contenu
    });

    await newMessage.save();
    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    console.error("Erreur d'envoi du message :", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Obtenir les messages d'un utilisateur
exports.getMessages = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId || userId === 'undefined') {
      return res.status(400).json({ success: false, message: "ID utilisateur invalide." });
    }

    const [recusRaw, envoyesRaw] = await Promise.all([
      Message.find({ destinataire: userId }).sort({ createdAt: -1 }).lean(),
      Message.find({ expediteur: userId }).sort({ createdAt: -1 }).lean()
    ]);

    const formatUser = (u) => {
      if (!u) return { nom: 'Inconnu', prenom: '' };
      return {
        _id: u._id,
        nom: u.nom,
        prenom: u.prenom,
        label: u.isProf 
          ? `Prof. ${u.prenom || ''} ${u.nom || ''}`.trim()
          : `${u.prenom || ''} ${u.nom || ''}`.trim()
      };
    };

    const recus = await Promise.all(
      recusRaw.map(async (msg) => ({
        ...msg,
        expediteur: formatUser(await findUserById(msg.expediteur))
      }))
    );

    const envoyes = await Promise.all(
      envoyesRaw.map(async (msg) => ({
        ...msg,
        destinataire: formatUser(await findUserById(msg.destinataire))
      }))
    );

    res.status(200).json({ success: true, recus, envoyes });
  } catch (error) {
    console.error("Erreur récupération messages :", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Obtenir la liste complète et unifiée de TOUS les destinataires (Profs + Élèves)
exports.getDestinataires = async (req, res) => {
  try {
    const currentUserId = req.query.userId || req.user?._id || req.user?.id;
    const contactsMap = new Map();

    if (Prof) {
      const profsList = await Prof.find({}, 'nom prenom matiere role').lean();
      profsList.forEach(p => {
        const idStr = p._id.toString();
        contactsMap.set(idStr, {
          _id: idStr,
          type: 'PROF',
          role: p.role || 'prof',
          matiere: p.matiere,
          label: `${p.prenom || ''} ${p.nom || ''}`.trim()
        });
      });
    }

    if (Etudiant) {
      const etudiantsList = await Etudiant.find({}, 'nom prenom classe role').lean();
      etudiantsList.forEach(e => {
        const idStr = e._id.toString();
        if (!contactsMap.has(idStr)) {
          contactsMap.set(idStr, {
            _id: idStr,
            type: 'ÉLÈVE',
            role: e.role || 'eleve',
            classe: e.classe,
            label: `${e.prenom || ''} ${e.nom || ''}`.trim()
          });
        }
      });
    }

    if (User) {
      const usersList = await User.find({}, 'nom prenom role classe matiere').lean();
      usersList.forEach(u => {
        const idStr = u._id.toString();
        if (!contactsMap.has(idStr)) {
          const isProf = checkIsProf(u);
          contactsMap.set(idStr, {
            _id: idStr,
            type: isProf ? 'PROF' : 'ÉLÈVE',
            role: u.role,
            matiere: u.matiere,
            classe: u.classe,
            label: `${u.prenom || ''} ${u.nom || ''}`.trim()
          });
        }
      });
    }

    let contacts = Array.from(contactsMap.values());

    if (currentUserId) {
      contacts = contacts.filter(c => c._id !== currentUserId.toString());
    }

    res.status(200).json({ success: true, data: contacts });
  } catch (error) {
    console.error("Erreur récupération destinataires :", error);
    res.status(500).json({ success: false, message: error.message });
  }
};