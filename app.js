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

console.log(playingData.status.source.title);


function songReq () {
  http.get(url, function (res) {
  // テキストファイルの場合は、エンコード指定は重要！
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    var json = xml2json.toJson(chunk);
    console.log(json.status);
    if(playingData == undefined || playingData != chunk){
        fs.writeFile('playing.json', json);
      };
    });
    // ファイルのダウンロードが終わるとendイベントが呼ばれる
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
    // on file change we can read the new xml
      fs.readFile('./playing.json', function(err, data) {
        console.log("hello");
        if (err) throw err;
        // parsing the new xml data and converting them into json file
        var json = data;
        console.log("are you here?" + json);
        // send the new data to the client
        socket.volatile.emit('notification', json);
      });
    });

    socket.on('send', function (data) {
        io.sockets.emit('message', data);
    });
});

app.get('/', function(req, res) {
  res.render("index");
});


setInterval(songReq, 1000);
console.log("listening on port" + port);
