'use strict';

var $ = require('jquery')(window),
  Screen = require('./lib/Screen.js'),
  TextOverlay = require('./lib/TextOverlay.js'),
  SceneManager = require('./lib/SceneManager.js'),
  Controls = require('./lib/Controls.js'),
  Game = require('./lib/Game.js'),
  SceneFireside = require('./scenes/SceneFireside.js'),
  SceneTombosBody = require('./scenes/SceneTombosBody.js'),
  SceneHouse = require('./scenes/SceneHouse.js'),
  SceneGameOver = require('./scenes/SceneGameOver.js');


$.ready(function() {

  var s = new Screen({
    screen: document.getElementById('screen'),
    foreground: './img/curtains.jpg',
    width: 1276,
    height: 284,
    revealTime: 7000,
    ready: function () {
      var t = new TextOverlay({
        canvas: this.foregroundLayer,
        textTitle: 'Murder in the Mendip Hills',
        textSubtitle: 'click to begin'
      });

      t.render();
    }
  });

  var sm = new SceneManager({
    'scenes': {
      fireside: new SceneFireside(),
      tombosBody: new SceneTombosBody(),
      house: new SceneHouse(),
      gameOver: new SceneGameOver()
    },
    sceneId: 'fireside'
  });

  var c = new Controls ({
    controls: document.getElementById('controls')
  });

  var g = new Game ({
    sceneManager: sm,
    controls: c,
    screen: s,
    storyDelay: 2000
  });

  g.start();
});
