var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var moment = require('moment');

server.listen(8000);

var list = [ 1,2,3,4,5,6,7,8 ];

setInterval(function () {
  list.forEach(function (i) {
    io.emit('news', {
      index: i,
      type: 'update',
      time: moment()
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

io.on('connect', function (socket) {
  socket.on('news', function (data) {
    console.log('news', data);
  });
});
