var GameMaster = require('./gamemaster');

var gameServer = function (io) {
   var clients = {};

   var gameMaster = new GameMaster();

   io.sockets.on('connection', function (socket) {
     
      gameMaster.playerEntered(socket);

      clients[socket.id] = socket;
     
      socket.on('update', function (player) {
         gameMaster.updatePlayer(player);
      });

      socket.on('disconnect', function () {
         delete clients[socket.id];
         gameMaster.playerLeft(socket.id);
      });
   });

   var scheduleFrame = function (callback) {
      setTimeout(function () { callback(new Date().getTime()); }, 1000 / 20);
   }

  var loop = {};

  (function gameLoop (now) {

    scheduleFrame(gameLoop);

    if (!loop.lastTime) {
      loop.lastTime = now;
    } else {
      loop.lastTime = loop.time;
    }

    loop.time = now;

    var timeInfo = { elapsed: loop.time - loop.lastTime, current: loop.time };

    if (!timeInfo.elapsed) {
      return;
    }

    var data = gameMaster.update.call(gameMaster, timeInfo);

    var client;
    for (id in clients) {
      client = clients[id];
      if (client.playing) {
        client.emit('update', data); 
      }
    }
  })();
};

module.exports = gameServer;