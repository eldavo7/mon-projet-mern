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




# Documentation des modifications - Branche `modif_11`

## 📋 Récapitulatif des interventions

### 1. Correction UI & Layout (Messagerie & Navigation)
* **Résolution des doublons de Navbar** : Suppression du composant `<Navbar />` dans `Messagerie.jsx` pour éviter la double barre de navigation générée par le layout parent.
* **Optimisation Mobile** : Amélioration du design responsive pour le confort de lecture et de saisie sur smartphone.

### 2. Configuration Réseau Multi-Appareils (Développement Cross-Device)
* **Configuration Serveur Express (`server.js`)** : Passage de l'écoute réseau sur `0.0.0.0` pour permettre les connexions entrantes depuis le réseau local Wi-Fi.
* **Plage CORS ouverte** : Autorisation des requêtes originaires du Mac et du smartphone (`*`).
* **Dynamisation des URLs Client (`api.js` & `Messagerie.jsx`)** : Replacement de `localhost` par `window.location.hostname` dans la configuration de base d'Axios, basculant automatiquement les appels API vers `http://192.168.1.95:5001/api` lorsqu'on navigue depuis un appareil mobile.

### 3. Base de Données MongoDB & Unification de l'Assiduité
* **Consultation Compass** : Utilisation des filtres de recherche JSON (ex: `{ "prenom": "corinne" }` ou via `$regex`) pour interroger les 1800+ étudiants.
* **Architecture Assiduité (En cours)** : Analyse de la désynchronisation entre la collection `assiduites` (enregistrée par `LancerAppel.jsx`) et le champ `absences` (dans `etudiants`). Préparation de la centralisation de la source de vérité sur la collection unique `assiduites`.

---

## 🛠 Procédure de test sur Smartphone (Honor / Android)

1. **Activer le mode Développeur** : `Paramètres` > `À propos du téléphone` > Appuyer 7 fois sur `Numéro de build`.
2. **Activer le Débogage USB** : `Paramètres` > `Système & mises à jour` > `Options pour les développeurs` > `Débogage USB`.
3. **Accès Frontend** : Ouvrir `http://192.168.1.95:5173` sur le navigateur mobile.
4. **Inspection Chrome** : Connecter le téléphone en USB sur Mac et ouvrir `chrome://inspect/#devices` sur Chrome Mac.