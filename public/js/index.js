const socket = io();
socket.on('connect', () => {
  // Update room list on new user connection, and appends the list to a dropdown menu
  socket.emit('updateRoomList', (rooms) => {
    rooms.forEach((room) => {
      jQuery('#room-list').append(jQuery('<option></option>').text(room).attr('value', room));
    });
  });
});
