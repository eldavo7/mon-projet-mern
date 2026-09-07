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

- Script Python pour générer une base de données de ~140 profs :
  - `../data/profs.py`...



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


-- jai push sur github --

- Je m'occupe de DashboardProf et la searchBar -> qui me permet 
de chercher n'importe quel eleve 

- Ajous de la page info de l'eleve :

- /server/routes/studentRoutes.js                   ** Back **
- mise a jours /client/pages/DashboardProf.jsx      ** Client **
- creation de la fiche info etudiant                ** Client **
// client/src/pages/ProfilEtudiant.jsx




systeme de filtre et creation route http://localhost:5173/gestion-eleves
- Mise a jour du backend :
- /server/server.js
- creation :
- /server/routes/studentRoutes.js

- Mise a jour du frontend:
- creation :
- /components/SearchBar.jsx
-    ici cest la logique de la bare de recherche etudiant
- /pages/GestionEleve.jsx
- ici j'ai la bar de recherche et une table connecte a la database

- FRONTEND
- Jai change les url donc mise a jour de App.jsx et Dashboard.jsx
- Creation de PlanningSemaine 
- routes Outlet





- J'ai cree un planning prof et eleve grace a un script python



- Mainteneant que le planning prof est ok 
- je passe a la data base des eleves du prof connecte, 
ici j'ai un probleme pour recuperer les 80 eleves environ 
ce probleme vient surement du fait des nom des classes : 1er ES 3 , ou 1ERE ES3 ... (les espaces .. differt)

### ➕ Ajouts
- `client/src/components/GirdPlanning.jsx`
- `client/src/pages/PlanningProf.jsx`

### 🔁 Modifications
- `client/src/pages/DashboardProf.jsx`





A FAIRE   
Il faut mettre l'api de plannigProf.jsx ou dashboardProf.jsx dans le fichier /client/api.js


Probleme a resoudre :
- il faut savoir sur quel route ou Outlet est le site de base (normalement c Login.jsx pour se connecter)
quand je lance mon server mongosCompass et que japplique les cmd : 
- node server.js 
-npm run dev 

mon site s'ouvre bien mais me lance sur un dashboard prof normalement cest Login.jsx






## Mise à jour du composant Navbar & de la Messagerie ENT

* **Optimisation du composant Navbar (`Navbar.jsx`)** : 
  * Ajout de la gestion dynamique des rôles (Enseignant / Étudiant) avec menus déroulants et routes adaptées.
  * Fermeture automatique du menu lors d'un clic en dehors du composant via un hook React (`useEffect` & `useRef`).
  * Sécurisation de la déconnexion et nettoyage propre de `localStorage`.

* **Refonte de la vue Messagerie (`Messagerie.jsx`)** :
  * Intégration de balises `<optgroup>` dans la sélection des destinataires pour catégoriser clairement les enseignants et les élèves.
  * Normalisation et nettoyage du format d'affichage des noms de contacts et de l'historique des messages.
  * Résolution des problèmes de duplication du composant Navbar sur la route `/DashboardProf/messagerie`.