/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  gaminator 19
*/

export class PlayerDisplay extends Phaser.GameObjects.Container {
  
  private image: Phaser.GameObjects.Image;
  private linkTxt: Phaser.GameObjects.BitmapText;
  private hpTxt: Phaser.GameObjects.BitmapText;

  private hero: Phaser.GameObjects.Sprite;
  constructor(scene: Phaser.Scene) {
    super (scene);

    this.image = new Phaser.GameObjects.Image(scene, 0, 0, "player_data");
    this.image.setOrigin(0, 0);
    this.add(this.image);

    this.hero = new Phaser.GameObjects.Sprite(scene, 0, 0, '');
    this.hero.setOrigin(0,0)
    this.hero.play('player_idle_back_anim')
    this.hero.y = -36;
    this.hero.x = 10;
    scene.add.existing(this.hero);
    this.add(this.hero);

    this.linkTxt = new Phaser.GameObjects.BitmapText(scene, 40, 27, 'coco-8-yellow');
    this.linkTxt.letterSpacing = -1
    this.add(this.linkTxt);

    this.hpTxt = new Phaser.GameObjects.BitmapText(scene, 85, 10, 'coco-8-red');
    this.hpTxt.letterSpacing = -1
    this.add(this.hpTxt);
  }

  public populate(hp: number, link: number, linkMax: number) {
    this.linkTxt.text = link + '/' + linkMax;
    this.hpTxt.text = hp + '';

    this.hpTxt.x = hp < 10 ? 88 : 85; 
  }

  public addLink(link: number, linkMax: number) {
    this.linkTxt.text = link + '/' + linkMax;
    // this.linkTxt.text = 'dfdf';

    let linkUp = new Phaser.GameObjects.Sprite(this.scene, 0, 0, '');
    linkUp.setOrigin(0,0)
    linkUp.play('link_up_anim')
    linkUp.y = -16;
    linkUp.x = 10;
    this.scene.add.existing(linkUp);
    this.add(linkUp);
  }

}