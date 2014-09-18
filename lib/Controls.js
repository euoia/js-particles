'use strict';

var Controls = module.exports = function (options) {
  this.controls = options.controls;
  this.content = document.createElement('div');
  this.content.classList.add('content');
  this.controls.appendChild(this.content);
  this.inputControl = null;
};

Controls.prototype.write = function(content) {
  var p = document.createElement('p');
  p.innerHTML = content;
  this.content.appendChild(p);
  this.controls.scrollTop = 9999999;
};

Controls.prototype.writePrompt = function(promptText) {
  var p = document.createElement('p');
  p.innerHTML = promptText;
  this.content.appendChild(p);
};

Controls.prototype.handleSubmit = function(event) {
  if (event.which !== 13) {
    return;
  }

  // Send text to the game, or store text and wait for the game to read it.
};

Controls.prototype.lockInput = function() {
  if (this.inputControl !== null) {
    this.inputControl.readOnly = true;
  }
};

// Print a list of options to the player.
// @param {array} options An array of options. The key is the text to the
// display, the value is function to call when the option is chosen.
// @param {function} cb The function that will be called when a choice is
// clicked. The function associated with the option will be passed to the
// callback.
Controls.prototype.writeOptions = function(options, cb) {
  var ul = document.createElement('ul');
  var li;

  for (var option in options) {
    if (options.hasOwnProperty(option)) {
      li = document.createElement('li');
      li.classList.add('option');
      li.onclick = cb.bind(null, options[option]);
      li.innerHTML = option;
      ul.appendChild(li);
    }
  }

  this.content.appendChild(ul);
  this.controls.scrollTop = 9999999;
};
