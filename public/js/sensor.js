
function motion(event) {
  var x = event.acceleration.x;
  var y = event.acceleration.y;
  var z = event.acceleration.z;

  var localhostNumber = '192.168.11.101:3700';
  var socket = io.connect(localhostNumber);

  if (Math.abs(x) > 50 || Math.abs(y) > 50 || Math.abs(z) > 50 )
    {
        socket.emit('dancing');
        console.log('here');
    }
    console.log("started");

}


window.addEventListener("devicemotion", motion, true);
