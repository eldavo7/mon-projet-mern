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

# Gestion des Notes - Espace Professeur

## Nouvelles Fonctionnalités (Mise à jour - modif_6)
Cette version apporte des améliorations majeures dans la gestion du suivi des élèves par les enseignants :
- **Modification des notes :** Les professeurs peuvent désormais éditer une note existante (matière, valeur, coefficient, appréciation) directement depuis le tableau du relevé de notes.
- **Changement de trimestre :** Possibilité de réassigner une note d'un trimestre à un autre lors de sa modification.
- **Suppression des notes :** Ajout d'un bouton de suppression rapide pour chaque ligne de note.
- **Sécurité et Synchronisation :** Toutes les modifications (ajout, modification, suppression) sont immédiatement sauvegardées et synchronisées via l'API REST (`PATCH`).

## Technologies Utilisées
- **Frontend :** React.js (JSX, Hooks useState)
- **Backend :** Node.js / Express
- **Style :** Tailwind CSS