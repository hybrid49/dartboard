# Serveur de Communication avec l'Arduino

## Description
Ce projet est un serveur Node.js qui communique avec un Arduino via un port série. Il reçoit des données envoyées par l'Arduino et les enregistre dans un fichier `dart.txt`. Le serveur utilise **SerialPort**, **Express** et **Socket.io** pour la gestion des communications et des événements.

## Installation
### Prérequis
- **Node.js** installé
- **npm** installé
- **Un Arduino** connecté à un port série

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
   node main.js
   ```
2. Vérifier que l'Arduino envoie bien des données sur les ports `/dev/ttyACM0` et `/dev/ttyACM1`.
3. Les données reçues sont écrites dans le fichier `dart.txt`.

## Structure du projet
```
.
├── main.js             # Fichier principal du serveur
├── dart.txt              # Fichier où sont stockées les données reçues
├── package.json          # Fichier de configuration npm
```

## Fonctionnalités principales
- Communication avec l'Arduino via **SerialPort**
- Écriture des données reçues dans un fichier `dart.txt`
- Utilisation de **Socket.io** pour la communication en temps réel (peut être étendu)

## Développement
### Écoute des données reçues
Les données envoyées par l'Arduino sont écoutées sur les ports série :
```js
const port = new SerialPort({ path: '/dev/ttyACM0', baudRate: 9600 });
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));
parser.on('data', function(data) {
    fs.writeFileSync('dart.txt', data);
});
```

### Ajout d'un second port
Un second port peut être utilisé pour recevoir d'autres données :
```js
const port2 = new SerialPort({ path: '/dev/ttyACM1', baudRate: 9600 });
const parser2 = port2.pipe(new ReadlineParser({ delimiter: '\r\n' }));
parser2.on('data', function(data) {
    fs.writeFileSync('dart.txt', data);
});
```

## Auteur
- **Charrier Paul**

## Licence
Ce projet est sous licence **MIT**.

