function Revealer(options) {
  this.screen = options.screen;
  this.foreground = options.foreground;
  this.background = options.background;
  this.startDelay = options.startDelay;
  this.width = options.width;
  this.height = options.height;
  this.revealTime = options.revealTime;
  this.startEvent = options.startEvent;
  this.revealComplete = options.revealComplete || function () {};
  this.drawComplete = options.drawComplete || function () {};

  this.revealStartTime = null;

  this.imageLoader = new ImageLoader();

  // Drawing the backround layer.
  if (this.background) {
    this.backgroundImg = this.imageLoader.load(this.background);
    this.bCanvas = document.createElement('canvas');
    this.bCtx = this.bCanvas.getContext('2d');
    this.screen.appendChild(this.bCanvas);

    this.bCanvas.width = options.width;
    this.bCanvas.height = options.height;
  }

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

    if (this.startEvent !== undefined) {
      this.screen[this.startEvent] = this.startCurtainReveal.bind(this);
    }

    this.drawComplete();
  }.bind(this));
}

Revealer.prototype.drawScene = function() {
  if (this.background) {
    this.bCtx.drawImage(this.backgroundImg, 0, 0);
  }

  this.fCtx.drawImage(this.foregroundImg, 0, 0);
};

// Start from center and wipe out the foreground image.
Revealer.prototype.startCurtainReveal = function() {
  this.revealStartTime = Date.now();
  this.curtainReveal();
};

Revealer.prototype.curtainReveal = function() {
  var timePassed = Date.now() - this.revealStartTime;
  var clearWidth = (timePassed / this.revealTime) * this.width;

  // Recursion base case.
  if (clearWidth >= this.width) {
    this.revealComplete();
    return;
  }

  this.drawScene();
  this.fCtx.clearRect(
    (this.width / 2) - (clearWidth / 2),
    0,
    clearWidth,
    this.height);

  window.requestAnimationFrame(this.curtainReveal.bind(this));
};

Revealer.prototype.startCurtainClose = function() {
  this.revealStartTime = Date.now();
  this.curtainClose();
};

Revealer.prototype.curtainClose = function() {
  var timePassed = Date.now() - this.revealStartTime;
  var clearWidth = this.width - ((timePassed / this.revealTime) * this.width);

  // Recursion base case.
  if (clearWidth <= 0) {
    this.drawScene();
    this.revealComplete();
    return;
  }

  this.drawScene();
  this.fCtx.clearRect(
    (this.width / 2) - (clearWidth / 2),
    0,
    clearWidth,
    this.height);

  window.requestAnimationFrame(this.curtainClose.bind(this));
};

Revealer.prototype.getForegroundCanvas = function() {
  return this.fCanvas;
};
