function Scene1 (options) {
  this.intro = [
    "It is April 17th in the Mendip Hills.",
    "A touch of frost remains in the air.",
    "The stars shine brightly in the sky tonight.",
    "Jack is warming his hands on the fire when he hears a cry.",
    "A cold chill runs down Jack's spine."
  ];

  this.talkies = {
    run: 'Where would you run to?',
    sing: "Fa la la la la. Nothing happens.",
    shout: "You shout for help but no one comes."
  };

  this.actions = {
    explore: this.explore
  };

  this.prompt = "What will Jack do next?";
}

Scene1.prototype.explore = function(story) {
  story.addStory([
    "You explore the immediate area...",
    "You come across a blodied corpse."
  ],
  function () {
    story.loadScene('scene2');
  }.bind(this));
};

function Scene2 () {
}

// TODO: Rename story?
function Scenes () {
  this.sceneList = {
    'scene1': new Scene1(),
    'scene2': new Scene2()
  };

  this.firstScene = 'scene1';

  // TODO: Should be able to override this in each scene.
  this.unhandledInputText = "That doesn't seem to work.";
}
