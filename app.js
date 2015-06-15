var express = require('express'),
    path = require('path'),
    http = require('http'),
    morgan = require('morgan'),
    xml2json = require('xml2json'),
    io = require('socket.io'),
    fs = require('fs'),
    serializer = new (require('xmldom')).XMLSerializer,
    implementation = new (require('xmldom')).DOMImplementation,
    bodyParser = require('body-parser'),
    port = 3700;

var app = express();
var url = 'http://localhost:8000/';

app.use(morgan('dev'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','jade');
app.engine('jade', require('jade').__express);
app.use(express.static(path.join(__dirname,'public')));

var rss;

var document = implementation.createDocument('', '', null);
document.appendChild(document.createElement('foo'));

var req = http.get(url, function (res) {

    // テキストファイルの場合は、エンコード指定は重要！
    var xml = '';
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
        xml += chunk;
        console.log(xml);
        var json = xml2json.toJson(xml); //returns a string containing the JSON structure by default
        console.log(json);

        fs.writeFile(
          "./playing.xml",
          serializer.serializeToString(xml),
          function(error) {
            if (error) {
              console.log(error);
            } else {
              console.log("The file was saved!");
            }
          }
        );
    });
    // ファイルのダウンロードが終わるとendイベントが呼ばれる
    res.on('end', function () {
    });
});


// 通信エラーなどはここで処理する
req.on('error', function (err) {
    console.log('Error: ', err); return;
});


var io = require('socket.io').listen(app.listen(port));

io.sockets.on('connection', function (socket) {
    socket.emit('message', { message: 'welcome to the chat' });
    socket.on('send', function (data) {
        io.sockets.emit('message', data);
    });
});

app.get('/', function(req, res) {
  res.render("index");
});

console.log("listening on port" + port);
