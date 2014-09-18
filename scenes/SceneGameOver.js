'use strict';
var FallingLeaf = require('../lib/FallingLeaf'),
  _ = require('underscore');

var SceneGameOver = module.exports = function () {
  this.imageUrl = './img/death-scene.jpg';
  this.fallingLeaf = null;
};

SceneGameOver.prototype.getPrompt = function() {
  return 'Jack is dead. There is nothing left.';
};

SceneGameOver.prototype.getOptions = function() {
  return {
    'Start again': function() {
      location.reload();
    }
  };
};

SceneGameOver.prototype.curtainsOpenStart = function(screen) {
  var f = new FallingLeaf({
    imageUrl: './img/leaf.png',
    shadowUrl: './img/leaf-shadow.png',
    context: screen.effectsLayerContext,
    leafX: _.random(10, 60),
    leafY: _.random(0, 20),
    groundY: _.random(180, 190),
    width: screen.width,
    height: screen.height
  });

  f.render();
};

SceneGameOver.prototype.destroyScene = function() {
  this.particles.destroyed = true;
  delete this.particles;
};
