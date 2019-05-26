/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  Tecnho Nomads: gameplay prototype
*/

export class FadeTransition extends Phaser.GameObjects.Image {
  
  private to: number;
  private step: number;

  public playing: boolean = false;

  private callback: () => void;

  constructor(scene, x , y) {
    super(scene, x, y, 'fade_505x300');

    this.depth = Number.MAX_VALUE;
    this.scaleX = 2;
    this.scaleY = 2;
    this.alpha = 0;
  }

  update() {
    if (!this.scene) return;
    
    this.x = this.scene.cameras.main.scrollX + this.scene.cameras.main.displayWidth/2
    this.y = this.scene.cameras.main.scrollY + this.scene.cameras.main.displayHeight/2

    if (this.alpha < this.to) {
      this.alpha += this.step
      if (this.alpha >= this.to) {
        this.alpha = this.to;
        this.playing = false;
        if (this.callback) this.callback();
      }
    }
    else if (this.alpha > this.to) {
      this.alpha -= this.step
      if (this.alpha <= this.to) {
        this.alpha = this.to;
        this.playing = false;
        if (this.callback) this.callback();
      }
    } else{
      this.playing = false;
    }
  }

  public alphaTransition(from: number, to: number, step: number, callback: () => void = null) {
    this.alpha = from;
    this.to = to;
    this.step = step;
    this.callback = callback;
    this.playing = true;
  }

}