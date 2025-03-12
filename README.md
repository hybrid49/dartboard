# Projet Dartboard Connecté

## Description
Ce projet est une application complète permettant de gérer un jeu de fléchettes connecté avec un Arduino. Il se compose de deux parties principales :

1. **Un serveur de communication avec l'Arduino** : Ce serveur récupère les informations envoyées par l'Arduino via un port série et les enregistre dans un fichier texte.
2. **Une application web** : Cette interface utilisateur permet de gérer les joueurs et d'afficher les scores en temps réel grâce à la communication via WebSockets.

## Architecture du Projet
Le projet repose sur plusieurs technologies :
- **Node.js & Express** : Utilisés pour créer le serveur web et le serveur de communication avec l'Arduino.
- **Socket.io** : Permet la communication en temps réel entre le serveur et l'interface utilisateur.
- **SerialPort** : Gère la connexion avec l'Arduino pour récupérer les données.
- **EJS** : Utilisé comme moteur de rendu pour l'interface web.

## Fonctionnalités Principales
- Récupération des informations de l'Arduino via **port série**
- Sauvegarde des données reçues dans un fichier `dart.txt`
- Interface utilisateur permettant de **gérer les joueurs** et **afficher les scores**
- Communication **temps réel** entre les clients via **WebSockets**
- Déploiement sur un serveur local ou distant

## Installation et Lancement
### Prérequis
- **Node.js** et **npm** installés
- **Un Arduino** configuré pour envoyer des données

### Étapes d'installation
1. Cloner le dépôt du projet :
   ```sh
   git clone <URL_DU_REPO>
   cd <NOM_DU_REPO>
   ```
2. Installer les dépendances (dans chaque dossier node du projet : game et comArduino) :
   ```sh
   npm install
   ```
3. Lancer le serveur de communication avec l'Arduino :
   ```sh
   node comArduino/main.js
   ```
4. Lancer l'application web :
   ```sh
   node game/app.js
   ```
5. Accéder à l'interface utilisateur via :
   ```
   http://localhost:3000
   ```

## Auteurs
- **Charrier Paul**

## Licence
Ce projet est sous licence **MIT**.

