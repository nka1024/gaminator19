/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  gaminator19
*/

export class BoxShadowOverlay extends Phaser.GameObjects.Image {
  constructor(scene,) {
    super(scene, 0, 0, 'box_shadow_1010x600');
    this.scaleX = 0.53;
    this.scaleY = 0.53;
    this.cameraFollow();
  }

  update() {
    this.depth = Number.MAX_VALUE;
    this.cameraFollow();
  }

  private cameraFollow() {
    this.x = this.scene.cameras.main.scrollX + this.scene.cameras.main.displayWidth/2
    this.y = this.scene.cameras.main.scrollY + this.scene.cameras.main.displayHeight/2
  }
}