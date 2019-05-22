/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  gaminator 19
*/

export class DialogView extends Phaser.GameObjects.Container {
  private textMain: Phaser.GameObjects.BitmapText;
  private textName: Phaser.GameObjects.BitmapText;
  private textShadow: Phaser.GameObjects.BitmapText;
  private textNameShadow: Phaser.GameObjects.BitmapText;
  private bg: Phaser.GameObjects.Image;
  private portrait: Phaser.GameObjects.Image;

  private enterAnim: Phaser.GameObjects.Sprite;

  constructor(scene, x, y) {
    super(scene, x, y);
    let tx = 60
    let ty = 232

    this.bg = this.scene.add.image(-20, 214, 'dialog_bg_505x86');
    this.bg.scaleX = 2;
    this.bg.scaleY = 2;
    this.bg.setOrigin(0, 0);
    this.bg.alpha = 1;
    this.add(this.bg);

    this.portrait = this.scene.add.image(32, 240, 'portrait_player_32x32');
    this.portrait.scaleX = 2;
    this.portrait.scaleY = 2;
    // this.portrait.setOrigin(0, 0);
    this.add(this.portrait);

    this.textShadow = this.scene.add.bitmapText(tx, ty + 1, 'coco-8-shadow', '');
    this.textShadow.letterSpacing = -1;
    this.add(this.textShadow);

    this.textMain = this.scene.add.bitmapText(tx, ty, 'coco-8-white', '');
    this.textMain.letterSpacing = -1;
    this.add(this.textMain);

    this.textNameShadow = this.scene.add.bitmapText(tx, ty - 16 + 1, 'coco-8-shadow', '');
    this.textNameShadow.letterSpacing = -1;
    this.add(this.textNameShadow);

    this.textName = this.scene.add.bitmapText(tx, ty - 16, 'coco-8-white', '');
    this.textName.letterSpacing = -1;
    this.add(this.textName);

    this.enterAnim = new Phaser.GameObjects.Sprite(scene, 0, 0, 'enter_40x16');
    this.enterAnim.play('enter_key_anim')
    this.enterAnim.x = 480;
    this.enterAnim.y = 288;
    this.scene.add.existing(this.enterAnim);
    this.add(this.enterAnim)
  }

  public showText(texture: string, name: string, message: string) {
    this.visible = true;
    let max = 70;
    let l = 0;
    let words = message.split(' ');
    let result = '';
    for (let word of words) {
      if (result.length + word.length > max + l) {
        result += '\n';
        l = result.length
      }
      result += word + '  ';
    }
    
    this.textMain.text = result;
    this.textShadow.text = result;

    this.textName.text = name;
    this.textNameShadow.text = name;

    if (texture) {
      this.portrait.visible = true;
      this.portrait.setTexture(texture)
    } else {
      this.portrait.visible = false;
    }
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