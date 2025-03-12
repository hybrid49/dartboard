const PORT = 3000

const swig = require('swig');
const url=require('url');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const routes = require('./routes');
const redis = require('redis');
const subscriber = redis.createClient();

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file
app.use(express.static(__dirname + '/public'));
// game cricket page
app.use(routes);

const { Server }  = require('socket.io', {wsEngine: 'ws' });

const io = new Server(http);

const fs = require('fs');

let fsTimeout;

// TODO : check si redis est mieux que d'ecrire sur un fichier :D
subscriber.subscribe('dartboard'); // Écoute les données de Redis
subscriber.on('message', (channel, message) => {
	console.log('Donnée reçue depuis Redis:', message);
	// io.emit('arduino', message); // Envoie les données aux clients via WebSocket
});

// listen on update on file to check if arduino send informations
// fs.watch('/srv/dartboard/comArduino/dart.txt', (event, filename) => {
// 	//define var to stop multiple trigger if a dart is stuck in the board
// 	if (!fsTimeout) {
// 		fs.readFile('/srv/dartboard/comArduino/dart.txt', 'utf8', (err, data) => {
// 			if (err) {
// 				console.error(err)
// 				return
// 			}
// 			console.log('watch : ' + data);
// 			io.emit('arduino', data);
// 			fsTimeout = setTimeout(function() { fsTimeout=null }, 500) // give 5 seconds for multiple events
// 		});
// 	}
// });

io.on('connection', (socket) => {
	console.log('a user connected');
});

// console.log(parser);
http.listen(PORT);
