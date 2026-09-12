# Procédure MongoDB / Mongoose — mon-projet-mern

Ce document explique comment configurer, alimenter et faire fonctionner la base
MongoDB de ce projet, du démarrage local jusqu'aux opérations de maintenance.

---

## 1. Prérequis

- Node.js 18+ (le projet utilise Express 5 / Mongoose 9)
- Un serveur MongoDB accessible : soit **local**, soit **MongoDB Atlas** (cloud, gratuit en Free Tier)
- `mongosh` (le shell MongoDB) et/ou MongoDB Compass pour inspecter la base visuellement

---

## 2. Configurer la connexion (`.env`)

Le backend lit la variable `MONGO_URI` (voir `server/config/db.js`). Copie le
fichier fourni et remplis-le :

```bash
cd server
cp .env.example .env
```

### Option A — MongoDB local (le plus simple pour développer)

1. Installe MongoDB Community Server (via Homebrew sur Mac : `brew install mongodb-community`)
2. Démarre le service : `brew services start mongodb-community`
3. Dans `.env` :
   ```
   MONGO_URI=mongodb://127.0.0.1:27017/mon-projet-mern
   ```

### Option B — MongoDB Atlas (cloud, pratique pour accéder depuis plusieurs appareils)

1. Crée un cluster gratuit sur https://www.mongodb.com/cloud/atlas
2. Dans "Database Access", crée un utilisateur avec mot de passe
3. Dans "Network Access", autorise ton IP (ou `0.0.0.0/0` en dev uniquement — jamais en prod)
4. Récupère la chaîne de connexion ("Connect" → "Drivers") et colle-la dans `.env` :
   ```
   MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/mon-projet-mern?retryWrites=true&w=majority
   ```

### Le secret JWT

Génère une vraie valeur aléatoire (ne garde jamais la valeur par défaut du `.env.example`) :

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Colle le résultat dans `JWT_SECRET=` du `.env`.

---

## 3. Démarrer le backend

```bash
cd server
npm install
npm run dev      # nodemon, redémarre automatiquement
# ou : npm start
```

Tu dois voir dans la console : `✅ MongoDB Connecté` puis le message de démarrage
du serveur. Si tu vois `❌ Erreur de connexion`, vérifie `MONGO_URI` (identifiants,
IP whitelist sur Atlas, ou service MongoDB local bien lancé).

---

## 4. Les collections du projet

Mongoose "renomme" certains modèles vers des noms de collection spécifiques.
Voici la correspondance réelle en base (utile pour chercher dans Compass) :

