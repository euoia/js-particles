'use strict';
var TextOverlay = module.exports = function(options) {
  this.canvas = options.canvas;
  this.textTitle = options.textTitle;
  this.textSubtitle = options.textSubtitle;

  this.context = this.canvas.getContext('2d');
};

TextOverlay.prototype.render = function() {
  // Draw the text.
  this.context.fillStyle = 'white';
  this.context.textAlign = 'center';

  this.context.font = '24px Calibri';
  this.context.fillText(this.textTitle, this.canvas.width / 2, 30);

  this.context.font = '16px Calibri';
  this.context.fillText(this.textSubtitle, this.canvas.width / 2, 80);
};
