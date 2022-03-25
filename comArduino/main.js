
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const port = new SerialPort({ path: 'COM3', baudRate: 9600 });
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));



const express = require('express');
const app = express();
const http = require('http');
const async = require('async')
const server = http.createServer(app);
const { Server } = require("socket.io", {cors:{origin: "*"}});
const io = new Server(server);

const fs = require('fs');


var darts = []
parser.on('data', function(data) {
	fs.writeFileSync('dart.txt', data);
	console.log(data);
})

// server.listen(8080, () => {
// 	console.log('listening on *:3000');
// })
