function SceneFireside (options) {
  this.timesStoked = 0;

  this.intro = [
    "It is April 17th in the Mendip Hills.",
    "A touch of frost remains in the air.",
    "The stars shine brightly in the sky tonight.",
    "Jack is warming his hands on the fire when he hears a cry to the north.",
    "A cold chill runs down Jack's spine."
  ];

  this.image = './img/scene-1-the-fireside.png';
}

SceneFireside.prototype.getOptions = function() {
  var options = {
    'Explore to the north': this.explore,
    'Go into the house': this.goHouse
  };

  if (this.timesStoked < 3) {
    options['Stoke the fire'] = this.stoke.bind(this);
  }

  return options;
};

SceneFireside.prototype.getPrompt = function() {
  return "What will Jack do next?";
};

SceneFireside.prototype.explore = function(story) {
  story.transitionScene('tombos-body', [
    "Jack hesistently wanders north towards Luver's Lane whence came the cry.",
    "Upon entering the field he discovers an awful sight.",
    "The bloodied and mangled corpse of Tombo.",
    "Tombo has been mauled by a creature. Probably a wolf."
  ]);
};

SceneFireside.prototype.stoke = function(story) {
  this.timesStoked += 1;

  thisStory = [];
  thisStory.push("Jack stokes the fire. It crackles and sparks. It looks like it could last a while.");

  if (this.timesStoked === 3) {
    thisStory.push("The fire looks like it will burn for a while longer.");
  }

  // TODO: Allow addStory then addStory again.
  story.addStory(thisStory);
};

SceneFireside.prototype.goHouse = function(story) {
  story.transitionScene(
    'house',
    [
      "Jack leaves the warmth of the fire and goes back into the house...",
      "This bit isn't done yet."
    ]);
};

SceneFireside.prototype.drawScene = function(story) {
  p = new Particles({
    screen: document.getElementById('screen'),
    width: 1276,
    height: 284,
    backgroundImage: this.backgroundImage
  });
};
