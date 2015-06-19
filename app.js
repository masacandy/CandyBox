var express = require('express'),
    path = require('path'),
    http = require('http'),
    morgan = require('morgan'),
    xml2json = new require('xml2json'),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    port = 3700;

var app = express();
var server = http.Server(app);
var io = require('socket.io')(server);
server.listen(port);



var url = 'http://localhost:8000/';

app.use(morgan('dev'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','jade');
app.engine('jade', require('jade').__express);
app.use(express.static('public'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


function songReq () {
  //アクセスする
  http.get(url, function (res) {
    //エンコーディング指定
    res.setEncoding('UTF-8');
    res.on('data', function (chunk) {
      //ダウンロードしたxmlファイルをjsonに変換
      var apiJson = xml2json.toJson(chunk);
      var nowPlaying = JSON.parse(apiJson, 'UTF-8');
      console.log(nowPlaying);
      //なぜかstatus以下を持っていない時があったため（もしかしたらコールバックで解決？）
      if (nowPlaying.hasOwnProperty("status")) {
        var nowPlayingTitle = nowPlaying.status.source.title;
        //保存してある曲名を読み込む
        var playingData = JSON.parse(fs.readFileSync('./playing.json', 'UTF-8'));
        //保存してあるタイトル
        var currentTitle = playingData.status.source.title;
        //apiから来た曲名と、こっちで保存してる曲名が違った場合に上書きする
        if(currentTitle != nowPlayingTitle){
            fs.writeFile('playing.json', JSON.stringify(nowPlaying, 'UTF-8'));
            console.log('saved');
          } else {
            console.log("Keep Dancing With This Song");
          };
        } else {
          console.log(nowPlaying);
          console.log("currently there's no party")
        }
      });
      res.on('end', function () {
      });
  }).on('error', function (err) {
      console.log('Error: ', err); return;
  });
}


io.sockets.on('connection', function (socket) {
    console.log("connected");
    //変わったら通知する
    fs.watchFile('./playing.json', function(curr, prev) {
      console.log("song chaaaaaaanged");
      var playingData = JSON.parse(fs.readFileSync('./playing.json', 'utf8'));
      socket.volatile.emit('notification', {'song':playingData.status.source.title,
                                            'artist':playingData.status.source.artist});
    });
    socket.on('send', function (data) {
        io.sockets.emit('message', data);
    });
});

app.get('/', function(req, res) {
  res.render("index");
});


setInterval(songReq, 100);
console.log("listening on port" + port);
