var express = require('express'),
    path = require('path'),
    http = require('http'),
    url = require('url'),
    morgan = require('morgan'),
    xml2json = new require('xml2json'),
    bodyParser = require('body-parser'),
    fs = require('fs'),
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

io.sockets.on('connection', function (socket) {
    console.log("connected");

    //var playingData = JSON.parse(fs.readFileSync('./playing.json', 'UTF-8'));

    //io.sockets.emit('send', {'song':playingData.song, 'artist':playingData.artist});

});


io.sockets.on('save', function(data) {
  console.log("insideif");
  //fs.writeFile('playing.json', JSON.stringify(data, 'UTF-8'));
});



app.get('/', function(req, res) {
  res.render("index");
});

app.post('/songinfo', function(req, res) {
  var data = req.body;
  console.log("insideif");

  io.sockets.emit('save', data);
  console.log(data.song);
  io.sockets.emit('send', {'song':data.song,
                                      'artist':data.artist});
});

console.log("listening on port" + port);
