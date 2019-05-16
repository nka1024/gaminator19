/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  nomads
* @license      Apache 2.0
*/

import { Point } from "../../types/Position";
import { Input } from "phaser";

export class CameraDragModule {
  private prevPointerX: number;
  private prevPointerY: number;
  private distance: Number;

  private scene:Phaser.Scene;

  private dragStart: Point;

  private cursorKeys: Input.Keyboard.CursorKeys;
  private wasdKeys: Object;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.cursorKeys = scene.input.keyboard.createCursorKeys();
    this.wasdKeys = scene.input.keyboard.addKeys('W,A,S,D');

    this.scene.events.on('pause', () => {
      this.resetKeys();
    });
    this.scene.events.on('resume', () => {
      this.resetKeys();
    });
  }

  private resetKeys() {
    if (this.scene && this.scene.input) {
      this.cursorKeys = this.scene.input.keyboard.createCursorKeys();
      this.scene.input.keyboard.removeKey('W');
      this.scene.input.keyboard.removeKey('A');
      this.scene.input.keyboard.removeKey('S');
      this.scene.input.keyboard.removeKey('D');
      this.scene.input.keyboard.removeKey(this.cursorKeys.down);
      this.scene.input.keyboard.removeKey(this.cursorKeys.up);
      this.scene.input.keyboard.removeKey(this.cursorKeys.left);
      this.scene.input.keyboard.removeKey(this.cursorKeys.right);
      this.wasdKeys = this.scene.input.keyboard.addKeys('W,A,S,D');
      this.wasdKeys = this.scene.input.keyboard.addKeys('W,A,S,D');
      this.cursorKeys.down.isDown = false;
      this.cursorKeys.up.isDown = false;
      this.cursorKeys.left.isDown = false;
      this.cursorKeys.right.isDown = false;
      this.wasdKeys['W'].isDown = false;
      this.wasdKeys['A'].isDown = false;
      this.wasdKeys['S'].isDown = false;
      this.wasdKeys['D'].isDown = false;
    }
  }


  // Public
  
  public update() {
    if (!this.scene) {
      return;
    }
    this.cameraDrag();
    this.cameraPan();
  }

  public get isDrag():boolean {
    return this.distance > 10;
  }
  

  // Private
  
  private cameraDrag() {
    let ptr = this.scene.input.activePointer;

    if (ptr.isDown) {
      if (!ptr.justDown) {
        this.scene.cameras.main.scrollX -= (ptr.x - this.prevPointerX)
        this.scene.cameras.main.scrollY -= (ptr.y - this.prevPointerY)
        this.distance = Phaser.Math.Distance.Between(this.dragStart.x, this.dragStart.y, ptr.x, ptr.y);
      } else {
        // this.distance = 0;
        this.dragStart = {x: ptr.x, y: ptr.y};
      }
      this.prevPointerX = ptr.x;
      this.prevPointerY = ptr.y
    }

    if (ptr.justUp) {
      this.prevPointerX = 0;
      this.prevPointerY = 0;
    } 

    if (!ptr.isDown && !ptr.justUp) {
      this.distance = 0;
    }
  }

  private cameraPan() {

    let speed = 8;
    if(this.cursorKeys.left.isDown || this.wasdKeys['A'].isDown) {
      this.scene.cameras.main.scrollX -= speed;
    }
    if(this.cursorKeys.right.isDown || this.wasdKeys['D'].isDown) {
      this.scene.cameras.main.scrollX += speed;
    }
    if(this.cursorKeys.up.isDown || this.wasdKeys['W'].isDown) {
      this.scene.cameras.main.scrollY -= speed;
    }
    if(this.cursorKeys.down.isDown || this.wasdKeys['S'].isDown) {
      this.scene.cameras.main.scrollY += speed;
    }
  }

  public destroy() {
    this.scene = null;
    this.dragStart = null;
    this.cursorKeys = null;
    this.wasdKeys = null;
  }
}