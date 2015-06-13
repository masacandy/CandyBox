var express = require('express'),
    path = require('path'),
    morgan = require('morgan'),
    fs = require('fs'),
    socket = require('socket.io');


var app = express();


app.use(morgan('dev'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine','jade');
app.use(express.static(path.join(__dirname,'public')));

app.get('/', function(req, res) {
  res.render('index' ,{});
});

var server = app.listen(process.env.PORT || '8080', '0.0.0.0', function() {
  console.log('App listening at http://%s:%s', server.address().address, server.address().port);
  console.log("Press Ctrl+C to quit.");
});
