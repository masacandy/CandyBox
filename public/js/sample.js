window.onload = function() {

    //TODO開発用、環境によって変える
    var localhostNumber = '192.168.0.2:3700';
    var socket = io.connect(localhostNumber);
    var goRequestButton = document.getElementById("goRequest");
    var requestForm = document.getElementById("requestForm");
    var likeButton = document.getElementById("likeButton");
    var disButton = document.getElementById("disButton");
    var songTitle = document.getElementById("songTitle");
    var artistName = document.getElementById("artistName");
    var storage = sessionStorage;
    var historyBtn = document.getElementById("history");
    var deleteBtn = document.getElementById("deleteHistory");
    var artwork = document.getElementById("artworkSrc");
    var backgroundCover = document.getElementById("art-work-wrapper");


    var vague = $('#art-work-wrapper').Vague({
    intensity:      10,      // Blur Intensity
    forceSVGUrl:    false,   // Force absolute path to the SVG filter,
    // default animation options
    animationOptions: {
      duration: 0,
      easing: 'linear' // here you can use also custom jQuery easing functions
    }
    });
    vague.blur();

    var sendLikes = function(storage) {
      var likesData = [];
      for (var i=0; i < storage.length; i++) {
        var song = storage.key(i);
        var artist = storage.getItem(song);
        likesData.push({"song":song, "artist":artist});
      }
      socket.emit('sendLikes', likesData);
    }

    sendLikes(storage);

    function setsessionStorage(storage) {

      var key = songTitle.innerText;
      var value = artistName.innerText;

      // 値の入力チェック
      if (key && value) {
        storage.setItem(key, value);
      }

      key = "";
      value = "";

    }

    function viewStorage(storage) {
      var list = document.getElementById("list")
          while (list.firstChild) list.removeChild(list.firstChild);
      if(storage.length){
       for (var i=0; i < storage.length; i++) {
         var _key = storage.key(i);
         // sessionStorageのキーと値を表示
         var tr = document.createElement("tr");
         var td1 = document.createElement("td");
         var td2 = document.createElement("td");
         list.appendChild(tr);
         tr.appendChild(td1);
         tr.appendChild(td2);
         td1.innerHTML = _key;
         td2.innerHTML = storage.getItem(_key);
         console.log(storage);
       }
     } else {
       var div = document.createElement("div");
       list.appendChild(div);
       div.innerHTML = "There's no history yet"
     }
    }


    goRequestButton.onclick = function() {
        if(requestForm.value == "") {
            alert("It's blank!");
        } else {
            var requestText = requestForm.value;
            console.log("got request");
            socket.emit('send', {request: requestText});
            requestForm.value = "";
            return false;
        }
    };

    likeButton.onclick = function() {
        if($('#likeButton').data('judge') == "") {
            alert("It's strange");
        } else {
            var like = $('#likeButton').data('judge');
            socket.emit('judge', {like: like,
                                  song:songTitle.innerText});
            if (typeof sessionStorage !== 'undefined') {
              setsessionStorage(storage);
            } else {
              window.alert("本ブラウザではWeb Storageが使えません");
            }
        }
    };

    historyBtn.onclick = function() {
      viewStorage(storage);
      if ($("#historyDiv").is(":hidden")) {
        $("#historyDiv").slideDown("slow");
      } else {
        $("#historyDiv").slideUp("slow");
      }
    }

    deleteBtn.onclick = function() {
      storage.clear();
      $("#historyDiv").slideUp("fast");

    }

    disButton.onclick = function() {
        if($('#disButton').data('judge') == "") {
            alert("It's strange");
        } else {
            var dis = $('#disButton').data('judge');
            socket.emit('judge', {dis: dis});
        }
    };


    socket.on('sendApi', function (data) {
      console.log(data.song);
      $('#songTitle').html(data.song);
      if(data.artist){
        $('#artistName').html(data.artist);
      } else {
        $('#artistName').html("No Artist Info");
      }
    });

    socket.on('sendItunes', function(data) {
      var itunesData = JSON.parse(data);
      if(itunesData.results[0]) {
        console.log(itunesData.results);
        var artworkURL = itunesData.results[0].artworkUrl100;
        artwork.src = artworkURL;
        backgroundCover.style.backgroundImage = "url( " + artworkURL + " )";

      } else {
        var nowplayingImg = "/images/nowplaying.jpg";
        artwork.src = nowplayingImg;
        backgroundCover.style.backgroundImage = "url( " + nowplayingImg + " )";
      }
    });

}
