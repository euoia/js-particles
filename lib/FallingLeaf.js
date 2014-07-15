function FallingLeaf(options) {
  this.imageUrl = options.imageUrl;
  this.shadowUrl = options.shadowUrl;
  this.context = options.context;
  this.leafX = options.leafX;
  this.leafY = options.leafY;
  this.groundY = options.groundY;
  this.height = options.height;
  this.width = options.width;
  this.shadowXOffset = options.shadowXOffset;

  this.gravity = 0.02;
  this.swingWidth = 100;
  this.swingTime = 0.001;

  this.destroyed = false;
  this.imageLoader = new ImageLoader();
  this.image = this.imageLoader.load(this.imageUrl);
  this.shadow = this.imageLoader.load(this.shadowUrl);

  this.imageLoader.done(function doneLoading() {
    this.startTime = Date.now();
    window.requestAnimationFrame(this.drawScene.bind(this));
  }.bind(this));
}

FallingLeaf.prototype.drawScene = function() {
  this.context.clearRect(0, 0, this.width, this.height);

  if (this.destroyed === true) {
    return;
  }

  var timePassed = Date.now() - this.startTime;
  var leafY = this.leafY + (timePassed * this.gravity);
  var leafX = this.leafX + (Math.sin(timePassed * this.swingTime) * this.swingWidth);

  var shadowX = this.leafX + (Math.sin(timePassed * this.swingTime) * this.swingWidth);
  var shadowY = this.groundY;
  var heightAboveGround = this.groundY - leafY;
  var shadowOpacity = (1 / heightAboveGround) * 5;

  this.context.globalAlpha = shadowOpacity;
  this.context.drawImage(this.shadow, shadowX, shadowY);

  this.context.globalAlpha = 1;
  this.context.drawImage(this.image, leafX, leafY);

  if (leafY < this.groundY) {
    window.requestAnimationFrame(this.drawScene.bind(this));
  }
};
