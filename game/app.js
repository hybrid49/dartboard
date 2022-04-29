const PORT = 3000

const swig = require('swig');
const url=require('url');
const express = require('express');
const app = express();
const http = require('http').Server(app);

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file
app.use(express.static(__dirname + '/public'));
arrayComplete = ["20","19","18","17","16","15","14","13","12","11","10","9","8","7","6","5","4","3","2","1","25"]
// game cricket page
app.get('/game/cricket', function(req, res) {
	res.render('pages/cricket', {nbPlayer: req.query.nbPlayer, maxRound:2, arrayTargets:["20","19","18","17","16","15","25"], mode: "cricket"});
});

// game cricket page
app.get('/game/RandomCricket', function(req, res) {
	let array = [25];
	do {
		let nb = between(1, 20);

		if(!array.includes(nb))
			array.push(nb);
	}while(array.length < 7)

	array.sort(function(a, b) {
		return a - b;
	});

	res.render('pages/cricket', {nbPlayer: req.query.nbPlayer, maxRound:2, arrayTargets:array, mode: "cricket"});
});

// game 501 page
app.get('/game/501', function(req, res) {
	res.render('pages/01', {nbPlayer: req.query.nbPlayer, mode:501, maxRound:15, arrayTargets : arrayComplete});
});
// game 501 page
app.get('/game/301', function(req, res) {
	res.render('pages/01', {nbPlayer: req.query.nbPlayer,mode:301, maxRound:10, arrayTargets : arrayComplete});
});
// game 501 page
app.get('/game/701', function(req, res) {
	res.render('pages/01', {nbPlayer: req.query.nbPlayer,mode:701, maxRound:20, arrayTargets : arrayComplete});
});
// game 501 page
app.get('/game/hyperjumpup', function(req, res) {
	res.render('pages/hyperjumpup', {nbPlayer: req.query.nbPlayer, maxRound:10, arrayTargets : arrayComplete});
});

// game Gold Hunting page
app.get('/game/goldHunting', function(req, res) {
	res.render('pages/goldHunting', {nbPlayer: req.query.nbPlayer, maxRound:10, arrayTargets : arrayComplete});
});

// index page
app.get('/', function(req, res) {
	res.render('pages/index');
});

// select number player page
app.get('/lobby', function(req, res) {
	if(req.query.game === "cricket"){
		nbPlayer = 4;
	}else if(req.query.game === "goldHunting"){
		nbPlayer = 4;
	}else{
		nbPlayer = 8;
	}
	res.render('pages/lobby', {game : req.query.game, nbPlayerMax : nbPlayer});
});

function between(min, max) {
	return Math.floor(
		Math.random() * (max - min + 1) + min
	)
}

const { Server }  = require('socket.io', {wsEngine: 'ws' });

const io = new Server(http);

const fs = require('fs');

let fsTimeout;

// // listen on update on file to check if arduino send informations
// fs.watch('/srv/dart3/dart.txt', (event, filename) => {
// 	//define var to stop multiple trigger if a dart is stuck in the board
// 	if (!fsTimeout) {
// 		fs.readFile('/srv/dart3/dart.txt', 'utf8', (err, data) => {
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
