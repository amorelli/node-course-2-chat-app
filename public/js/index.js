var socket = io();

socket.on('connect', function () {
	console.log('Connected to server.');

	// Emits event to client as soon as connection established
	socket.emit('createMessage', {
		from: 'Adam',
		text: 'Hey you are cool',
	});
});

socket.on('disconnect', function () {
	console.log('Disconnected from server.')
});

// listens for event
socket.on('newMessage', function (message) {
	console.log('newMessage.', message);
});
