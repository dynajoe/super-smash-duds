(function () {

   var isPlaying;
   var avatar;
   var socket = io.connect();

   socket.on('select-avatar', function (avatars) {
      GameLoop.controller = new SelectAvatarController(document.getElementById('game-board'), avatars, function (a) {
         socket.emit('avatar-selected', a);
         avatar = a;
      });
   });

   socket.on('update', function (data) {

      if (!isPlaying) {
         GameLoop.controller = new SmashGameController(document.getElementById('game-board'), { name: avatar.name, avatar: avatar.avatar, id: socket.socket.sessionid });
         GameLoop.controller.on('update', function (player) {
            socket.emit('update', player);
         });
         isPlaying = true;
      }

      GameLoop.controller.data = data;
   });
})();