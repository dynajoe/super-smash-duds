var SmashGameController = (function () {
   
   Extends(SmashGameController, Game.Controller);
   
   function SmashGameController (gameBoard, player) {
      SmashGameController._super.constructor.call(this, gameBoard);
      this.events = {};
      this.player = new Game.Sprite({ image: player.avatar, height: 75, width: 68, x: 400, y: 500 });
      this.player.name = player.name;
      this.player.id = player.id;
      this.playerToEntity = {};
      this.playerToEntity[player.id] = this.player;
      this.entities.push(this.player);
      this.audioController = new Game.AudioController();
   }
   
   SmashGameController.prototype.processInput = function () {
      var change;

      if (Game.Keyboard.isPressed('d')) {
         this.player.speed.x = .2;
         change = true;
      } else if (Game.Keyboard.isPressed('a')) {
         this.player.speed.x = -.2;
         change = true;
      } else if (this.player.speed !== 0) {
         this.player.speed.x = 0;
         change = true;
      }

      if (Game.Keyboard.isPressed('w') && this.player.acceleration === 0) {
         this.audioController.play('/jump.ogg');
         this.player.speed.y = -1.4;
         this.player.acceleration = .005;
         change = true;
      }

      if (change) {
         this.emit('update', { id: this.player.id, acceleration: this.player.acceleration, speed: this.player.speed });
      }
   }
      
   SmashGameController.prototype.update = function (time) {

      SmashGameController._super.update.call(this, time);

      this.processInput();

      //Make sure to stay on the world vertically      
      //If we hit the ground we are no longer accelerating.
      if ((this.player.y + this.player.height) > this.world.height) {
         this.player.y = this.world.height - this.player.height;
         this.player.acceleration = 0;
         this.player.speed.y = 0;
      }      

      var _this = this;

      this.entities.forEach(function (e, i) {
         if (_this.data.players[e.id]) {
            e.set.call(e, _this.data.players[e.id]);
         } else {
            _this.entities = _this.entities.splice(i - 1, 1);
            delete _this.playerToEntity[e.id];
         }
      });

      for (id in this.data.players) {
         if (!this.playerToEntity[id]) {
            var player = this.data.players[id];
            player.height = 75;
            player.width = 68;
            player.x = 400;
            player.y = 400;
            var sprite = new Game.Sprite(player);
            sprite.id = id;
            this.entities.push(sprite);
            this.playerToEntity[id] = sprite;
         }
      }

      this.lastData = this.data;
   };

   SmashGameController.prototype.on = function(event, callback) {
      this.events[event] = callback;
   };

   SmashGameController.prototype.emit = function(event, data) {
      if (this.events[event]) {
         this.events[event](data);  
      }
   };

   return SmashGameController;

})();