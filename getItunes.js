var http = require('http');



module.exports.getItunes = function (req, res) {
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
  console.log(url);
  http.get(url, function(res){
    var body = '';
    res.setEncoding('utf8');

    res.on('data', function(chunk){
        body += chunk;
    });

    res.on('end', function(res){
      var itunesData = body;
      console.log("got itunesData");
      return itunesData;
    });
  }).on('error', function(e){
     return 'error';
      console.log(e.message); //エラー時
  });

}
