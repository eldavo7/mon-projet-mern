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


# ENT Honoré d'Urfé - Mise à jour du Système de Notifications

Ce projet intègre les dernières améliorations de l'interface utilisateur et de la gestion des notifications pour l'Espace Numérique de Travail (ENT).

## 🚀 Fonctionnalités implémentées
- **Centre de notifications stylé et aéré** : Design épuré avec un espacement optimisé entre le titre, le compteur et le bouton "Tout marquer comme lu".
- **Fermeture au clic extérieur** : Le panneau des notifications se ferme automatiquement dès que l'utilisateur clique en dehors de la zone (`useRef` & écouteur d'événements).
- **Marquage automatique comme lu** : Lorsqu'un utilisateur clique sur une notification spécifique, celle-ci passe automatiquement en statut "lu" et déclenche une redirection intelligente vers la page concernée (notes, vie scolaire ou messagerie).
- **Sécurité et robustesse backend** : Ajout de blocs `try/catch` dans le contrôleur étudiant (`studentController.js`) pour sécuriser la création des notifications sans bloquer les requêtes principales.