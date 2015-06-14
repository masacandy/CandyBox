var express = require('express'),
    path = require('path'),
    http = require('http'),
    morgan = require('morgan'),
    parser = require('xml2json'),
    fs = require('fs'),
    port = 3700;

var app = express();
var url = 'http://localhost:8000/';

app.use(morgan('dev'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine','jade');
app.engine('jade', require('jade').__express);
app.use(express.static(path.join(__dirname,'public')));


var io = require('socket.io').listen(app.listen(port));

io.sockets.on('connection', function (socket) {
    socket.emit('message', { message: 'welcome to the chat' });
    socket.on('send', function (data) {
        io.sockets.emit('message', data);
    });
});


var req = http.get(url, function (res) {

    // テキストファイルの場合は、エンコード指定は重要！
    var xml = '';
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
        xml += chunk;
        var json = parser.toJson(xml); //returns a string containing the JSON structure by default
        console.log(json);
    });

    // ファイルのダウンロードが終わるとendイベントが呼ばれる
    res.on('end', function () {

    });

});

// app.get('/', function(req, res) {
//   res.render('index', {song:json.title,
//   artist: json.artist});
// });

// 通信エラーなどはここで処理する
req.on('error', function (err) {
    console.log('Error: ', err); return;
});
