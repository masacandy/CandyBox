
function motion(event) {
  var x = event.acceleration.x;
  var y = event.acceleration.y;
  var z = event.acceleration.z;

  var localhostNumber = '192.168.0.2:3700';
  var socket = io.connect(localhostNumber);

  if (Math.abs(x) > 30 || Math.abs(y) > 30 || Math.abs(z) > 30 )
    {
        socket.emit('dancing');
        console.log('here');
    }
    console.log("started");

}


window.addEventListener("devicemotion", motion, true);
