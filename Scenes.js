function Scene1 (options) {
  this.timesStoked = 0;

  this.intro = [
    "It is April 17th in the Mendip Hills.",
    "A touch of frost remains in the air.",
    "The stars shine brightly in the sky tonight.",
    "Jack is warming his hands on the fire when he hears a cry to the north.",
    "A cold chill runs down Jack's spine."
  ];
}

Scene1.prototype.getOptions = function() {
  var options = {
    'Explore to the north': this.explore,
    'Go into the house': this.goHouse
  };

  if (this.timesStoked < 3) {
    options['Stoke the fire'] = this.stoke.bind(this);
  }

  return options;
};

Scene1.prototype.getPrompt = function() {
  return "What will Jack do next?";
};

Scene1.prototype.explore = function(story) {
  story.transitionScene('tombos-body', [
    "Jack hesistently wanders north towards Luver's Lane whence came the cry.",
    "Upon entering the field he discovers an awful sight.",
    "The bloodied and mangled corpse of Tombo.",
    "Tombo has been mauled by a creature. Probably a wolf."
  ]);
};

Scene1.prototype.stoke = function(story) {
  this.timesStoked += 1;

  thisStory = [];
  thisStory.push("Jack stokes the fire. It crackles and sparks. It looks like it could last a while.");

  if (this.timesStoked === 3) {
    thisStory.push("The fire looks like it will burn for a while longer.");
  }

  // TODO: Allow addStory then addStory again.
  story.addStory(thisStory);
};

Scene1.prototype.goHouse = function(story) {
  story.transitionScene(
    'house',
    [
      "Jack leaves the warmth of the fire and goes back into the house...",
      "This bit isn't done yet."
    ]);
};

function SceneHouse () {
}

function SceneTombosBody () {
  this.tomboBeenExamined = false;
  this.tomboBeenSearched = false;
}

SceneTombosBody.prototype.getPrompt = function() {
  return "Tombo's body is lying there. What will Jack do?";
};

SceneTombosBody.prototype.getOptions = function() {
  var options = {
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

  if (this.tomboBeenExamined === false) {
    options['Examine Tombo'] = function (story) {
      this.tomboBeenExamined = true;
      story.addStory('His lifeless body is mangled beyond repair. Poor Tombo.');
    }.bind(this);
  }

  if (this.tomboBeenExamined === true &&
      this.tomboBeenSearched === false
  ) {
    options['Search Tombo'] = function (story) {
      story.addItem("miniature piano");
      this.tomboBeenSearched = true;
      story.addStory("Jack finds a miniature piano in Tombo's trouser pocket. How strange.");
    }.bind(this);
  }

  return options;
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
