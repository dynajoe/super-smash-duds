var GameMaster = function () {
   this.players = {};
   this.world = { width: 900, height: 600 };
}

var avatars = ['dk.gif', 'princess.png'];

GameMaster.prototype.playerEntered = function (socket) {
   socket.emit('select-avatar', avatars);
   var _this = this;
   socket.on('avatar-selected', function (avatar) {
      socket.playing = true;
      socket.avatar = avatar;
      _this.players[socket.id] = { acceleration: 0, image: avatar.avatar, name: avatar.name, x: 400, y: 300, direction: 0, speed: 0 };
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

   for (id in this.players) {
      var p = this.players[id];

      var speedx = Math.cos(p.direction * Math.PI / 180) * p.speed;
      var speedy = Math.sin(p.direction * Math.PI / 180) * p.speed;
      speedy = speedy + p.acceleration * time.elapsed;
      p.x = p.x + (speedx * time.elapsed);
      p.y = p.y + (speedy * time.elapsed);

      if (p.x > this.world.width) { 
         p.x = this.world.width;
      } else if (p.x < 0) {
         p.x = 0;
      }

      if (p.y > this.world.height - 150) {
         p.y = this.world.height  - 150;
         p.acceleration = 0;
      }

      if (p.y < this.world.height - 150) {
         p.acceleration = .001;
      }
   }

   return { players: this.players };
}

module.exports = GameMaster;