function Particles(options) {
  this.screen = options.screen;
  this.width = options.width;
  this.height = options.height;

  this.canvas = document.createElement('canvas');
  this.ctx = this.canvas.getContext('2d');
  this.screen.appendChild(this.canvas);


  this.canvas.width = options.width;
  this.canvas.height = options.height;
  this.canvas.classList.add('nightBlueBackground');

  window.setInterval(
    this.generateParticle.bind(this, 200, 150, 50),
    20);
}

Particles.prototype.generateParticle = function(x, y, radius) {
  var angle = _.random(360);
  var distanceFromCenter = _.random(radius);

  var xOffset = Math.sin(angle) * distanceFromCenter;
  var yOffset = Math.cos(angle) * distanceFromCenter;

  this.drawParticle(x + xOffset, y + yOffset);
};

Particles.prototype.drawParticle = function(x, y) {
  this.ctx.fillStyle = "#FF0000";
  this.ctx.fillRect(x, y, 2, 2);
};
