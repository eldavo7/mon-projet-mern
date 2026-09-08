# 🚀 Projet MERN — mon-projet-mern

Application web basée sur la stack **MERN**  
(**MongoDB, Express, React, Node.js**)

---

## 📁 Structure du projet

```bash
mon-projet-mern/
├── server/                # Backend (Node.js / Express)
│   ├── config/            # Configuration (base de données)
│   ├── controllers/       # Logique métier (CRUD)
│   ├── models/            # Schémas Mongoose
│   ├── routes/            # Routes de l'API
│   ├── data/              # Données & scripts
│   │   ├── p.py           # Script Python (génération données)
│   │   └── lycee_final.json # Base de données étudiants (≈1800)
│   ├── .env               # Variables d’environnement (⚠️ secret)
│   ├── .gitignore         # Ignore node_modules, .env
│   ├── package.json
│   └── server.js          # Point d’entrée du serveur
│
├── client/                # Frontend (React)
│   ├── src/
│   │   ├── components/    # Composants réutilisables
│   │   │   └── Conditions.jsx
│   │   ├── pages/         # Pages principales
│   │   │   ├── DashboardEtudiant.jsx
│   │   │   ├── DashboardProf.jsx
│   │   │   └── Login.jsx
│   │   ├── api.js         # Configuration API (Axios / Fetch)
│   │   └── App.jsx        # Routing principal
│   ├── package.json
│   └── .env               # Variables d’environnement Frontend
│
└── .gitignore




# ENT Honoré d'Urfé — Espace Enseignant (MERN Stack)

Mise à jour et enrichissement de l'interface de gestion des notes pour les enseignants sur la plateforme ENT.

## Nouvelles Fonctionnalités

* **Gestion complète des notes pour les professeurs** : 
  * Ajout de notes par trimestre avec choix dynamique du barème (sur /20, /10, /5, /40, /100).
  * Modification et mise à jour des notes existantes (valeur, coefficient, appréciation).
  * Suppression de notes directement depuis le relevé de notes de l'élève.
* **Intégration de l'interface de saisie** : Formulaire d'ajout de notes intégré et ergonomique au sein de la vue "Relevé de notes", accessible pour le profil enseignant en mode édition.