'use strict';
var SceneManager = module.exports = function (options) {
  this.scenes = options.scenes || {};
  this.sceneId = options.sceneId || null;

  this.__defineGetter__('scene', function() {
    return this.scenes[this.sceneId];
  }.bind(this));
};

SceneManager.prototype.setScene = function(sceneId) {
  if (this.scenes[sceneId] === undefined) {
    console.error('Tried to set an invalid scene ID ', sceneId);
  }

  this.sceneId = sceneId;
};

SceneManager.prototype.curtainsClosed = function(screen) {
  if (typeof this.scene.curtainsClosed === 'function') {
    this.scene.curtainsClosed(screen);
  }
};

SceneManager.prototype.curtainsOpen = function(screen) {
  if (typeof this.scene.curtainsOpen === 'function') {
    this.scene.curtainsOpen(screen);
  }
};

SceneManager.prototype.curtainsOpenStart = function(screen) {
  if (typeof this.scene.curtainsOpenStart === 'function') {
    this.scene.curtainsOpenStart(screen);
  }
};

SceneManager.prototype.destroyScene = function() {
  if (typeof this.scene.destroyScene === 'function') {
    this.scene.destroyScene();
  }
};
