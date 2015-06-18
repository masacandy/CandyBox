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



var count = 0;
function songReq () {
  //アクセスする
  http.get(url, function (res) {
    //エンコーディング指定
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      //xmlファイルをjsonに変換
      var apiJson = xml2json.toJson(chunk);
      var nowPlaying = JSON.parse(apiJson);
      //なぜかstatus以下を持っていない時があったため（もしかしたらコールバックで解決？）
      if (nowPlaying.hasOwnProperty("status")) {
        var nowPlayingTitle = nowPlaying.status.source.title;
        var currentTitle;
        if (playingData.hasOwnProperty("status")){
        currentTitle = playingData.status.source.title;
        }
        //apiから来た曲名と、こっちで保存してる曲名が違った場合に上書きする
        if(currentTitle != nowPlayingTitle){
          console.log(currentTitle, nowPlayingTitle);
          console.log(count);
          count++;
          console.log("saving json", nowPlaying);
            fs.writeFile('playing.json', JSON.stringify(nowPlaying));
            console.log('saved');
          } else {
            console.log("曲は変わってません");
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
    //変わったら通知する
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
