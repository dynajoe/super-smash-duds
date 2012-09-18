var Game = Game || {};

Game.Controller = function () { }

Game.Controller.prototype.constructor = function (gameboard) {
   this.gameboard = gameboard;
   this.context = gameboard.getContext("2d");
   this.entities = [];
};

Game.Controller.prototype.activeKeys = function () {
   var keys = KeyboardJS.activeKeys();
   var activeKeys = {};
  
   keys.forEach(function (k) {
      activeKeys[k] = true;
   });

   activeKeys.any = keys.length > 0;

   return activeKeys;
};

Game.Controller.prototype.checkCollisions = function () {
   var entities = this.entities;

   entities.forEach(function (e1) {
      var e1right = e1.x + e1.width;
      var e1bottom = e1.y + e1.height;

      entities.forEach(function (e2) {
         if (e2 == e1)
            return;

         var e2right = e2.x + e2.width;
         var e2bottom = e2.y + e2.height;

         if (e2.x < e1right && e2bottom > e1.x && e2.y < e1bottom && e2bottom > e1.y) 
         {
            return true;
         }
      });
   });
};

Game.Controller.prototype.update = function (time) {

   var context = this.context;
   
   //There's no way to set the zindex of an item on the HTML5 Canvas
   //We'll batch the rendering so that the z order of each item can be determined before drawing.
   var batch = [];
   
   this.entities.forEach(function (e) {
      e.update.call(e, time.elapsed);

      if (!batch[e.zindex]) {
         batch[e.zindex] = [e];
      } else {
         batch[e.zindex].push(e);         
      }
   });
   
   this.checkCollisions();

   context.clearRect(0, 0, this.gameboard.width, this.gameboard.height);
   
   batch.forEach(function (b) {
      b.forEach(function (e) {
         e.render.call(e, context);
      });
   });
};

var StupidGame = (function () {
   
   Extends(StupidGame, Game.Controller);
   
   function StupidGame () {
      StupidGame._super.constructor.apply(this, arguments);

      var sprite3 = { 
         image: 'walk.png',
         x: 300, 
         y: 100, 
         width: 104,
         height: 149,
         direction: 180, 
         speed: .1,
         generator: function (elapsed, state) {
            
            if (this.speed == 0) {
               this.xoffset = 0;
               this.yoffset = 301;
               return;
            }

            if (this.direction > 90 && this.direction < 270) {
               this.yoffset = 150;
            } else {
               this.yoffset = 0;
            }

            this.lastFrame = this.lastFrame || new Date().getTime();

            if (new Date().getTime() - this.lastFrame > 250) {
               this.lastFrame = new Date().getTime();
               this.xoffset += this.width;

               if (this.xoffset > this.image_width - this.width) {
                  this.xoffset = 0;
               }
            }
         }
      };

      this.entities.push(new Game.Sprite(sprite3));
   }

   StupidGame.prototype.update = function (time) {
      StupidGame._super.update.call(this, time);

      this.entities.forEach(function (e) {
         if (e.x > 800 || e.x < 0) {
            e.direction = -(e.direction + 180);
         }
      });
   };

   return StupidGame;

})();