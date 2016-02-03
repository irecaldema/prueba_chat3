//chat 4.3
/**
 * GET /
 * Home page.
 */
exports.index = function(req, res) {
  //var io = req.app.io;
  var fecha = new Date();
  console.log("render "+fecha);
  
  res.render('index', {title: 'prueba extra'});
};

exports.url = function(req, res) {
  // http://chat-socket-io-zubiri.c9users.io/chat/pruebas
  var chat = req.params.chat;
  var msg = req.params.mensaje;
  var io = req.app.io;
  console.log("get "+chat+" "+msg);
  var fecha = new Date();
  io.sockets.on('connection', function(socket) {
    socket.broadcast.to('Lobby').emit('updatechat', 'SERVER', msg+" prueba "+fecha);
  });  
};