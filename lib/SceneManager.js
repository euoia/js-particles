function SceneManager (options) {
  this.scenes = options.scenes || {};
  this.sceneId = options.sceneId || null;

  this.__defineGetter__('scene', function() {
    return this.scenes[this.sceneId];
  }.bind(this));
}

SceneManager.prototype.setScene = function(sceneId) {
  if (this.scenes[sceneId] === undefined) {
    console.error('Tried to set an invalid scene ID ', sceneId);
  }

  this.sceneId = sceneId;
};

SceneManager.prototype.drawScene = function(screen) {
  if (typeof this.scene.drawScene === 'function') {
    this.scene.drawScene(screen);
  }
};

SceneManager.prototype.destroyScene = function() {
  if (typeof this.scene.destroyScene === 'function') {
    this.scene.destroyScene();
  }
};
