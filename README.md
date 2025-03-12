# Projet Dartboard Connecté

## Description
Ce projet est une application complète permettant de gérer un jeu de fléchettes connecté avec un Arduino. 
La genèse de ce projet vient de la lecture et du suivi de ce tuto (pour la connexion d'une cible de fléchette à un Arduino) : https://www.hackster.io/ricardo-alves/opendarts-homemade-dartboard-machine-2a2914 
Il se compose de quatres parties principales :

1. **Un serveur de communication avec l'Arduino** : Ce serveur récupère les informations envoyées par l'Arduino via un port série et les enregistre dans un fichier texte.
2. **Une application web** : Cette interface utilisateur permet de gérer les joueurs et d'afficher les scores en temps réel grâce à la communication via WebSockets.
3. **Un serveur redis** : Le serveur sert de communication entre les deux application
4. **Le code des arduino** : Pour gerer les information recus par la cible de flechette et la gestion des bandes leds

## Prerequis
- **Une cible de flechette** : Pour commencer une cible de flechette de type basique (dacathlon)
- **Un fer à souder**
- **Un arduino** : Amélioration avec un esp32 si j'avais de meilleurs capacité de soudure
- **Un raspebery pi 4** : Gestion du serveur web et de l'affichage et de la communication avec l'arduino
- **Des Led** : Optionnel mais toujours fun !

## Architecture du Projet
Le projet repose sur plusieurs technologies :
- **Node.js & Express** : Utilisés pour créer le serveur web et le serveur de communication avec l'Arduino.
- **Socket.io** : Permet la communication en temps réel entre le serveur et l'interface utilisateur.
- **SerialPort** : Gère la connexion avec l'Arduino pour récupérer les données.
- **EJS** : Utilisé comme moteur de rendu pour l'interface web.
- **redis** : Pour la communication entre les deux serveurs node.

## Fonctionnalités Principales
- Récupération des informations de l'Arduino via **port série**
- Sauvegarde des données reçues dans un fichier `dart.txt`
- Interface utilisateur permettant de **gérer les joueurs** et **afficher les scores**
- Déploiement sur un serveur local ou distant

## Gestion des Arduino

**Le projet utilise deux Arduino pour gérer différentes fonctionnalités :**

- Arduino 1 : Récupère les données de la cible de fléchette et gère deux boutons (validation et retour en arrière, comme sur une cible commerciale).
- Arduino 2 : Gère les LED et les boutons de navigation.

Ces Arduino communiquent avec le raspebery pi via le port série.

## Installation et Lancement
### Prérequis
- **Node.js**, **redis** et **npm** installés
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
# Automatisation du Lancement avec systemd

## Description
Ce guide explique comment configurer **systemd** pour démarrer automatiquement les services nécessaires à l'application, notamment **Redis**, le **serveur Arduino**, et l'**application web** au démarrage du système.

## Étapes d'installation et de configuration

### 1. Création du service Redis
Créer un fichier `redis-custom.service` :
```sh
sudo nano /etc/systemd/system/redis-custom.service
```
Ajouter le contenu suivant :
```ini
[Unit]
Description=Redis Server
After=network.target

[Service]
ExecStart=/usr/bin/redis-server
Restart=always

[Install]
WantedBy=multi-user.target
```
Enregistrer (`CTRL+X`, `Y`, `Entrée`), puis activer et démarrer le service :
```sh
sudo systemctl enable redis-custom
sudo systemctl start redis-custom
```

### 2. Création du service pour le serveur Arduino
Créer un fichier `server-arduino.service` :
```sh
sudo nano /etc/systemd/system/server-arduino.service
```
Ajouter le contenu suivant :
```ini
[Unit]
Description=Serveur Arduino
After=redis-custom.service

[Service]
ExecStart=/usr/bin/node /chemin/vers/ton/projet/server.js
Restart=always
User=<ton-utilisateur>
WorkingDirectory=/chemin/vers/ton/projet

[Install]
WantedBy=multi-user.target
```
Activer et démarrer le service :
```sh
sudo systemctl enable server-arduino
sudo systemctl start server-arduino
```

### 3. Création du service pour l'application web
Créer un fichier `app-web.service` :
```sh
sudo nano /etc/systemd/system/app-web.service
```
Ajouter le contenu suivant :
```ini
[Unit]
Description=Application Web
After=server-arduino.service

[Service]
ExecStart=/usr/bin/node /chemin/vers/ton/projet/app.js
Restart=always
User=<ton-utilisateur>
WorkingDirectory=/chemin/vers/ton/projet

[Install]
WantedBy=multi-user.target
```
Activer et démarrer le service :
```sh
sudo systemctl enable app-web
sudo systemctl start app-web
```

## Commandes utiles
- **Vérifier le statut d'un service** :
  ```sh
  sudo systemctl status <nom-du-service>
  ```
- **Redémarrer un service** :
  ```sh
  sudo systemctl restart <nom-du-service>
  ```
- **Arrêter un service** :
  ```sh
  sudo systemctl stop <nom-du-service>
  ```
- **Désactiver un service au démarrage** :
  ```sh
  sudo systemctl disable <nom-du-service>
  ```

## Auteurs
- **Charrier Paul**

## Licence
Ce projet est sous licence **MIT**.

