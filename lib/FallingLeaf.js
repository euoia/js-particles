'use strict';

var ImageLoader = require('./ImageLoader.js');

var FallingLeaf = module.exports = function (options) {
  this.imageUrl = options.imageUrl;
  this.shadowUrl = options.shadowUrl;
  this.context = options.context;
  this.leafX = options.leafX;
  this.leafY = options.leafY;
  this.groundY = options.groundY;
  this.height = options.height;
  this.width = options.width;
  this.shadowXOffset = options.shadowXOffset;

  this.initialGravity = 0.02;
  this.gravity = this.initialGravity;
  this.initialSwingWidth = 100;
  this.swingWidth = this.initialSwingWidth;
  this.swingTime = 0.001;
  this.slowCount = 0; // For easing into the stop.
  this.initialHeightAboveGround = this.groundY - this.leafY;

  this.destroyed = false;
  this.imageLoader = new ImageLoader();
  this.image = this.imageLoader.load(this.imageUrl);
  this.shadow = this.imageLoader.load(this.shadowUrl);
};

FallingLeaf.prototype.render = function() {
  this.imageLoader.done(function doneLoading() {
    this.startTimeX = Date.now();
    this.startTimeY = this.startTimeX;
    window.requestAnimationFrame(this.drawScene.bind(this));
  }.bind(this));
};


FallingLeaf.prototype.drawScene = function() {
  this.context.clearRect(0, 0, this.width, this.height);

  if (this.destroyed === true) {
    return;
  }

  var timePassedY = Date.now() - this.startTimeY;
  var leafY = this.leafY + (timePassedY * this.gravity);

  var timePassedX = Date.now() - this.startTimeX;
  var leafX = this.leafX + (Math.sin(timePassedX * this.swingTime) * this.swingWidth);

  var shadowX = this.leafX + (Math.sin(timePassedX * this.swingTime) * this.swingWidth);
  var shadowY = this.groundY;
  var heightAboveGround = this.groundY - leafY;
  var shadowOpacity = (1 / heightAboveGround) * 5;

  this.context.globalAlpha = shadowOpacity;
  this.context.drawImage(this.shadow, shadowX, shadowY);

  this.context.globalAlpha = 1;
  this.context.drawImage(this.image, leafX, leafY);


  var pctFallen = heightAboveGround / this.initialHeightAboveGround;
  if (pctFallen > 0.1) {
    this.swingWidth = pctFallen * this.initialSwingWidth;
  }

  if (this.slowCount === 0 && leafY + 15 > this.groundY) {
    this.slowCount += 1;
    this.leafY = leafY;
    this.gravity = this.initialGravity / 2;
    this.startTimeY = Date.now();
    this.drawScene();
  }

  if (leafY < this.groundY) {
    window.requestAnimationFrame(this.drawScene.bind(this));
  }
};
