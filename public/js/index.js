var socket = io();

socket.on('connect', function () {
	console.log('Connected to server.');
});

socket.on('disconnect', function () {
	console.log('Disconnected from server.')
});

// listens for event
socket.on('newMessage', function (message) {
	console.log('newMessage.', message);
});
