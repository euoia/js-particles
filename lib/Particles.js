// Number of pixels to move per second.
var gravity = 15;

function Particle(x, y, maxRadius) {
  this.x = x;
  this.y = y;
  this.radius = _.random(1, maxRadius);
  this.velocityModifier = Math.random() + 0.5;

  this.created = Date.now();
  this.lastUpdate = Date.now();

  this.red = 255;
  this.blue = _.random(200, 255);
  this.green = _.random(0, 255);

  // Time before it disappears.
  this.lifeInSeconds = _.random(4, 12);

  // Time it takes to fade out.
  this.fadeOutInSeconds = _.random(0, 2);

  this.__defineGetter__('deathTime', function() {
    return this.created + (this.lifeInSeconds * 1000);
  });

  this.__defineGetter__('isDead', function() {
    if (Date.now() > this.deathTime) {
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

Particle.prototype.getOpacity = function() {
  var now = Date.now();

  if (now > this.deathTime) {
    return 0;
  }

  var fadeOutStart = this.deathTime - (this.fadeOutInSeconds * 1000);

  // Opacity should be continuous & linear over the fade out time.
  // At start, opacity = 1. At end, opacity = 0.
  if (now > fadeOutStart) {
    var opacity = 1 - ((now - fadeOutStart) / (this.fadeOutInSeconds * 1000));
    return opacity;
  }

  return 1;
};

function Particles(options) {
  this.screen = options.screen;
  this.width = options.width;
  this.height = options.height;
  this.backgroundImageUrl = options.backgroundImageUrl;

  // Array of particles.
  this.particles = [];

  // Fire position.
  this.firePosition = {x: 450, y: 200};
  this.fireRadius = 120;

  // Particle size.
  this.maxParticleRadius = 2;

  // Drawing the scene layer.
  this.sCanvas = document.createElement('canvas');
  this.sCtx = this.sCanvas.getContext('2d');
  this.screen.appendChild(this.sCanvas);

  this.sCanvas.width = options.width;
  this.sCanvas.height = options.height;
  this.sCanvas.classList.add('nightBlueBackground');

  // Drawing the particle layer.
  this.pCanvas = document.createElement('canvas');
  this.pCtx = this.pCanvas.getContext('2d');
  this.screen.appendChild(this.pCanvas);

  this.pCanvas.width = options.width;
  this.pCanvas.height = options.height;
  this.pCanvas.style.position = 'absolute';
  this.pCanvas.style.top = '0';
  this.pCanvas.style.left = '0';


  this.imageLoader = new ImageLoader();
  this.backgroundImage = this.imageLoader.load(this.backgroundImageUrl);

  // Set everything up.
  this.imageLoader.done(function() {
    this.sCtx.drawImage(this.backgroundImage, 0, 0);

    window.setInterval(
      this.generateParticle.bind(
        this,
        this.firePosition.x,
        this.firePosition.y,
        this.fireRadius,
        this.maxParticleRadius),
      1000);

    window.requestAnimationFrame(this.drawScene.bind(this));
  }.bind(this));
}

Particles.prototype.generateParticle = function(x, y, areaRadius, maxParticleRadius) {
  var angle = _.random(360);
  var distanceFromCenter = _.random(areaRadius);

  var xOffset = Math.sin(angle) * distanceFromCenter;
  var yOffset = Math.cos(angle) * distanceFromCenter;

  this.particles.push(new Particle(x + xOffset, y + yOffset, maxParticleRadius));
};

Particles.prototype.drawScene = function() {
  this.pCtx.clearRect(0, 0, this.width, this.height);

  this.particles = _.where(this.particles, {isDead: false});
  _.map(this.particles, function (particle) {
    particle.applyGravity();
    this.drawParticle(particle);
  }.bind(this));

  window.requestAnimationFrame(this.drawScene.bind(this));
};

Particles.prototype.drawParticle = function(particle) {
  this.pCtx.fillStyle = particle.getColour();
  this.pCtx.globalAlpha = particle.getOpacity();

  // Rectangle.
  this.pCtx.fillRect(particle.x, particle.y, particle.radius, particle.radius);

  this.pCtx.globalAlpha = 1;

  // Circle.
  //this.pCtx.beginPath();
  //this.pCtx.strokeStyle = '#f0ee75';
  //this.pCtx.lineWidth = 0;
  //this.pCtx.arc(x, y, 2, 0, 2 * Math.PI);
  //this.pCtx.fill();
  //this.pCtx.stroke();
};
