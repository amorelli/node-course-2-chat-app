// Built-in node module, resolves directory paths, and eliminates redundancy (going into and back out of directories) in our case
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
	console.log('New user connected');

	socket.on('join', (params, callback) => {
		if (!isRealString(params.name) || !isRealString(params.room)) {
			return callback('Name and room name are requried.');
		}

		if (users.getUserList(params.room).includes(params.name)) {
			return callback('Name already taken.');
		}
		// console.log(params.name, ' ', users.getUserList(params.room));
		// console.log(users.getUserList(params.room).includes(params.name));

		var room = params.room.toLowerCase();
		socket.join(room);
		// User is removed from any previous rooms and added to the joined room
		users.removeUser(socket.id);
		users.addUser(socket.id, params.name, room);

		io.to(room).emit('updateUserList', users.getUserList(room));
		// console.log(users.getUserList(params.room));
		
		// Message, of event type newMessage, from admin to greet the individual user
		socket.emit('newMessage', generateMessage('Admin', `Welcome to the ${room} room.`));

		socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined!`));

		callback();
	});
	// custom event listener
	// socket.io emits event to single connection, io.emit emits event to every connection
	socket.on('createMessage', (message, callback) => {
		var user = users.getUser(socket.id);

		if (user && isRealString(message.text)) {
			io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
		}

		callback();
	});

	socket.on('createLocationMessage', (coords) => {
		var user = users.getUser(socket.id);

		if (user) {
			io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
		}
	});

	socket.on('disconnect', () => {
		var user = users.removeUser(socket.id);

		if (user) {
			io.to(user.room).emit('updateUserList', users.getUserList(user.room));
			io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
		}
	});

	socket.on('updateRoomList', (callback) => {
		var rooms = users.getRoomList();
		callback(rooms);
		console.log(users.getRoomList());
	});
});



server.listen(port, () => {
	console.log(`Started on port ${port}`);
});

module.exports = {app};
