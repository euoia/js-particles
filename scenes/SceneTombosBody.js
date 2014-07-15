function SceneTombosBody () {
  this.tomboBeenExamined = false;
  this.tomboBeenSearched = false;

  this.imageUrl = './img/tombos-body.png';
}

SceneTombosBody.prototype.getPrompt = function() {
  return "Tombo's body is lying there. What will Jack do?";
};

SceneTombosBody.prototype.getOptions = function() {
  var options = {
    'Go back to the fire': function (game) {
      game.transitionScene('fireside', [
        'Jack makes his way back to the fire.'
      ]);
    },
    'Venture further into the woods': function (game) {
      game.transitionScene('gameOver', [
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
    options['Examine Tombo'] = function (game) {
      this.tomboBeenExamined = true;
      game.addStory('His lifeless body is mangled beyond repair. Poor Tombo.');
    }.bind(this);
  }

  if (this.tomboBeenExamined === true &&
      this.tomboBeenSearched === false
  ) {
    options['Search Tombo'] = function (game) {
      game.addItem("miniature piano");
      this.tomboBeenSearched = true;
      game.addStory("Jack finds a miniature piano in Tombo's trouser pocket. How strange.");
    }.bind(this);
  }

  return options;
};
