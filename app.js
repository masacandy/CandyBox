var express = require('express'),
    path = require('path'),
    http = require('http'),
    morgan = require('morgan'),
    xml2json = new require('xml2json'),
    io = require('socket.io'),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    playingData = require('./playing.json'),
    port = 3700;

var app = express();
var url = 'http://localhost:8000/';

app.use(morgan('dev'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','jade');
app.engine('jade', require('jade').__express);
app.use(express.static(path.join(__dirname,'public')));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



var xml;
function songReq () {
  //アクセスする
  http.get(url, function (res) {
    //エンコーディング指定
    res.setEncoding('utf8');
    res.on('data', function (chunk) {

      console.log(chunk);

      var apiJson = xml2json.toJson(chunk);
      var nowPlaying = JSON.parse(apiJson, 'utf-8');

      if (nowPlaying.hasOwnProperty("status")) {

        var nowPlayingTitle = nowPlaying.status.source.title;
        var currentTitle = playingData.status.source.title;

        if(currentTitle != nowPlayingTitle){
            fs.writeFile('playing.json', nowPlaying);
            console.log('saved');
          } else {
            console.log("now playing is " + nowPlayingTitle);
          };
        } else {
          console.log("currently there's no party")
        }
      });
      res.on('end', function () {
      });
  }).on('error', function (err) {
      console.log('Error: ', err); return;
  });
}

var io = require('socket.io').listen(app.listen(port));

io.sockets.on('connection', function (socket) {
    socket.emit('message', { message: 'welcome to the chat'});

    fs.watchFile('./playing.json', function(curr, prev) {

      socket.volatile.emit('notification', playingData);
    });

    socket.on('send', function (data) {
        io.sockets.emit('message', data);
    });
});

app.get('/', function(req, res) {
  res.render("index");
});


setInterval(songReq, 2000);
console.log("listening on port" + port);
