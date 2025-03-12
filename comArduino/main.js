
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const port = new SerialPort({ path: '/dev/ttyACM0', baudRate: 9600 });
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

const port2 = new SerialPort({ path: '/dev/ttyACM1', baudRate: 9600 });
const parser2 = port2.pipe(new ReadlineParser({ delimiter: '\r\n' }));

const express = require('express');
const app = express();
const http = require('http');
const async = require('async')
const server = http.createServer(app);
const { Server } = require("socket.io", {cors:{origin: "*"}});
const io = new Server(server);
const redis = require('redis');
const publisher = redis.createClient();

const fs = require('fs');


var darts = []
parser.on('data', function(data) {
	publisher.publish('dartboard', data);
	fs.writeFileSync('dart.txt', data);
})
parser2.on('data', function(data) {
	fs.writeFileSync('dart.txt', data);
})

// server.listen(8080, () => {
// 	console.log('listening on *:3000');
// })
