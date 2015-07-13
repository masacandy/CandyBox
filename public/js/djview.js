

window.onload = function() {

  var innerContents = [];
  var localhostNumber = '192.168.11.101:3700';
  var socket = io.connect(localhostNumber);
  var content = document.getElementById("content");
  var likeStatus = 0;
  var dislikeStatus = 0;
  var danceStatus = 0;
  var likedSongs = [];
  var likedlist = document.getElementById("likedlist");
  var audienceNumber = -1;

  socket.on('sendLikes', function(data){
    var temp = [];
    if(likedSongs.length != 0){
      for(var i in data){
        if(_.findWhere(likedSongs, {"title":data[i].song})){
          var countuped = _.findWhere(likedSongs, {"title":data[i].song});
          countuped.count = countuped.count + 1;
          temp.push(countuped);
        } else {
          temp.push({ "title" :data[i].song, "count" :1});
        }
      }
    } else {
      for(var i in data){
        likedSongs.push({ "title" :data[i].song, "count" :1});
      }
    }
    if(temp.length){
      for(var i in temp){
        if(!_.findWhere(likedSongs, {"title":data[i].song})){
          likedSongs.push(temp[i]);
        }
      }
    }
    var sort_by = function(field, reverse, primer){
   reverse = (reverse) ? -1 : 1;
   return function(a,b){
       a = a[field];
       b = b[field];
       if (typeof(primer) != 'undefined'){
           a = primer(a);
           b = primer(b);
       }
       if (a<b) return reverse * -1;
       if (a>b) return reverse * 1;
       return 0;
   }
    }
    // var toShowLiked = []
    // toShowLiked.push(likedSongs);

    likedSongs.sort(sort_by('count', true, parseInt));
    var html = '';
    for(var i=0; i<likedSongs.length; i++) {
        html += '<b>' + ('Song') + ': </b>';
        html += likedSongs[i].title + ' : ' + likedSongs[i].count + '<br />';
   }
    likedlist.innerHTML = html;

  });

  socket.on('newAudience', function(){
    //新しくアプリを見てる人をカウントできるようにする
    console.log("gotNewAudience");
    audienceNumber++;
    var audienceNumberDiv = document.getElementById('audienceNumberDiv');
    var audienceNumberString = String(audienceNumber);
    audienceNumberDiv.innerText = audienceNumberString;
  })

  var pushContent = function(data){
    var html = '';
    innerContents.push(data);
    for(var i=0; i<innerContents.length; i++) {
        if(innerContents[i].request){
        html += '<b>' + ('Requests') + ': </b>';
        html += innerContents[i].request + '<br />';
      } else if (innerContents[i].like) {
        html += '<b>' + ('Liked') + ': </b>';
        html += innerContents[i].song + '<br />';
      } else if (innerContents[i].dis) {
        html += '<b>' + ('Disliked') + ': </b>';
        html += innerContents[i].song + '<br />';
      }
    }
    content.innerHTML = html;
  }

  socket.on('request', function (data) {
      if(data.request) {
        pushContent(data);
      } else {
          console.log("There is a problem:", data);
      }
  });

  socket.on('judge',function (data) {
    if(data) {
      if(data.like) {
        likeStatus++;
        var likeDiv = document.getElementById('likeDiv');
        var likeNumber = String(likeStatus);
        likeDiv.innerText = likeNumber;
      } else if (data.dis){
        dislikeStatus++;
        var disDiv = document.getElementById('disDiv');
        var disNumber = String(dislikeStatus);
        disDiv.innerText = disNumber;
      }
      pushContent(data);
    } else {
      console.log("something went wrong");
    }
  })

  socket.on('dancing',function(){
    danceStatus++;
    var danceDiv = document.getElementById('danceDiv');
    var danceNumber = String(danceStatus);
    danceDiv.innerText = danceNumber;
  })


}
