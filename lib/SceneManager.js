function SceneManager (options) {
  this.scenes = options.scenes || {};
  this.currentSceneId = options.currentSceneId || null;

  if (this.currentSceneId === null) {
    throw new Error('options.currentSceneId cannot be null.');
  }

  if (this.currentScene() === undefined) {
    console.error('SceneManager does not have a valid current scene.');
  }
}

SceneManager.prototype.currentScene = function() {
  return this.scenes[this.currentSceneId];
};
