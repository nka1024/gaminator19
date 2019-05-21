/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  gaminator 19
*/

import { Point } from "../types/Types";
import { TileGrid } from "../TileGrid";

export class WorldPlayer extends Phaser.GameObjects.Sprite {
  private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  private enterKey: Phaser.Input.Keyboard.Key;

  private facing: string = 'back';

  private speed: Point = {x: 0, y: 0}
  private maxSpeed: Point = {x: 1.5, y: 1}
  
  private walkSoundTimer: Phaser.Time.TimerEvent;
  private walkAudio: Phaser.Sound.BaseSound;
  constructor(scene: Phaser.Scene, x: number, y: number, private grid: TileGrid) {
    super(scene, x, y, '');

    this.play('player_idle_back_anim')

    this.cursorKeys = scene.input.keyboard.createCursorKeys();
    this.enterKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.originY = 0.65;

    this.walkAudio = this.scene.sound.add('walk_1', { loop: false, volume: 0.5 });
    this.walkSoundTimer = this.scene.time.addEvent({
      delay: 600 + Math.random() * 200,
      callback: this.playSound,
      callbackScope: this,
      loop: true,
      paused: false
    });
  }

  private playSound() {
    if (this.speed.x != 0 || this.speed.y != 0) {
      this.walkAudio.play();
    }
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
      
      // console.log(Math.floor(this.x) + ' : ' + Math.floor(this.y) + ': ' + this.grid.isWalkable(this.grid.worldToGrid({x: this.x, y: this.y})))
    }

    if (this.grid.isWalkable(this.grid.worldToGrid({x: this.x + this.speed.x, y: this.y}))) 
      this.x += this.speed.x;

    if (this.grid.isWalkable(this.grid.worldToGrid({x: this.x, y: this.y + this.speed.y}))) 
      this.y += this.speed.y;

    this.depth = this.y;
    if (this.enterKey.isDown) {
      console.log('x: ' + this.x + ' y: ' + this.y);
    }
  }
}