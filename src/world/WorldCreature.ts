/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  gaminator 19
*/

import { Animations } from "phaser";

export class WorldCreature extends Phaser.GameObjects.Sprite {
  private animPlaying: boolean;
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, '');

    // this.play();
    // this.on('animationcomplete', (anim: Animations.Animation, frame: Animations.AnimationFrame) => {
    //   this.animPlaying = false;
    // });

    // this.visible = false
  }

  public update() {
    if (!this.animPlaying && Math.random() > 0.99) {
      this.play('bubble'+Math.floor(Math.random()*3 + 1)+'_anim');
      this.animPlaying = true;
      this.visible = true;
    }
  }

  public playFireAnim() {
    this.play('fire_anim');
    this.animPlaying = true;
    this.visible = true;
  }
}