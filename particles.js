// Number of pixels to move per second.
var gravity = 12;

function Particle(x, y, radius) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.velocityModifier = Math.random() + 0.5;

  this.created = Date.now();
  this.lastUpdate = Date.now();

  this.red = 255;
  this.blue = _.random(0, 255);
  this.green = _.random(0, 255);

  this.lifeInSeconds = _.random(4, 12);
  this.__defineGetter__('isDead', function() {
    if (Date.now() > this.created + (this.lifeInSeconds * 1000)) {
      return true;
    }

    return false;
  });
}

Particle.prototype.applyGravity = function() {
  var timeDiff = (Date.now() - this.lastUpdate) / 1000;
  this.y = this.y - (gravity * timeDiff * this.velocityModifier);
  this.lastUpdate = Date.now();
};

Particle.prototype.getColour = function() {
  return '#' +
    this.red.toString(16) +
    this.blue.toString(16) +
    this.green.toString(16);
};

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

  this.particles = [];

  window.setInterval(
    this.generateParticle.bind(this, 200, 150, 50, 1),
    1000);

  window.requestAnimationFrame(this.drawScene.bind(this));
}

Particles.prototype.generateParticle = function(x, y, areaRadius, particleRadius) {
  console.log('Adding particle');
  var angle = _.random(360);
  var distanceFromCenter = _.random(areaRadius);

  var xOffset = Math.sin(angle) * distanceFromCenter;
  var yOffset = Math.cos(angle) * distanceFromCenter;

  this.particles.push(new Particle(x + xOffset, y + yOffset, particleRadius));
};

Particles.prototype.drawScene = function() {
  this.ctx.clearRect(0, 0, this.width, this.height);

  this.particles = _.where(this.particles, {isDead: false});
  _.map(this.particles, function (particle) {
    particle.applyGravity();
    this.drawParticle(particle);
  }.bind(this));

  window.requestAnimationFrame(this.drawScene.bind(this));
};

Particles.prototype.drawParticle = function(particle) {
  this.ctx.fillStyle = particle.getColour();
  // Rectangle.
  this.ctx.fillRect(particle.x, particle.y, particle.radius, particle.radius);

  //this.ctx.beginPath();
  //this.ctx.strokeStyle = '#f0ee75';
  //this.ctx.lineWidth = 0;
  //this.ctx.arc(x, y, 2, 0, 2 * Math.PI);
  //this.ctx.fill();
  //this.ctx.stroke();
};
