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

# Documentation - Mise à jour du Planning Professeur (`PlanningProf.jsx`)

## Résumé des changements
Ce correctif aligne la page **PlanningProf** sur le même modèle ergonomique que la page **PlanningEtudiant**.

### 1. Vue Ordinateur (PC / Grand Écran)
- Restauration de la grille complète via le composant `GridPlanning`.
- Ajout d'un conteneur avec un défilement horizontal fluide (`overflow-x-auto`) et une largeur contrôlée pour garantir un affichage propre, lisible et non compressé sur tous les moniteurs.

### 2. Vue Mobile & Tablette
- Bascule automatique sur un affichage en **cartes verticales** optimisé pour les petits écrans dès que la largeur passe sous le seuil `lg`.
- Affichage explicite de la classe (`ev.classe`), du jour, de l'horaire avec icône d'horloge et de la matière/salle associée.

## Commandes Git utilisées pour la livraison
Pour versionner et envoyer ces modifications sur la branche `modif_10`, exécutez les commandes suivantes dans votre terminal :

```bash
# Création et bascule sur la nouvelle branche
git checkout -b modif_10

# Vérification des fichiers modifiés
git status

# Ajout du fichier source mis à jour
git add client/src/pages/PlanningProf.jsx

# Validation du commit
git commit -m "feat(planning): harmonisation de la vue PC et mobile pour les professeurs"

# Envoi de la branche sur le dépôt distant
git push origin modif_10