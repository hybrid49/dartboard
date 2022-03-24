var PORT = 3000;

var swig = require('swig');
var url=require('url');
// load the things we need
var express = require('express');
var app = express();
const http = require('http').Server(app);
// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file
app.use(express.static(__dirname + '/public'));
// index page
app.get('/game/cricket', function(req, res) {
	res.render('pages/cricket', {nbPlayer: req.query.nbPlayer});
});
app.get('/game/501', function(req, res) {
	res.render('pages/501', {nbPlayer: req.query.nbPlayer});
});

// about page
app.get('/', function(req, res) {
	res.render('pages/index');
});

// about page
app.get('/lobby', function(req, res) {
	res.render('pages/lobby', {game : req.query.game});
});

const { Server }  = require('socket.io', {wsEngine: 'ws' });

const io = new Server(http);

const fs = require('fs');

// fs.watch('C:\\Users\\User\\PhpstormProjects\\dart3\\dart.txt', (event, filename) => {
// 	console.log('watch');
// 	fs.readFile('C:\\Users\\User\\PhpstormProjects\\dart3\\dart.txt', 'utf8' , (err, data) => {
// 		if (err) {
// 			console.error(err)
// 			return
// 		}
// 		io.emit('dart', data);
// 	})
// });
io.on('connection', (socket) => {
	console.log('a user connected');
});
// console.log(parser);
http.listen(PORT);
