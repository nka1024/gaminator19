/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  gaminator 19
*/

export class DialogView extends Phaser.GameObjects.Container {
  private textMain: Phaser.GameObjects.BitmapText;
  private textName: Phaser.GameObjects.BitmapText;
  private bg: Phaser.GameObjects.Image;
  private portrait: Phaser.GameObjects.Image;
  private cursor: Phaser.GameObjects.Image;

  private enterAnim: Phaser.GameObjects.Sprite;

  private options: Phaser.GameObjects.BitmapText[] = [];
  private optLenght: number = 0;
  private cursorPos: number = 0;

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

    this.cursor = this.scene.add.image(0, 0, 'turn_current_8x8');
    this.cursor.visible = false;
    this.add(this.cursor);

    this.portrait = this.scene.add.image(32, 240, 'portrait_player_32x32');
    this.portrait.scaleX = 2;
    this.portrait.scaleY = 2;
    this.add(this.portrait);

    this.textMain = this.scene.add.bitmapText(tx, ty, 'coco-8-white', '');
    this.textMain.letterSpacing = -1;
    this.add(this.textMain);

    this.textName = this.scene.add.bitmapText(tx, ty - 16, 'coco-8-white', '');
    this.textName.letterSpacing = -1;
    this.add(this.textName);

    this.enterAnim = new Phaser.GameObjects.Sprite(scene, 0, 0, 'enter_40x16');
    this.enterAnim.play('enter_key_anim')
    this.enterAnim.x = 480;
    this.enterAnim.y = 288;
    this.scene.add.existing(this.enterAnim);
    this.add(this.enterAnim);

    for (let i = 0; i < 3; i++) {
      let option = this.scene.add.bitmapText(tx + 16, 300 - 14 - i * 16, 'coco-8-white', '');
      option.letterSpacing = -1;
      this.add(option);
      this.options.push(option)
    }
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
    this.textName.text = name;

    if (texture) {
      this.portrait.visible = true;
      this.portrait.setTexture(texture)
    } else {
      this.portrait.visible = false;
    }
  }

  public addOption(text: string) {
    this.options[this.optLenght].text = text;
    this.optLenght++
    
    this.setCursorHidden(false);
    this.moveCursor(0);
    this.moveCursor(-this.optLenght);
  }

  public hide() {
    this.visible = false;
    this.optLenght = 0;
    for (let option of this.options) {
      option.text = '';
    }
    this.setCursorHidden(true);
  }

  public moveCursor(delta: number) {
    this.cursorPos -= delta
  
    if (this.cursorPos < 0) this.cursorPos = 0;
    if (this.cursorPos >= this.optLenght) this.cursorPos = this.optLenght - 1;

    this.cursor.x = 68
    this.cursor.y = 300 - 6 - this.cursorPos * 16;
  }

  public getCursorPos(): number {
    return this.cursorPos;
  }

  private setCursorHidden(hidden: boolean) {
    this.cursor.visible = !hidden;
  }

  update() {
    this.bringToTop(this.textMain);
    this.depth = Number.MAX_VALUE - 1;
    this.x = this.scene.cameras.main.scrollX;
    this.y = this.scene.cameras.main.scrollY;
  }
}