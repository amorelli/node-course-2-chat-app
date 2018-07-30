// Built-in node module, resolves directory paths, and eliminates redundancy (going into and back out of directories) in our case
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
	console.log('New user connected');

	// Message, of event type newMessage, from admin to greet the individual user
	socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat App.'));

	socket.broadcast.emit('newMessage', generateMessage('Admin', 'A new user has joined.'));	
	// custom event listener
	// socket.io emits event to single connection, io.emit emits event to every connection
	socket.on('createMessage', (message, callback) => {
		console.log('createMessage', message);

		io.emit('newMessage', generateMessage(message.from, message.text));
		callback();
	});

	socket.on('createLocationMessage', (coords) => {
		io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
	});

	socket.on('disconnect', () => {
		console.log('User disconnected from server.');
	});
});

server.listen(port, () => {
	console.log(`Started on port ${port}`);
});

module.exports = {app};
