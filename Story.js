function Story(options) {
  this.scenes = options.scenes;

  // The current scene ID.
  this.sceneId = this.scenes.firstScene;

  // The delay between each line of story.
  this.storyDelay = options.storyDelay;

  // Controls.
  this.controls = null;

  // A function to call when finished writing the current story.
  this.end = null;

  // The time that the scene started.
  // Used to display hints after a certain time.
  this.sceneStartTime = null;

  // The player items.
  this.items = [];
}

Story.prototype.getScene = function() {
  return this.scenes.sceneList[this.sceneId];
};

Story.prototype.startScene = function() {
  this.addStory(this.getScene().intro);
  this.sceneStartTime = Date.now();

  var hints = this.getScene().hints;
  for (var time in hints) {
    this.hintTimers.push(
      window.setTimeout(
        this.showHint.bind(this, hints[time]),
        time * 1000));
  }
};

// Play some content then display the prompt..
Story.prototype.addStory = function(storyContent, cb) {
  if (typeof(storyContent) !== 'object') {
    storyContent = [storyContent];
  }

  // No callback? Show the prompt and options.
  if (cb === undefined) {
    cb = function() {
      window.setTimeout(this.showPrompt.bind(this), this.storyDelay);
    }.bind(this);
  }

  this.controls.lockInput();
  this.playContent(storyContent, 0, cb);
};

// Play an array of content on a timer then call cb.
Story.prototype.playContent = function(content, contentIdx, cb) {
  line = content.slice(contentIdx, contentIdx + 1);
  this.controls.write(line);

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
  this.controls.writePrompt(this.getScene().getPrompt());
  this.controls.writeOptions(this.getScene().getOptions());
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

Story.prototype.transitionScene = function(newSceneId, content) {
  this.controls.closeCurtains(function () {
    this.addStory(content, function () {
      this.controls.openCurtains();
      this.sceneId = newSceneId;
      this.showPrompt();
    }.bind(this));
  }.bind(this));
};

Story.prototype.handleInput = function(input) {
  var scene = this.getScene();
  var handled = false;

  var talkie = scene.talkies[input];
  if (talkie !== undefined) {
    this.addStory(talkie);

    handled = true;
  }

  var firstWord = input.split(' ')[0];
  var action = scene.actions[firstWord];
  if (action !== undefined) {
    if (action(this, input) !== false) {
      handled = true;
    }
  }

  if (handled === false) {
    this.addStory(this.scenes.unhandledInputText);
  }
};

Story.prototype.showHint = function(hint) {
  console.log('showing hint', hint);
  this.addStory(hint);
};

Story.prototype.addItem = function(item) {
  this.items.push(item);
};
