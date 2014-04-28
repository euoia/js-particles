function Scene1 (options) {
  this.intro = [
    "It is April 17th in the Mendip Hills.",
    "A touch of frost remains in the air.",
    "The stars shine brightly in the sky tonight.",
    "Jack is warming his hands on the fire when he hears a cry to the north.",
    "A cold chill runs down Jack's spine."
  ];
}

Scene1.prototype.getOptions = function() {
  return {
    'Explore to the north': this.explore,
    'Stoke the fire': this.stoke,
    'Go back into the house': this.goHouse
  };
};

Scene1.prototype.getPrompt = function() {
  return "What will Jack do next?";
};

Scene1.prototype.explore = function(story) {
  story.transitionScene('tombos-body', [
    "Jack hesistently wanders north towards luver's lane whence came the cry.",
    "Upon entering the field he discovers an awful sight.",
    "The bloodied and mangled corpse of Tombo.",
    "Tombo has been mauled by a creature. Probably a wolf."
  ]);
};

Scene1.prototype.stoke = function(story) {
  story.addStory("Jack stokes the fire. It crackles and sparks. It looks like it could last a while.");
};

Scene1.prototype.goHouse = function(story) {
  story.addStory("Jack leaves the warmth of the fire and goes back into the house...");
};

function SceneHouse () {
}

function SceneTombosBody () {
}

SceneTombosBody.prototype.getPrompt = function() {
  return "Tombo's body is lying there. What will Jack do?";
};

SceneTombosBody.prototype.getOptions = function() {
  return {
    'Examine Tombo': function (story) {
      story.addStory('His lifeless body is mangled beyond repair. Poor Tombo.');
    },
    'Go back to the fire': function (story) {
      story.transitionScene('scene1', [
        'Jack makes his way back to the fire.'
      ]);
    },
    'Venture further into the woods': function (story) {
      story.transitionScene('woods-wolf', [
        'Jack makes his way towards the woods.',
        'The sound of wolves howling becomes close.',
        "A sharp pain strikes deep into Jack's left calf muscle.",
        'It feels wet.',
        'Everything becomes dark.',
        'Jack is dead.'
      ]);
    }
  };
};


// TODO: Rename story?
function Scenes () {
  this.sceneList = {
    'scene1': new Scene1(),
    'tombos-body': new SceneTombosBody(),
    'house': new SceneHouse()
  };

  this.firstScene = 'scene1';
}
