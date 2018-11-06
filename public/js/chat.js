/* eslint-disable */
var socket = io();

function scrollToBottom () {
	// Selectors
	var messages = jQuery('#messages');
	var newMessage = messages.children('li:last-child');
	// Heights
	var clientHeight = messages.prop('clientHeight');
	var scrollTop = messages.prop('scrollTop');
	var scrollHeight = messages.prop('scrollHeight');
	var newMessageHeight = newMessage.innerHeight();
	var lastMessageHeight = newMessage.prev().innerHeight();

	if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
		messages.scrollTop(scrollHeight);
	};
}

socket.on('connect', function () {
  // deparam turns URI parameters into object properties, used to pass Room Name and User Name to the Server
	var params = jQuery.deparam(window.location.search);
	// Emits custom join event from client, listened to by server, server then sets up the room
	socket.emit('join', params, function (err) {
		if (err) {
			alert(err);
			window.location.href = '/';
		} else {
			console.log('No error.');
		}
	});
});

socket.on('disconnect', function () {
	console.log('Disconnected from server.')
});
// updateUserList is passed from server to the specified room, and user list is appended on a new user join
socket.on('updateUserList', function (users) {
	var ol = jQuery('<ul></ul>');

	users.forEach(function (user) {
		ol.append(jQuery('<li></li>').text(user));
	});

	jQuery('#users').html(ol);
});
// updateRoomList is passed from server to all rooms, and room list is appended on new user join
socket.on('updateRoomList', function (rooms) {
	var ol = jQuery('<ul></ul>');

	rooms.forEach(function (room) {
		ol.append(jQuery('<li></li>').text(room));
	});

	jQuery('#rooms').html(ol);
});

// Gets room name when user joins room, and adds it to the DOM
socket.on('getRoomName', function (room) {
	jQuery('#room-name').html(room);
});
// Same as getRoomName above except for User Name
socket.on('getCurrentUser', function (user) {
	jQuery('#user').html(user);
});

// listens for newMessage event
socket.on('newMessage', function (message) {
	var formattedTime = moment(message.createdAt).format('h:mm a');
	var template = jQuery('#message-template').html();
	var html = Mustache.render(template, {
		text: message.text,
		from: message.from,
		createdAt: formattedTime
	});

	jQuery('#messages').append(html);
	scrollToBottom();
});

socket.on('newLocationMessage', function (message) {
	var formattedTime = moment(message.createdAt).format('h:mm a');
	var template = jQuery('#location-message-template').html();
	var html = Mustache.render(template, {
		from: message.from,
		createdAt: formattedTime,
		url: message.url
	});

	jQuery('#messages').append(html);
	scrollToBottom();
});

jQuery('#message-form').on('submit', function (e) {
	e.preventDefault();

	socket.emit('createMessage', {
		text: jQuery('[name=message]').val()
	}, function () {

	});

	this.reset();
});

var locationButton = jQuery('#send-location');

locationButton.on('click', function () {
	// Check for browser support of geolocation
	if (!navigator.geolocation) {
		return alert('Geolocation not supported.');
	}

	locationButton.attr('disabled', 'disabled').text('Sending Location...');

	navigator.geolocation.getCurrentPosition(function (position) {
		locationButton.removeAttr('disabled').text('Send Location');
		socket.emit('createLocationMessage', {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		});
	}, function () {
		locationButton.removeAttr('disabled').text('Send Location');
		alert('Unable to fetch location.');
	});
});