function Game(options) {
  // The scene manager object.
  this.sceneManager = options.sceneManager;

  // The controls object.
  this.controls = options.controls;

  // The screen object.
  this.screen = options.screen;

  // The delay between each line of story.
  this.storyDelay = options.storyDelay;

  // A function to call when finished writing the current story.
  this.end = null;

  // The time that the scene started.
  // Used to display hints after a certain time.
  this.sceneStartTime = null;

  // The player items.
  this.items = [];

  this.screen.setBackgroundImage(this.sceneManager.currentScene().image);
  this.screen.getDOMElement().onclick = function() {
    this.screen.openCurtains(function () {
      this.startScene();
    }.bind(this));
  }.bind(this);
}

Game.prototype.startScene = function() {
  this.addGame(this.sceneManager.currentScene().intro);
  this.sceneStartTime = Date.now();

  var hints = this.sceneManager.currentScene().hints;
  for (var time in hints) {
    this.hintTimers.push(
      window.setTimeout(
        this.showHint.bind(this, hints[time]),
        time * 1000));
  }
};

// Play some content then display the prompt..
Game.prototype.addGame = function(storyContent, cb) {
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
Game.prototype.playContent = function(content, contentIdx, cb) {
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

Game.prototype.showPrompt = function() {
  this.controls.writePrompt(this.sceneManager.currentScene().getPrompt());
  this.controls.writeOptions(
    this.sceneManager.currentScene().getOptions(),
    function (choiceFn) {
      console.log('A choice was made');
      choiceFn.call(this.sceneManager.currentScene(), this);
    }.bind(this)
  );

  if (typeof(this.end) === 'function') {
    this.end();
  }
};

// Set the callback to play when the current story is done.
Game.prototype.done = function(endFn) {
  if (this.end !== null) {
    console.error('this.end was already defined!');
  }

  this.end = endFn;
};

Game.prototype.transitionScene = function(newSceneId, content) {
  this.screen.closeCurtains(function () {
    this.addGame(content, function () {
      this.screen.openCurtains();
      this.sceneId = newSceneId;
      this.showPrompt();
    }.bind(this));
  }.bind(this));
};

Game.prototype.handleInput = function(input) {
  var scene = this.sceneManager.currentScene();
  var handled = false;

  var talkie = scene.talkies[input];
  if (talkie !== undefined) {
    this.addGame(talkie);

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
    // TODO: Is this used?
    console.error('Unhandled input!');
  }
};

Game.prototype.showHint = function(hint) {
  console.log('showing hint', hint);
  this.addGame(hint);
};

Game.prototype.addItem = function(item) {
  this.items.push(item);
};
