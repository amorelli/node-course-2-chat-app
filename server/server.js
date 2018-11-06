// Built-in node module, resolves directory paths, and eliminates redundancy
// (going into and back out of directories) in our case
const path = require('path');
// HTTP Server, event emitter
const http = require('http');
// Express framework
const express = require('express');
// On the server-side, Socket.IO works by adding event listeners to an instance of http.createServer
const socketIO = require('socket.io');

// Custom event functions
const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');

const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 3000;

// Server (express -> http server -> socket.io)
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// constructor function
const users = new Users();

// Serves static site (index and chat.html)
app.use(express.static(publicPath));

// socket.emit emits event to single connection, io.emit emits event to every connection
// On server connection
io.on('connection', (socket) => {
  console.log('New user connected');
 
  // On room connection
  socket.on('join', (params, callback) => {
    // Form validation
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are requried.');
    }
    if (users.getUserList(params.room).includes(params.name)) {
      return callback(`Name ${params.name} already taken.`);
    }
    // console.log(params.name, ' ', users.getUserList(params.room));
    // console.log(users.getUserList(params.room).includes(params.name));

    // Grabs room parameter from client (chat.js) and joins the room.
    const room = params.room.toLowerCase();
    socket.join(room);

    // Users array is updated. Previous instance of user is removed, and a new one initiated.
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, room);

    // Emits updateUserList event to the client (chat.js), and users array is passed.
    io.to(room).emit('updateUserList', users.getUserList(room));
    // Similar to updateUserList above, but emitted to all rooms on new join event
    io.emit('updateRoomList', users.getRoomList());

    // Gets current User and Room name and passes to client (chat.js) which adds them to the sidebar
    socket.emit('getCurrentUser', users.getUser(socket.id).name);
    socket.emit('getRoomName', users.getUser(socket.id).room);
    // console.log(users.getUser(socket.id).name);

    // Message, of event type newMessage, from admin to greet the individual user
    socket.emit('newMessage', generateMessage('Admin', `Welcome to the ${room} room.`));
    // Broadcasts a message to all users of a room when a new user joins the room
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined!`));

    callback(); // Callback function for errors
  }); // End of socket.on(join)

  // Custom event listener, emits the user-created message to all users of a room after validation
  socket.on('createMessage', (message, callback) => {
    const user = users.getUser(socket.id);

    if (user && isRealString(message.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }

    callback();
  });

  socket.on('createLocationMessage', (coords) => {
    const user = users.getUser(socket.id);

    if (user) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }
  });

  // Removes user from users array, updates the Room's user list, and prints a message. Also updates the room list.
  socket.on('disconnect', () => {
    const user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
    }

    io.emit('updateRoomList', users.getRoomList());
  });

  // Listens for updateRoomList from index.js, on new user connection, gets the current room list.
  socket.on('updateRoomList', (callback) => {
    const rooms = users.getRoomList();
    callback(rooms);
    // console.log(users.getRoomList());
  });
}); // End of io.on(connection)

// Starts the HTTP server listening for connections.
server.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = { app };
