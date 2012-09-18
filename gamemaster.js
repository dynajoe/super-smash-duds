var GameMaster = function () {
   this.players = {};
   this.world = { width: 900, height: 600 };
   this.playerHeight = 75;
   this.playerWidth = 68;
}

var avatars = ['red.png', 'green.png', 'black.png', 'purple.png'];

GameMaster.prototype.playerEntered = function (socket) {
   socket.emit('select-avatar', avatars);
   var _this = this;
   socket.on('avatar-selected', function (avatar) {
      socket.playing = true;
      socket.avatar = avatar;
      _this.players[socket.id] = { acceleration: 0, image: avatar.avatar, name: avatar.name, x: 400, y: 300, speed: {x: 0, y: 0 } };
   });
}

GameMaster.prototype.playerLeft = function (id) {
   delete this.players[id];
}

GameMaster.prototype.updatePlayer = function (player) {
   var p = this.players[player.id];

   if (p) {
      p.direction = player.direction;
      p.speed = player.speed;
      p.acceleration = player.acceleration;
   }
};

GameMaster.prototype.update = function (time) {
   if (!time.elapsed) {
      return;
   }

   var elapsed = time.elapsed;

   for (id in this.players) {
      var p = this.players[id];
      
      p.speed.y = p.speed.y + p.acceleration * elapsed;
      
      p.x = p.x + (p.speed.x * elapsed);
      p.y = p.y + (p.speed.y * elapsed);

      if (p.x > this.world.width - this.playerWidth) { 
         p.x = this.world.width - this.playerWidth;
      } else if (p.x < 0) {
         p.x = 0;
      }

      if (p.y > this.world.height - this.playerHeight) {
         p.y = this.world.height - this.playerHeight;
         p.acceleration = 0;
         p.speed.y = 0;
      }

      if (p.y < this.world.height - this.playerHeight) {
         p.acceleration = .005;
      }
   }

   return { players: this.players };
}

module.exports = GameMaster;