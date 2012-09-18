var Game = Game || {};

Game.Entity = function (config) {
   this.x = config.x || 0;
   this.y = config.y || 0;
   this.width = config.width || 0;
   this.height = config.height || 0;
   this.zindex = config.zindex || 0;
}

Game.Entity.prototype.render = function () { }

Game.Entity.prototype.update = function () { }

Game.Label = (function () {
   
   Extends(Label, Game.Entity);

   function Label (config) {
      Label._super.constructor.apply(this, arguments);
      this.text = config.text;
      this.color = config.color || 'black'
      this.font = config.conf ||  "bold 36px sans-serif";
   }

   Label.prototype.render = function (context) {
      context.font = this.font;
      context.fillStyle = this.color;
      context.fillText(this.text, this.x, this.y);
   }

   return Label;
})();

Game.Rectangle = (function () {
   Extends(Rectangle, Game.Entity);

   function Rectangle (config) {
      Rectangle._super.constructor.apply(this, arguments);
      this.color = config.color;
   }

   Rectangle.prototype.render = function (context) {
      context.fillStyle = this.color;
      context.fillRect(this.x, this.y, this.width, this.height);
   }

   return Rectangle;

})();

Game.Sprite = (function () {

   Extends(Sprite, Game.Entity);
   
   function Sprite (config) {
      Sprite._super.constructor.apply(this, arguments);
      
      this.speed = config.speed || 0;
      this.direction = config.direction || 0;
      this.zindex = config.zindex || this.zindex;
      this.image = new Image();
      this.xoffset = config.xoffset || 0;
      this.yoffset = config.yoffset || 0;

      this.image.src = config.image;
      this.generator = config.generator;

      var _that = this;

      this.image.onload = function () {
         _that.image_width = this.width;
         _that.image_height = this.height;
         _that.loaded = true;
      }
   }
   
   Sprite.prototype.update = function (elapsed) {
      if (!this.loaded) {
         return;
      }

      var speedx = Math.cos(this.direction * Math.PI / 180) * this.speed;
      var speedy = Math.sin(this.direction * Math.PI / 180) * this.speed;

      this.x = this.x + (speedx * elapsed);
      this.y = this.y + (speedy * elapsed);
   
      Sprite._super.update.call(this, elapsed);

      if (this.generator) {
         this.generator(elapsed);
      }
   }

   Sprite.prototype.render = function (context) {
      if (!this.loaded) {
         return;
      }
      context.drawImage(
         this.image, 
         this.xoffset, this.yoffset,
         this.width, this.height,
         this.x, this.y, 
         this.width, this.height);
   }

   Sprite.prototype.set = function (config) {
      this.speed = config.speed;
      this.direction = config.direction;
      this.accelleration = config.accelleration;
      this.x = config.x;
      this.y = config.y; 
   }

   return Sprite;
})();
