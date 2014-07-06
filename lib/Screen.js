function Screen(options) {
  this.screen = options.screen;
  this.foreground = options.foreground;
  this.background = options.background;
  this.startDelay = options.startDelay;
  this.width = options.width;
  this.height = options.height;
  this.revealTime = options.revealTime;
  this.startEvent = options.startEvent;
  this.ready = options.ready || function () {};

  this.revealStartTime = null;

  this.imageLoader = new ImageLoader();

  // Drawing the foreground layer.
  this.foregroundImg = this.imageLoader.load(this.foreground);
  this.fCanvas = document.createElement('canvas');
  this.fCtx = this.fCanvas.getContext('2d');
  this.screen.appendChild(this.fCanvas);

  this.fCanvas.width = options.width;
  this.fCanvas.height = options.height;
  this.fCanvas.style.position = 'absolute';
  this.fCanvas.style.top = '0';
  this.fCanvas.style.left = '0';

  this.imageLoader.done(function doneLoading() {
    this.drawScene();

    if (this.startDelay !== undefined) {
      window.setTimeout(this.startCurtainReveal.bind(this), this.startDelay);
    }

    this.ready();
  }.bind(this));
}

Screen.prototype.drawScene = function() {
  this.bCtx.drawImage(this.backgroundImg, 0, 0);
  this.fCtx.drawImage(this.foregroundImg, 0, 0);
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
    this.fCtx.clearRect(
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

    this.fCtx.clearRect(
      (this.width / 2) - (clearWidth / 2),
      0,
      clearWidth,
      this.height);

    window.requestAnimationFrame(close.bind(this));
  }

  close.call(this);
};

Screen.prototype.getForegroundCanvas = function() {
  return this.fCanvas;
};

Screen.prototype.setBackgroundImage = function(backgroundImageUrl) {
  this.backgroundImg = this.imageLoader.load(backgroundImageUrl);
  this.bCanvas = document.createElement('canvas');
  this.bCtx = this.bCanvas.getContext('2d');
  this.screen.appendChild(this.bCanvas);

  this.bCanvas.width = this.width;
  this.bCanvas.height = this.height;
};

Screen.prototype.getDOMElement = function() {
  return this.screen;
};
