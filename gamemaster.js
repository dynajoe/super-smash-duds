var GameMaster = function () {
   this.players = {};
   this.world = { width: 900, height: 600 };
   this.playerHeight = 75;
   this.world.objects = [ {x: 50, y: 550, width: 200, height: 10, color: 'black'}, {x: 500, y: 550, width: 200, height: 10, color: 'black'}]
}

var avatars = ['red.png', 'green.png', 'black.png', 'purple.png'];

GameMaster.prototype.playerEntered = function (socket) {
   socket.emit('select-avatar', avatars);
   var _this = this;
   
   socket.on('avatar-selected', function (avatar) {
      socket.playing = true;
      socket.avatar = avatar;
      _this.players[socket.id] = { height: 75, width: 68, acceleration: 0, image: avatar.avatar, name: avatar.name, x: 400, y: 300, speed: {x: 0, y: 0 } };
      socket.emit('world', _this.world.objects);
   });
}

GameMaster.prototype.playerLeft = function (id) {
   delete this.players[id];
}

GameMaster.prototype.updatePlayer = function (player) {
   var p = this.players[player.id];

   if (p) {
      p.speed = player.speed;
   }
};

GameMaster.prototype.checkWorldCollisions = function (player) {
   var e1 = player;
   var e1right = e1.x + e1.width;
   var e1bottom = e1.y + e1.height;

   for (var i = 0; i < this.world.objects.length; i++) {
      var e2 = this.world.objects[i];

      var e2right = e2.x + e2.width;
      var e2bottom = e2.y + e2.height;

      if (e2.x < e1right && e2bottom > e1.x && e2.y < e1bottom && e2bottom > e1.y) {
         return e2;
      }
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

      if (p.x > this.world.width) { 
         p.x = this.world.width;
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

      var worldCollision = this.checkWorldCollisions(p);

      if (worldCollision) {
         if (p.y < worldCollision.y) {
            p.y = worldCollision.y - this.playerHeight  - 1;
            p.acceleration = 0;
            p.speed.y = 0;
         }
      }
   }

   return { players: this.players };
}

module.exports = GameMaster;