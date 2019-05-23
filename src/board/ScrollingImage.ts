/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  gaminator 19
*/

import { Point } from "../types/Types";

export class ScrollingImage extends Phaser.GameObjects.Container {

  private imageA: Phaser.GameObjects.Image;
  private imageB: Phaser.GameObjects.Image;
  private speed: Point = {x: 0, y: 0}
  constructor(scene, x, y) {
    super (scene, x, y);

    this.imageA = new Phaser.GameObjects.Image(scene, 0, 0, '')
    this.imageA.setOrigin(0, 0)
    this.add(this.imageA)

    this.imageB = new Phaser.GameObjects.Image(scene, 0, 0, '')
    this.imageB.setOrigin(0, 0)
    this.add(this.imageB)
  }

  public configure(x: number, y: number, texture: string) {
    this.imageA.setTexture(texture);
    this.imageB.setTexture(texture);

    this.speed.x = x;
    this.speed.y = y;

    if (x != 0) {
      this.imageA.y = 0;
      this.imageB.y = 0;
      this.imageA.x = x > 0 ? - this.imageA.width : this.imageA.width;
      this.imageB.x = 0;
    } else if (y != 0){
      this.imageA.x = 0;
      this.imageB.x = 0;
      this.imageA.y = x > 0 ? - this.imageA.height : this.imageA.height;
      this.imageB.y = 0;
    }
  }

  update() {

    for (let img of [this.imageA, this.imageB]) {
      img.x += this.speed.x;
      img.y += this.speed.y;
    }


    let max: Point = {x: this.imageA.width, y: this.imageA.height};

    if (this.speed.x != 0) {
      if (this.speed.x > 0) {
        if (this.imageA.x >= max.x) {
          this.imageA.x = -max.x;
        } 
        if (this.imageB.x >= max.x) {
          this.imageB.x = -max.x;
        }
      } else if (this.speed.x < 0) {
        if (this.imageA.x <= -max.x) {
          this.imageA.x = max.x;
        } 
        if (this.imageB.x <= -max.x) {
          this.imageB.x = max.x;
        }
      }
    }

    if (this.speed.y != 0) {
      if (this.speed.y > 0) {
        if (this.imageA.y >= max.y) {
          this.imageA.y = -max.y;
        } 
        if (this.imageB.y >= max.y) {
          this.imageB.y = -max.y;
        }
      } else if (this.speed.y < 0) {
        if (this.imageA.y <= -max.y) {
          this.imageA.y = max.y;
        } 
        if (this.imageB.y <= -max.y) {
          this.imageB.y = max.y;
        }
      }
    }

  }
}
