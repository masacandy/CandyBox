var express = require('express'),
    path = require('path'),
    http = require('http'),
    url = require('url'),
    morgan = require('morgan'),
    xml2json = new require('xml2json'),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    basicAuth = require('basic-auth-connect'),
    getItunes = require('./getItunes'),
    port = 3700;

var app = express();
var server = http.Server(app);
var io = require('socket.io')(server);
server.listen(port);

app.use(morgan('dev'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','jade');
app.engine('jade', require('jade').__express);
app.use(express.static('public'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.all('/djview', basicAuth(function(user, password) {
  return user === 'James' && password === 'candyboxtest';
}));

app.get('/', function(req, res) {
  res.render("index");
});

app.get('/djview', function(req, res) {
  res.render("djview");
});

app.post('/songinfo', function(req, res) {
  var data = req.body;
  if(data) {
    res.sendStatus(200);
    fs.writeFile('./songData.json', JSON.stringify(data, 'UTF-8'));
    io.sockets.emit('sendApi', {'song':data.song,
                                'artist':data.artist});

    var emitItunesData = function (itunesData) {
      io.sockets.emit('sendItunes', itunesData);
    }
    getItunes.getItunes(data, emitItunesData);

  }
});



io.sockets.on('connection', function (socket) {
    console.log("connected");

  io.sockets.emit('newAudience');

  socket.on('send', function (data) {
       io.sockets.emit('request', data);
  });

  socket.on('judge', function (data) {
     io.sockets.emit('judge', data);
 });

  socket.on('sendLikes', function(data) {
   io.sockets.emit('sendLikes', data);
  });

 socket.on('dancing', function(data) {
 io.sockets.emit('dancing');
 });


});





console.log("listening on port" + port);
