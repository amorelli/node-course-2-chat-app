// Built-in node module, resolves directory paths, and eliminates redundancy (going into and back out of directories) in our case
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
	console.log('New user connected');

	// creates event to send to server
	socket.emit('newMessage', {
		from: 'Adam',
		text: 'Hello this is Adam.',
		createdAt: 123123
	});

	// custom event listener
	socket.on('createMessage', (message) => {
		console.log('createMessage', message)
	});

	socket.on('disconnect', () => {
		console.log('User disconnected from server.');
	});
});

server.listen(port, () => {
	console.log(`Started on port ${port}`);
});

module.exports = {app};
