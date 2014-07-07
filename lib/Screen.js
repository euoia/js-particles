function Screen(options) {
  this.screen = options.screen;
  this.foreground = options.foreground;
  this.startDelay = options.startDelay;
  this.width = options.width;
  this.height = options.height;
  this.revealTime = options.revealTime;
  this.startEvent = options.startEvent;
  this.ready = options.ready || function () {};

  // The background image is set by setBackgroundImage.
  this.backgroundImg = null;
  this.bCanvas = null;
  this.bCtx = null;

  this.imageLoader = new ImageLoader();

  // Create drawing layers.
  [{
    name: 'foregroundLayer',
    zIndex: 3
  },
  {
    name: 'effectsLayer',
    zIndex: 2
  },
  {
    name: 'backgroundLayer',
    zIndex: 1
  }].forEach(function (layer) {
    var newLayer = document.createElement('canvas');
    newLayer.style.zIndex = layer.zIndex;
    newLayer.width = options.width;
    newLayer.height = options.height;
    newLayer.style.position = 'absolute';
    newLayer.style.top = '0';
    newLayer.style.left = '0';
    this.screen.appendChild(newLayer);

    this[layer.name] = newLayer;
    this[layer.name + 'Context'] = newLayer.getContext('2d');
  }.bind(this));

  this.foregroundImg = this.imageLoader.load(this.foreground);

  this.imageLoader.done(function doneLoading() {
    this.drawScene();

    if (this.startDelay !== undefined) {
      window.setTimeout(this.startCurtainReveal.bind(this), this.startDelay);
    }

    this.ready();
  }.bind(this));
}

Screen.prototype.drawScene = function() {
  if (this.backgroundImg) {
    this.backgroundLayerContext.drawImage(this.backgroundImg, 0, 0);
  }

  if (this.foregroundImg) {
    this.foregroundLayerContext.drawImage(this.foregroundImg, 0, 0);
  }
};

// Start from center and wipe out the foreground image.
Screen.prototype.openCurtains = function(cb) {
  var animationStartTime = Date.now();

  function open() {

    var timePassed = Date.now() - animationStartTime;
    var clearWidth = (timePassed / this.revealTime) * this.width;

    // Recursion base case.
    if (clearWidth >= this.width) {
      if (typeof cb === 'function') {
        cb();
      }

      return;
    }

    this.drawScene();
    this.foregroundLayerContext.clearRect(
      (this.width / 2) - (clearWidth / 2),
      0,
      clearWidth,
      this.height);

    window.requestAnimationFrame(open.bind(this));
  }

  open.call(this);
};

Screen.prototype.closeCurtains = function(cb) {
  console.log('Closing the curtains');
  var animationStartTime = Date.now();

  function close() {
    this.drawScene();

    var timePassed = Date.now() - animationStartTime;
    var clearWidth = this.width - ((timePassed / this.revealTime) * this.width);

    // Recursion base case.
    if (clearWidth <= 0) {
      if (typeof cb === 'function') {
        cb();
      }

      return;
    }

    this.foregroundLayerContext.clearRect(
      (this.width / 2) - (clearWidth / 2),
      0,
      clearWidth,
      this.height);

    window.requestAnimationFrame(close.bind(this));
  }

  close.call(this);
};

Screen.prototype.setBackgroundImage = function(backgroundImageUrl) {
  if (this.bCanvas !== null) {
    console.log('Removing background image');
    this.backgroundLayer.removeChild(this.bCanvas);
  }

  if (backgroundImageUrl === undefined) {
    console.error('Must provide a valid backgroundImageUrl');
    return;
  }

  this.backgroundImg = this.imageLoader.load(backgroundImageUrl);
  this.bCanvas = document.createElement('canvas');
  this.bCtx = this.bCanvas.getContext('2d');
  this.backgroundLayer.appendChild(this.bCanvas);

  this.bCanvas.width = this.width;
  this.bCanvas.height = this.height;
};

Screen.prototype.getDOMElement = function() {
  return this.screen;
};
