var Game = Game || {};

Game.Audio = function () {
   this.audio = new Audio();
   this.playing = false;
   this.src = null;
};

Game.Audio.prototype.play = function () {
   if (!this.playing) {
      this.playing = true;
      this.audio.src = this.src;
      this.audio.load();
      var audio = this;

      this.audio.addEventListener('ended', function() {
         audio.playing = false;
      });

      this.audio.play();  
   }
};

Game.Audio.prototype.stop = function () {
   if (this.playing) {
      this.audio.pause();
   }
};

Game.AudioController = function () {
   this.soundCache = {};
   this.maxid = 0;
   this.getSupportedTypes();
};

Game.AudioController.prototype.getSupportedTypes = function () {

   this.supportedTypes = {};
   var audio = new Audio();
   
   if (!!audio.canPlayType) {

      if (audio.canPlayType('audio/ogg; codecs="vorbis"') != "") {
         this.supportedTypes.ogg = true;
         this.supportedTypes.oga = true;
      }

      if (audio.canPlayType('audio/mpeg; codecs="mp3"') != "") {
         this.supportedTypes.mp3 = true;
      }

      if (audio.canPlayType('audio/wav; codec="1"') != "") {
         this.supportedTypes.wav = true;
      }

      if (audio.canPlayType('audio/mp4; codec="mp4a.40.5"') != "") {
         this.supportedTypes.mp4 = true;
         this.supportedTypes.m4a = true;
         this.supportedTypes.aac = true;
      }
   }
};

Game.AudioController.prototype.play = function (file) {

   var matches = file.trim().match(/.{3}$/);
   
   if (!matches || !this.supportedTypes[matches[0]]) {
      return -1;
   }

   this.maxid++;
   var audio = new Game.Audio();
   audio.src = file;
   audio.play();
   this.soundCache[this.maxid] = audio;

   return this.maxid;
};

Game.AudioController.prototype.stop = function (id) {
   this.soundCache[id].stop();
};