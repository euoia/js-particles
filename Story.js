function Story(options) {
  this.scenes = options.scenes;

  // The current scene ID.
  this.sceneId = this.scenes.firstScene;

  // The delay between each line of story.
  this.storyDelay = 500;

  // Functions which write to the display.
  this.write = null;
  this.writePrompt = null;
  this.lockInput = null;

  // A function to call when finished writing the current story.
  this.end = null;
}

Story.prototype.getScene = function() {
  return this.scenes.sceneList[this.sceneId];
};

Story.prototype.startScene = function() {
  this.addStory(this.getScene().intro);
};

// Play some content then display the prompt..
Story.prototype.addStory = function(storyContent, cb) {
  if (typeof(storyContent) !== 'object') {
    storyContent = [storyContent];
  }

  // No callback? Show the prompt.
  if (cb === undefined) {
    cb = function() {
      window.setTimeout(this.showPrompt.bind(this), this.storyDelay);
    }.bind(this);
  }

  this.lockInput();
  this.playContent(storyContent, 0, cb);
};

// Play an array of content on a timer then call cb.
Story.prototype.playContent = function(content, contentIdx, cb) {
  line = content.slice(contentIdx, contentIdx + 1);
  this.write(line);

  contentIdx += 1;

  if (contentIdx < content.length) {
    window.setTimeout(
      this.playContent.bind(this, content, contentIdx, cb),
      this.storyDelay);
  } else {
    cb();
  }
};

Story.prototype.showPrompt = function() {
    this.writePrompt(this.getScene().prompt);
    if (typeof(this.end) === 'function') {
      this.end();
    }
};

// Set the callback to play when the current story is done.
Story.prototype.done = function(endFn) {
  if (this.end !== null) {
    console.error('this.end was already defined!');
  }

  this.end = endFn;
};

Story.prototype.loadScene = function(scene) {
  console.log('Loading scene', scene);
};

Story.prototype.handleInput = function(input) {
  var scene = this.getScene();
  var talkie = scene.talkies[input];
  var handled = false;

  if (talkie !== undefined) {
    this.addStory(talkie);

    handled = true;
  }

  var action = scene.actions[input];
  if (action !== undefined) {
    action(this);
    handled = true;
  }

  if (handled === false) {
    this.addStory(this.scenes.unhandledInputText);
  }
};

