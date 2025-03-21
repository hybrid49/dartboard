const PORT = 3000

const swig = require('swig');
const url=require('url');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const bdd = require('./src/bdd/bddPlayers');
const bddGames = require('./src/bdd/bddGames');
const routes = require('./src/route/routes');


// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file
app.use(express.static(__dirname + '/public'));

// Middleware pour assurer que toutes les vues ont accès à une variable de thème par défaut
app.use((req, res, next) => {
	// Nous n'utilisons pas de session, mais nous pouvons définir une variable locale 
	// qui sera disponible pour toutes les vues
	res.locals.theme = 'light';
	next();
});

// game cricket page
app.use(routes);

const { Server }  = require('socket.io', {wsEngine: 'ws' });

const io = new Server(http);
const fs = require('fs');

let fsTimeout;

// listen on update on file to check if arduino send informations
/*fs.watch('/srv/dartboard/comArduino/dart.txt', (event, filename) => {
	//define var to stop multiple trigger if a dart is stuck in the board
	if (!fsTimeout) {
		fs.readFile('/srv/dartboard/comArduino/dart.txt', 'utf8', (err, data) => {
			if (err) {
				console.error(err)
				return
			}
			console.log('watch : ' + data);
			io.emit('arduino', data);
			fsTimeout = setTimeout(function() { fsTimeout=null }, 500) // give 5 seconds for multiple events
		});
	}
});*/

io.on('connection', (socket) => {
	console.log('a user connected');
	// Écouter l'événement envoyé par le client
	socket.on('addPlayer', (data) => {
		if (data && data.name) {
			// Ajouter le joueur avec ses couleurs personnalisées
			bdd.addPlayers({
				name: data.name,
				color: data.color,
				colorDarker: data.colorDarker,
				colorTransparent: data.colorTransparent
			}).then(() => {
				console.log(`Joueur ajouté: ${data.name} avec les couleurs ${data.color}, ${data.colorDarker}, ${data.colorTransparent}`);
			}).catch(err => {
				console.error(`Erreur lors de l'ajout du joueur ${data.name}:`, err);
			});
		}
	});
	// Écouter l'événement envoyé par le client
	socket.on('deletePlayer', (data) => {
		bdd.deletePlayer(data);
		console.log('delete player');
	});
	
	// Écouter l'événement pour mettre à jour la couleur du joueur
	socket.on('updatePlayerColor', (data) => {
		if (data && data.name && data.color) {
			// Mettre à jour la couleur de base et les variantes
			bdd.updatePlayerColor(
				data.name, 
				{
					color: data.color,
					colorDarker: data.colorDarker,
					colorTransparent: data.colorTransparent
				}
			).then(success => {
				if (success) {
					console.log(`Couleurs du joueur ${data.name} mises à jour avec succès`);
				} else {
					console.error(`Échec de la mise à jour des couleurs pour ${data.name}`);
				}
			});
			console.log(`Mise à jour des couleurs pour ${data.name}: ${data.color}, ${data.colorDarker}, ${data.colorTransparent}`);
		}
	});
	
	// Écouter l'événement pour sauvegarder les statistiques de la partie
	socket.on('saveGameStats', async (gameData) => {
		try {
			// Conversion des données pour le format CSV
			const gameDataForDb = {
				type: gameData.mode || 'cricket',
				winner: gameData.playerNames[gameData.winner - 1] || 'Joueur ' + gameData.winner,
				players: JSON.stringify(gameData.playerNames),
				stats: JSON.stringify({
					playerStats: gameData.stats,
					gameInfo: gameData.gameInfo
				})
			};
			
			// Sauvegarde dans la base de données
			const success = await bddGames.addGame(gameDataForDb);
			
			// Mise à jour des statistiques des joueurs si nécessaire
			// TODO: Implémenter cette fonction plus tard si besoin
			
			console.log('Game stats saved:', success ? 'Success' : 'Failed');
		} catch (error) {
			console.error('Error saving game stats:', error);
		}
	});
	
	// Écouter l'événement pour mettre à jour les statistiques d'un joueur
	socket.on('updatePlayerStats', async (data) => {
		try {
			// Vérification des données reçues
			if (data && data.name && data.stats) {
				console.log('Mise à jour des statistiques pour:', data.name, 'Mode:', data.gameMode || 'Inconnu');
				
				// Appel de la fonction pour mettre à jour les statistiques dans la BDD
				const success = await bdd.updatePlayerStats(data.name, data.stats);
				
				if (success) {
					console.log('Statistiques du joueur mises à jour avec succès');
				} else {
					console.warn('Échec de la mise à jour des statistiques');
				}
			} else {
				console.warn('Données de mise à jour incomplètes:', data);
			}
		} catch (error) {
			console.error('Erreur lors de la mise à jour des statistiques du joueur:', error);
		}
	});
});

http.listen(PORT);