| Modèle Mongoose (`server/models/`) | Collection MongoDB réelle | Contenu |
|---|---|---|
| `User.js`                | `etudiants`    | Élèves (identité, notes T1/T2/T3, absences, mots des parents) |
| `Prof.js`                | `profs`        | Professeurs / admin / staff |
| `Message.js`             | `messages`     | Messagerie interne |
| `Notification.js`        | `notifications`| Notifications (nouveau message, note, retard...) |
| `assiduiteModel.js`      | `assiduites`   | Historique des appels de classe (source de vérité de l'assiduité) |
| `Planning.js`            | `planningProf` | Emploi du temps (document unique, schéma libre `strict: false`) |

Points d'attention :
- `User` et `Prof` sont deux collections **séparées** : le login (`authController.js`)
  cherche l'email dans les deux avant de refuser.
- `absences` (dans `etudiants`) est maintenant **synchronisé automatiquement**
  depuis `assiduites` à chaque appel (voir section 6) — ce n'était pas le cas avant.

---

## 5. Importer des données existantes

Le `readMe.md` d'origine fait référence à un script `server/data/p.py` +
`lycee_final.json` (~1800 élèves) qui **n'est pas présent dans cette archive**
(probablement non commité / gitignored). Deux façons de repeupler la base :

### A. Tu as toujours ce script Python
Relance-le tel quel, en pointant sur ta base (local ou Atlas) via ses propres
paramètres de connexion.

### B. Tu as un export JSON d'élèves (`lycee_final.json`)
Utilise `mongoimport` directement (fourni avec MongoDB Database Tools) :

```bash
mongoimport --uri "mongodb://127.0.0.1:27017/mon-projet-mern" \
  --collection etudiants \
  --file lycee_final.json \
  --jsonArray
```

Pour Atlas, remplace `--uri` par ta chaîne `mongodb+srv://...`.

⚠️ Vérifie que chaque document importé a bien un champ `password` — soit déjà
haché en bcrypt (`$2a$...` / `$2b$...`), soit en clair. Dans ce dernier cas,
**le premier login de chaque élève migrera automatiquement son mot de passe
vers bcrypt** (voir `authController.js`) : rien à faire manuellement, mais tant
qu'un élève ne s'est jamais connecté, son mot de passe reste en clair en base.

### C. Créer un compte manuellement (test rapide)

Utilise la route d'inscription plutôt que d'insérer directement en base (pour
profiter du hachage bcrypt) :

```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "id_unique": "LYC-0001",
    "prenom": "Camille",
    "nom": "Martin",
    "email": "camille.martin@example.com",
    "password": "motdepasse123",
    "role": "etudiant",
    "classe": "Terminale A"
  }'
```

---

## 6. Migration : rattraper l'historique d'assiduité

Avant ce correctif, faire l'appel (`LancerAppel.jsx`) n'écrivait que dans
`assiduites`, jamais dans `etudiants.absences`. C'est corrigé pour les
**nouveaux** appels, mais l'historique déjà en base ne l'est pas automatiquement.
Lance une fois :

```bash
cd server
npm run migrate:absences
```

Le script (`server/scripts/syncAbsencesFromAssiduite.js`) est idempotent : tu
peux le relancer sans créer de doublons.

---

## 7. Requêtes utiles (mongosh ou onglet "Filtre" de Compass)

Ouvrir le shell :
```bash
mongosh "mongodb://127.0.0.1:27017/mon-projet-mern"
# ou pour Atlas :
mongosh "mongodb+srv://<user>:<password>@<cluster>.mongodb.net/mon-projet-mern"
```

```js
// Tous les élèves d'une classe
db.etudiants.find({ classe: "Terminale A" })

// Recherche insensible à la casse sur le prénom
db.etudiants.find({ prenom: { $regex: "corinne", $options: "i" } })

// Élèves ayant au moins une absence non justifiée
db.etudiants.find({ "absences.justified": false })

// Historique d'appel d'une classe à une date donnée
db.assiduites.find({ classe: "Terminale A", date: { $gte: ISODate("2026-09-01") } })

// Compter les messages non lus d'un utilisateur
db.messages.countDocuments({ destinataire: ObjectId("..."), lu: false })

// Vérifier qu'un mot de passe est bien haché (doit commencer par $2)
db.etudiants.find({ password: { $not: /^\$2/ } }, { email: 1 })
```

---

## 8. Index recommandés

Le schéma Mongoose crée déjà un index unique sur `email` (`etudiants` et
`profs`) et un index simple sur `id_unique`. Pour de meilleures performances
sur les recherches fréquentes, tu peux ajouter (une fois, via `mongosh`) :

```js
// Recherche/tri par classe très fréquent (GestionEleves.jsx, LancerAppel.jsx)
db.etudiants.createIndex({ classe: 1 })

// Recherche par nom/prénom (SearchBar.jsx)
db.etudiants.createIndex({ nom: 1, prenom: 1 })

// Historique d'assiduité filtré par classe + date (DashboardProf.jsx)
db.assiduites.createIndex({ classe: 1, date: -1 })

// Boîte de réception / envoyés (messageController.js)
db.messages.createIndex({ destinataire: 1, createdAt: -1 })
db.messages.createIndex({ expediteur: 1, createdAt: -1 })

// Notifications d'un utilisateur, triées par date
db.notifications.createIndex({ userId: 1, createdAt: -1 })
```

---

## 9. Sauvegarde et restauration

```bash
# Sauvegarde complète de la base
mongodump --uri "mongodb://127.0.0.1:27017/mon-projet-mern" --out ./backup

# Restauration
mongorestore --uri "mongodb://127.0.0.1:27017/mon-projet-mern" ./backup/mon-projet-mern
```

Pour Atlas, remplace l'`--uri` par ta chaîne `mongodb+srv://...` — Atlas propose
aussi des sauvegardes automatiques dans son interface (payant au-delà du Free Tier).

---

## 10. Checklist avant mise en prod

- [ ] `JWT_SECRET` changé pour une vraie valeur aléatoire (jamais celle du `.env.example`)
- [ ] `MONGO_URI` pointe vers une base de prod distincte de la base de dev
- [ ] Whitelist Atlas restreinte (pas `0.0.0.0/0`) une fois l'IP du serveur de prod connue
- [ ] `cors({ origin: '*' })` dans `server.js` restreint à ton vrai domaine frontend
- [ ] `npm run migrate:absences` exécuté au moins une fois sur la base de prod
- [ ] Tous les mots de passe migrés vers bcrypt (vérifiable avec la requête de la section 7)
