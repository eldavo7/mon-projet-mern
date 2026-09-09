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


➜  client git:(modif_8) ✗ npm run dev -- --host

> client@0.0.0 dev
> vite --host


  VITE v7.3.0  ready in 150 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.95:5173/
  ➜  press h + enter to show help



# 🚀 Projet d'Application Scolaire - MERN Stack & Architecture Réseau

Ce document résume les fonctionnalités développées, la structuration des composants backend (Node.js/Express/MongoDB) et la configuration nécessaire pour accéder à l'application depuis un appareil mobile.

---

## 📋 1. Fonctionnalités & Architecture Développées

### A. Système de Notifications
* **Modèle Mongoose (`Notification.js`)** : Définition des types valides (`'note'`, `'message'`, `'actualite'`, `'retard'`), association à un utilisateur (`userId`) et suivi de l'état de lecture (`read`).
* **Contrôleur (`notificationController.js`)** :
  * Récupération des notifications par utilisateur (`getNotifications`).
  * Marquage d'une notification spécifique comme lue (`markAsRead`).
  * Marquage global de toutes les notifications comme lues (`markAllAsRead`).
* **Routes Sécurisées (`notificationRoutes.js`)** : Priorisation des routes statiques (`/read-all/:userId`) avant les routes dynamiques (`/read/:id`) pour éviter les conflits d'URL dans Express.

### B. Système de Messagerie
* **Modèle Mongoose (`Message.js`)** : Gestion des messages avec `expediteur`, `destinataire`, `sujet`, `contenu`, `lu`, `typeMessage` (`DIRECT`, `SYSTEME_ABSENCE`, `NOTIFICATION`) et activation automatique des `timestamps`.
* **Contrôleur Avancé (`messageController.js`)** :
  * Recherche multi-collections dynamique pour retrouver les profils utilisateurs (`Prof`, `Etudiant`, `User`).
  * Automatisation : l'envoi d'un message déclenche instantanément la création d'une notification pour le destinataire.
  * Récupération unifiée des messages (reçus et envoyés) et liste consolidée des destinataires.
* **Routes de Messagerie (`messageRoutes.js`)** : Ordre des routes optimisé (routes de boîtes de réception et destinataires placées en amont de la route globale `/:userId`).

### C. Configuration Serveur & Réseau (`server.js`)
* **CORS Ouverts** : Autorisation des requêtes cross-origin pour fluidifier la communication entre le client web et le serveur API.
* **Écoute Réseau (`0.0.0.0`)** : Liaison du serveur sur toutes les interfaces réseau, permettant un accès simultané depuis la machine de développement et le réseau local Wi-Fi.

---

## 📱 2. Guide d'Accès Mobile (Test sur Smartphone)

Pour tester l'application depuis un téléphone connecté au même réseau Wi-Fi que votre ordinateur, procédez comme suit :

### Étape 1 : Récupérer l'adresse IP locale du Mac
Au démarrage du serveur backend, repérez l'adresse IP indiquée dans le terminal :
```text
📱 TÉLÉPHONE (IP) : [http://192.168.1.](http://192.168.1.)x:5001/api