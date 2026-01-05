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

## 🎨 Frontend — Évolutions

### ➕ Ajouts
- `client/src/components/Conditions.jsx`
- `client/src/pages/DashboardEtudiant.jsx`
- `client/src/pages/DashboardProf.jsx`
- `client/src/api.js`

### 🔁 Modifications
- `Dashboard.jsx` → `DashboardEtudiant.jsx`
- `client/src/App.jsx`
- `client/src/pages/Login.jsx`
- `client/src/components/Conditions.jsx`

---

## 🧠 Backend — Évolutions

### ➕ Ajouts
- Script Python pour générer une base de données de ~1800 étudiants :
  - `../data/p.py`
  - `../data/lycee_final.json`
  - `../data/prof.py`
  - `../data/profs_final.json`


---

## 🏷️ Version
- **v1.0** — Première version du projet sur GitHub

---

## 🛠️ À faire (Roadmap)
- Finaliser la logique **backend**
- Implémenter :
  - Professeurs
- Gestion des rôles & permissions
- Connexion Frontend ↔ Backend

---

## 📌 Technologies utilisées
- **Frontend** : React
- **Backend** : Node.js, Express
- **Base de données** : MongoDB
- **Scripts** : Python (génération de données)


## J'ai reussi a connecter professeurs et etudiants donc 1940 utilisateurs 
## deux urls possible pour l'instant :
- **DashboardEtudiant.jsx`**
- **DashboardProf.jsx`**


