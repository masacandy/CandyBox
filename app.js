var express = require('express'),
    path = require('path'),
    http = require('http'),
    url = require('url'),
    morgan = require('morgan'),
    xml2json = new require('xml2json'),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    basicAuth = require('basic-auth-connect'),
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


io.sockets.on('connection', function (socket) {
    console.log("connected");

    //var playingData = JSON.parse(fs.readFileSync('./playing.json', 'UTF-8'));
    socket.on('send', function (data) {
       io.sockets.emit('request', data);
   });

});


io.sockets.on('save', function(data) {
  console.log("insideif");
  fs.writeFile('./songData.json', JSON.stringify(data, 'UTF-8'));
});




app.get('/', function(req, res) {
  res.render("index");
});

app.get('/djview', function(req, res) {
  res.render("djview");
})



app.post('/songinfo', function(req, res) {
  var data = req.body;
  if(data) {
    res.sendStatus(200);
    io.sockets.emit('save', data);
    io.sockets.emit('sendApi', {'song':data.song,
                                        'artist':data.artist});
  }
});

console.log("listening on port" + port);
