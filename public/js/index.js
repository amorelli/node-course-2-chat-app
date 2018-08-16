const socket = io();
socket.on('connect', () => {
  socket.emit('updateRoomList', (rooms) => {

    rooms.forEach((room) => {
      jQuery('#room-list').append(jQuery('<option></option>').text(room).attr('value', room));
    });
  });
});
