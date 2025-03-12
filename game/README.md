# Projet Dartboard avec Node.js et Socket.io

## Description
Ce projet est une application web permettant de gérer un jeu de fléchettes connecté avec un Arduino. Il utilise **Node.js**, **Express**, **Socket.io**, **EJS** et **Swig** pour l'affichage et la communication en temps réel.

## Installation
### Prérequis
- **Node.js** installé sur votre machine
- **npm** installé

### Étapes d'installation
1. Cloner le dépôt :
   ```sh
   git clone <URL_DU_REPO>
   cd <NOM_DU_REPO>
   ```
2. Installer les dépendances :
   ```sh
   npm install
   ```

## Utilisation
1. Lancer le serveur :
   ```sh
   node app.js
   ```
2. Accéder à l'application via :
   ```
   http://localhost:3000
   ```

## Structure du projet
```
.
├── app.js                # Fichier principal du serveur
├── public/               # Fichiers statiques (CSS, JS, images...)
├── src/
│   ├── bdd/
│   │   ├── bddPlayers.js # Gestion des joueurs
│   ├── route/
│   │   ├── routes.js     # Définition des routes
├── views/                # Fichiers de vue EJS
├── package.json          # Fichier de configuration npm
```

## Fonctionnalités principales
- Serveur Express.js avec moteur de template **EJS**
- Gestion des fichiers statiques dans **public/**
- Communication temps réel avec **Socket.io**
- Surveillance d'un fichier (`dart.txt`) pour détecter les nouvelles données envoyées par un Arduino
- Ajout/Suppression de joueurs via WebSocket

## Développement
### Ajouter un joueur
Un événement **addPlayer** est écouté via Socket.io et permet d'ajouter un joueur à la base de données.
```js
socket.on('addPlayer', (data) => {
    bdd.addPlayers(data);
    console.log('add player');
});
```

### Supprimer un joueur
Un événement **deletePlayer** est écouté pour supprimer un joueur.
```js
socket.on('deletePlayer', (data) => {
    bdd.deletePlayer(data);
    console.log('delete player');
});
```

## Auteur
- **Charrier Paul**

## Licence
Ce projet est sous licence **MIT**.

