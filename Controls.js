function Controls(options) {
  this.controls = options.controls;
  this.story = options.story;
  this.revealer = options.revealer;

  this.content = document.createElement('div');
  this.content.classList.add('content');
  this.controls.appendChild(this.content);

  this.story.controls = this;
  this.inputControl = null;

  this.story.startScene();
}

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

// DEPRECATED.
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

Controls.prototype.writeOptions = function(options) {
  var ul = document.createElement('ul');
  var li;

  for (var option in options) {
    li = document.createElement('li');
    li.classList.add('option');
    li.onclick = options[option].bind(null, this.story);

    li.innerHTML = option;
    ul.appendChild(li);
  }

  this.content.appendChild(ul);
  this.controls.scrollTop = 9999999;
};

Controls.prototype.closeCurtains = function(cb) {
  this.revealer.revealComplete = cb;
  this.revealer.startCurtainClose();
};

Controls.prototype.openCurtains = function(cb) {
  this.revealer.revealComplete = cb;
  this.revealer.startCurtainReveal();
};
