function Controls(options) {
  this.controls = options.controls;
  this.story = options.story;

  // TODO: Possibly just pass in the controls object.
  this.story.write = this.write.bind(this);
  this.story.writePrompt = this.writePrompt.bind(this);
  this.story.lockInput = this.lockInput.bind(this);

  this.inputControl = null;

  this.content = '';

  this.story.startScene();

}

Controls.prototype.write = function(content) {
  var p = document.createElement('p');
  p.innerHTML = content;
  this.controls.appendChild(p);

  this.controls.scrollTop = 9999999;
};

Controls.prototype.writePrompt = function(promptText) {
  var p = document.createElement('p');
  p.innerHTML = promptText;
  this.controls.appendChild(p);
  this.addPrompt(p);
};

Controls.prototype.addPrompt = function(element) {
  if (this.inputControl !== null) {
    // Unbind the old input.
    this.inputControl.readOnly = true;
    this.inputControl.onkeyup = null;
  }

  // Create a new input.
  this.inputControl = document.createElement('input');
  this.inputControl.onkeyup = this.handleSubmit.bind(this);
  element.appendChild(this.inputControl);
  this.inputControl.focus();
};

Controls.prototype.handleSubmit = function(event) {
  if (event.which !== 13) {
    return;
  }

  this.story.handleInput(this.inputControl.value);
};

Controls.prototype.lockInput = function() {
  if (this.inputControl !== null) {
    this.inputControl.readOnly = true;
  }
};
