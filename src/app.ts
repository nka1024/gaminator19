/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  gaminator 19
* @license      Apache 2.0
*/

/// <reference path="./phaser.d.ts"/>
import "phaser";

import { BootScene } from "./scenes/bootScene";
import { BoardScene } from "./scenes/BoardScene";
import { WorldScene } from "./scenes/WorldScene";
import { EditorRootScene } from "./scenes/editorRootScene";
import { DeckScene } from "./scenes/DeckScene";
import { IntroScene } from "./scenes/IntroScene";

var game = null;

export class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}

window.onload = () => {
  var c = document.getElementById('canvas_main') as HTMLCanvasElement;
  const config: Phaser.Types.Core.GameConfig = {
    title: "gaminator 19",
    url: "https://github.com/nka1024/gaminator19",
    version: "1.0",
    // type: Phaser.AUTO,
    type: Phaser.WEBGL,
    // type: Phaser.WEBGL,
    parent: "game",
    scene: [new BootScene, new BoardScene, new DeckScene, new WorldScene, new EditorRootScene, new IntroScene],
    input: {
      keyboard: true,
      mouse: true,
      touch: true,
      gamepad: false
    },
    physics: null,
    disableContextMenu: true,
    backgroundColor: "#000000",
    // backgroundColor: "#0c0f12",
    // backgroundColor: "#b8b021",
    render: {
      pixelArt: true,
      antialias: false,
      roundPixels: true
    },
    canvas: c,
    canvasStyle: "position: fixed; top: 0; left: 0"
  };


  game = new Game(config);
  resize(window.innerWidth, window.innerHeight);

  reverse(document.body);
  // nw.Window.get().leaveFullscreen();
  // nw.App.closeAllWindows();
};

function reverse(n) {        // Reverse the order of the children of Node n
  var kids = n.childNodes;   // Get the list of children
  var numkids = kids.length; // Figure out how many there are
  for(var i = numkids-1; i >= 0; i--) {  // Loop through them backwards
      var c = n.removeChild(kids[i]);    // Remove a child
      n.appendChild(c);                  // Put it back at its new position
  }
}

// prevent page scrolling on mobile
document.ontouchmove = function (event) {
  event.preventDefault();
}

// handle window resizingwpr
window.addEventListener('resize', () => {
  resize(window.innerWidth, window.innerHeight);
}, false);

function resize(width, height) {
  let evenW = Phaser.Math.FloorTo(width/2)*2;
  let evenH = Phaser.Math.FloorTo(height/2)*2;
  console.log("resize " + width + ' ' + height);
  game.scale.resize(evenW, evenH);
}
