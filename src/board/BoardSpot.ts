/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  gaminator 19
*/

import { Scene } from "phaser";

export class BoardSpot extends Phaser.GameObjects.Container {
  private heart: Phaser.GameObjects.Image;
  private sword: Phaser.GameObjects.Image;
  private atkTxt: Phaser.GameObjects.BitmapText;
  private hpTxt: Phaser.GameObjects.BitmapText;
  
  private creature: Phaser.GameObjects.Image;
  
  constructor(scene: Scene) {
    super(scene);

    this.sword = new Phaser.GameObjects.Image(scene, -15, 0, "icon_sword");
    // this.sword.setOrigin(0, 0);
    this.add(this.sword);


    this.heart = new Phaser.GameObjects.Image(scene, 15, 0, "icon_heart");
    // this.heart.setOrigin(0, 0);
    this.add(this.heart);

    this.atkTxt = new Phaser.GameObjects.BitmapText(scene, -6, 0, 'coco-8-white');
    this.atkTxt.letterSpacing = -1
    this.add(this.atkTxt);

    this.hpTxt = new Phaser.GameObjects.BitmapText(scene, 6, 0, 'coco-8-red');
    this.hpTxt.letterSpacing = -1
    this.add(this.hpTxt);

    this.creature = new Phaser.GameObjects.Image(scene, 0,0, 'creature_doogie')
    this.creature.setOrigin(0.5, 1)
    
  }
}