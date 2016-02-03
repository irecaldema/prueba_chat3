//chat 4.3
//http://socket.io/docs/rooms-and-namespaces/
var app = require('express')();
var exphbs = require('express-handlebars');

app.engine('handlebars', exphbs({}));
app.set('view engine', 'handlebars');

var homeController = require('./controllers/home');
app.get('/', homeController.index);
app.get('/:chat/:mensaje', homeController.url);

//app.route('/').get(Home.index);

//*******************socket.io***********************************
//require (attach server on www.js)
app.io = require('socket.io')();


var http = require('http');
var server = http.createServer(app);
app.io.attach(server);

app.set('io', app.io);
// http://stackoverflow.com/questions/19156636/node-js-and-socket-io-creating-room
// http://stackoverflow.com/questions/6873607/socket-io-rooms-difference-between-broadcast-to-and-sockets-in

var usernames = {};

var rooms = ['Lobby'];

app.io.sockets.on('connection', function(socket) {
  socket.on('adduser', function(username) {
    socket.username = username;
    socket.room = 'Lobby';
    usernames[username] = username;
    socket.join('Lobby');
    socket.emit('updatechat', 'SERVER', 'you have connected to Lobby');
    socket.broadcast.to('Lobby').emit('updatechat', 'SERVER', username + ' has connected to this room');
    socket.emit('updaterooms', rooms, 'Lobby');
  });

  socket.on('create', function(room) {
    rooms.push(room);
    socket.emit('updaterooms', rooms, socket.room);
  });

  socket.on('sendchat', function(data) {
    app.io.sockets["in"](socket.room).emit('updatechat', socket.username, data);
  });

  socket.on('switchRoom', function(newroom) {
    var oldroom;
    oldroom = socket.room;
    socket.leave(socket.room);
    socket.join(newroom);
    socket.emit('updatechat', 'SERVER', 'you have connected to ' + newroom);
    socket.broadcast.to(oldroom).emit('updatechat', 'SERVER', socket.username + ' has left this room');
    socket.room = newroom;
    socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username + ' has joined this room');
    socket.emit('updaterooms', rooms, newroom);
  });

  socket.on('disconnect', function() {
    delete usernames[socket.username];
    app.io.sockets.emit('updateusers', usernames);
    socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
    socket.leave(socket.room);
  });
});

server.listen(8080, function() {
  console.log('listening on 0.0.0.0 :8080');
});