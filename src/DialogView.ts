/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  gaminator 19
*/

export class DialogView extends Phaser.GameObjects.Container {
  private textMain: Phaser.GameObjects.BitmapText;
  private textShadow: Phaser.GameObjects.BitmapText;
  private bg: Phaser.GameObjects.Image;
  private portrait: Phaser.GameObjects.Image;

  private enterAnim: Phaser.GameObjects.Sprite;

  constructor(scene, x, y) {
    super(scene, x, y);
    let tx = 60
    let ty = 218
  

    this.bg = this.scene.add.image(-20, 214, 'dialog_bg_505x86');
    this.bg.scaleX = 2;
    this.bg.scaleY = 2;
    this.bg.setOrigin(0, 0);
    this.bg.alpha = 1;
    this.add(this.bg);

    this.portrait = this.scene.add.image(40, 240, 'portrait_player_32x32');
    this.portrait.scaleX = 2;
    this.portrait.scaleY = 2;
    // this.portrait.setOrigin(0, 0);
    this.add(this.portrait);

    this.textShadow = this.scene.add.bitmapText(tx + 1, ty + 1, 'coco-8-shadow', '');
    this.textShadow.letterSpacing = -1;
    this.add(this.textShadow);

    this.textMain = this.scene.add.bitmapText(tx, ty, 'coco-8-white', '');
    this.textMain.letterSpacing = -1;
    this.add(this.textMain);

    this.enterAnim = new Phaser.GameObjects.Sprite(scene, 0, 0, 'enter_40x16');
    this.enterAnim.play('enter_key_anim')
    this.enterAnim.x = 480;
    this.enterAnim.y = 288;
    this.scene.add.existing(this.enterAnim);
    this.add(this.enterAnim)
  }

  public showText(text: string) {
    this.visible = true;
    let max = 80;
    let l = 0;
    let words = text.split(' ');
    let result = '';
    for (let word of words) {
      if (result.length + word.length > max + l) {
        result += '\n';
        l = result.length
      }
      result += '  ' + word;
    }
    
    this.textMain.text = result;
    this.textShadow.text = result;
  }

  public hide() {
    this.visible = false;
  }

  update() {
    this.bringToTop(this.textMain);
    this.depth = Number.MAX_VALUE - 1;
    this.x = this.scene.cameras.main.scrollX;
    this.y = this.scene.cameras.main.scrollY;
  }
}