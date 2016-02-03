//chat 4.3
/**
 * GET /
 * Home page.
 */
exports.index = function(req, res) {
  var fecha = new Date();
  console.log("render " + fecha);
  res.render('index', {
    title: 'prueba extra'
  });
};

exports.url = function(req, res) {
  // http://chat-socket-io-zubiri.c9users.io/chat/pruebas
  // http://chat-socket-io-zubiri.c9users.io/Lobby/hola
  var chat = req.params.chat;
  var msg = req.params.mensaje;
  console.log("get " + chat + " " + msg + " prueba x");
  
  var io = req.app.io;  
  //io.sockets.in('Lobby').emit('updatechat', 'SERVER', msg);
  io.sockets.in(chat).emit('updatechat', 'SERVER', msg);
  
  res.send('chat: ' + chat + " mensaje: " + msg);

};