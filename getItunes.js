var http = require('http'),
    aync = require('async'),
    app = require('./app');

module.exports.getItunes = function(req, callback) {
  var songTitle = req.song;
  var artistName = req.artist;
  if (songTitle.indexOf('(') != -1) {
    songTitle = songTitle.slice(0 , songTitle.indexOf('(') - 1 );
  } else if (songTitle.indexOf('[') != -1) {
    songTitle = songTitle.slice(0 , songTitle.indexOf('[') - 1 );
  } else if (songTitle.indexOf('feat') != -1) {
    songTitle = songTitle.slice(0 , songTitle.indexOf('feat') - 1 );
  }
  var url = 'http://ax.itunes.apple.com/WebObjects/MZStoreServices.woa/wa/wsSearch?term=' + songTitle + '%20'+ artistName + '&country=US&entity=musicTrack';


  var req = http.get(url, function(res){
      var body = '';
      res.setEncoding('utf8');

      res.on('data', function(chunk){
          body += chunk;

      });

      res.on('end', function(res){
        var isJSON = function(arg) {
    arg = (typeof arg === "function") ? arg() : arg;
    if (typeof arg  !== "string") {
        return false;
    }
    try {
    arg = (!JSON) ? eval("(" + arg + ")") : JSON.parse(arg);
        return true;
    } catch (e) {
        return false;
    }
    }


        var itunesData = body;
        console.log(isJSON(itunesData));
        callback(itunesData, app.emitItunesData);
      });


    }).on('error', function(e){
      callback('errr');
      return 'error';
      console.log(e.message); //エラー時
    }).end();
}
