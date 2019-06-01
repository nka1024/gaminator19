/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  gaminator 19
* @license      Apache 2.0
*/

import { CONST } from "../const/const";

export class BootScene extends Phaser.Scene {
  constructor() {
    super({
      key: "BootScene"
      
    });
    this.sys
  }

  update(): void {
    console.log("BootScene complete");
    if (document.baseURI.indexOf("editor.html") != -1) {
      this.scene.start("EditorRootScene");
    } else {
      if (CONST.INTRO) {
        this.scene.start("IntroScene");
      } 
      else {
        // this.scene.start("IntroScene", {win: true});
        // this.scene.start("DeckScene");
        this.scene.start("WorldScene");
        // this.scene.start("BoardScene");
      }
    }
  }
}
