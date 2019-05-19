/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  gaminator 19
*/

import { Point } from "../types/Types";

export class WorldPlayer extends Phaser.GameObjects.Sprite {
  private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;

  private facing: string = 'back';

  private speed: Point = {x: 0, y: 0}
  private maxSpeed: Point = {x: 1.5, y: 1}
  
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, '');

    this.play('player_idle_back_anim')

    this.cursorKeys = scene.input.keyboard.createCursorKeys();
  }

  public update() {
    if (this.cursorKeys.left.isDown) {
      this.speed.x = -this.maxSpeed.x;
      this.facing = 'left'
    } else if (this.cursorKeys.right.isDown) {
      this.speed.x = this.maxSpeed.x;
      this.facing = 'right'
    } else {
      this.speed.x = 0
    }

    if (this.cursorKeys.up.isDown) {
      this.speed.y = -this.maxSpeed.y;
      this.facing = 'back'
    } 
    else if (this.cursorKeys.down.isDown) {
      this.speed.y = this.maxSpeed.y;
      this.facing = 'front'
    } else {
      this.speed.y = 0;
    }

    if (this.speed.x != 0 && this.speed.y != 0) {
      this.speed.x *= 0.7;
      this.speed.y *= 0.7;
    }

    if (this.speed.x == 0 && this.speed.y == 0) {
      this.anims.play('player_idle_' + this.facing + '_anim', true);
    } else {
      this.anims.play('player_walk_' + this.facing + '_anim', true);
    }

    this.x += this.speed.x;
    this.y += this.speed.y;

    this.scene.cameras.main.scrollX = this.x - this.scene.cameras.main.displayWidth/2;
    this.scene.cameras.main.scrollY = this.y - this.scene.cameras.main.displayHeight/2;
  }
}