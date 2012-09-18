var SmashGameController = (function () {
   
   Extends(SmashGameController, Game.Controller);
   
   function SmashGameController (gameBoard, player) {
      SmashGameController._super.constructor.apply(this, arguments);
      this.events = {};
      this.player = new Game.Sprite({ image: player.avatar, height: 150, width: 100, x: 400, y: 500 });
      this.player.name = player.name;
      this.player.id = player.id;
      this.playerToEntity = {};
      this.playerToEntity[player.id] = this.player;
      this.entities.push(this.player);
   }
   
   SmashGameController.prototype.processInput = function () {
      var change;

      if (Game.Keyboard.isPressed('left')) {
         this.player.direction = 180;
         this.player.speed = .2;
         change = true;
      } else if (Game.Keyboard.isPressed('right')) {
         this.player.direction = 0;
         this.player.speed = .2;
         change = true;
      } else if (Game.Keyboard.isPressed('space') && this.player.accelleration === 0) {
         this.player.direction = 90;
         this.player.speed = .5;
         change = true;
      }

      if (change) {
         this.emit('update', { id: this.player.id, direction: this.player.direction, speed: this.player.speed });
      }
   }
      
   SmashGameController.prototype.update = function (time) {
      SmashGameController._super.update.call(this, time);

      this.processInput();

      if (this.data === this.lastData) {
         return;
      }
      
      var _this = this;

      this.entities.forEach(function (e, i) {
         if (_this.data.players[e.id]) {
            e.set.call(e, _this.data.players[e.id]);
         } else {
            _this.entities = _this.entities.splice(i, 1);
            delete _this.playerToEntity[e.id];
         }
      });

      for (id in this.data.players) {
         if (!this.playerToEntity[id]) {
            var player = this.data.players[id];
            player.height = 150;
            player.width = 100;
            player.x = 400;
            player.y = 400;
            var sprite = new Game.Sprite(player);
            sprite.id = id;
            this.entities.push(sprite);
            this.playerToEntity[player.id] = sprite;
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