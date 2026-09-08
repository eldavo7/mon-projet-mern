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

### Commit / Branch: modif_5

## 🚀 Modifications effectuées

* **Layout & Navigation Dynamique :**
  * Intégration du composant réutilisable `Navbar` dans `DashboardEtudiant.jsx` et `DashboardProf.jsx`.
  * Prise en charge automatique du rôle utilisateur (Enseignant / Élève) pour adapter les liens et les styles.

* **Responsivité & UX Mobile :**
  * Ajout d'un menu déroulant mobile (`Dropdown`) dans la `Navbar` pour remplacer la navigation masquée sur petits écrans.
  * Harmonisation des en-têtes (titres `h1` sur une seule ligne) et correction de la sémantique HTML (`<p>`/`<h1>`).

* **Routage React Router :**
  * Configuration des sous-routes emboîtées (`<Outlet />`) dans `App.jsx` pour l'espace Étudiant (`planning`, `messagerie`).
  * Nettoyage des imports obsolètes (`VuePlanning`).