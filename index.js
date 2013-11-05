var Throttle = require('throttle'),
    fs = require('fs'),
    change = false,
    probe = require('node-ffprobe'),
    http = require('http'),
    bitRate = 128022;
    currentStream = false;

probe(__dirname + '/sounds/two.mp3', function(err, data) {
  bitRate = data.format.bit_rate;
  currentStream = fs.createReadStream(__dirname + '/sounds/two.mp3');
})
var server = http.createServer(function(req, res){
  if (req.url === '/') {
    if (!currentStream) {
      res.write('oops not ready, reload in 0.1 sec');
    }
    else {
      res.write('<!doctype html> <html> <head> <title>Play</title> </head> <body> <h1>Play 4</h1> <audio autoplay controls id="yo" src="/bas"></audio> </body> </html>');
    }
    res.end();
  }
  else {
    var t = new Throttle({ bps: (bitRate/10) * 1.4 });
    currentStream.pipe(t).on('data', function(data){ res.write(data); });
  }
});
server.listen(9888);
