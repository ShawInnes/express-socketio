var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var moment = require('moment');
// var redisadapter = require('socket.io-redis');
var socketioJwt = require('socketio-jwt');

// io.adapter(redisadapter({ host: 'localhost', port: 6379 }));

var list = [ 1,2,3,4,5,6,7,8 ];

setInterval(function () {
  list.forEach(function (i) {
    io.emit('news', {
      index: i,
      type: 'update',
      time: moment().toString()
    });
  });
}, 1000);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/send/:pair', function (req, res) {
  var pair = req.params.pair;
  io.emit('weather', `can you hear me? ${pair}`);
  res.send('ok');
});

io
  .on('connection', socketioJwt.authorize({
    secret: 'secret',
    timeout: 15000 // 15 seconds to send the authentication message
  })).on('authenticated', function(socket) {
    //this socket is authenticated, we are good to handle more events from it.
    console.log('hello!', socket.decoded_token);
  });

server.listen(8000, function (port) {
  console.log('listening');
});
