var socket = io();
socket.on('connect', function () {
	socket.emit('updateRoomList', function (rooms) {

		rooms.forEach(function (room) {
			jQuery('#room-list').append(jQuery('<option></option>').text(room).attr('value', room));
		});
	});
});