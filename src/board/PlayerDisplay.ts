/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  gaminator 19
*/

export class PlayerDisplay extends Phaser.GameObjects.Container {
  
  private link: Phaser.GameObjects.Image;
  private hp: Phaser.GameObjects.Image;
  private linkTxt: Phaser.GameObjects.BitmapText;
  private hpTxt: Phaser.GameObjects.BitmapText;

  private hero: Phaser.GameObjects.Sprite;
  private opponent: Phaser.GameObjects.Image;

  private isPlayer: boolean = true;
  constructor(scene: Phaser.Scene) {
    super (scene);

    this.link = new Phaser.GameObjects.Image(scene, 34, 0, "icon_link");
    this.link.setOrigin(0, 0);
    this.add(this.link);

    this.hp = new Phaser.GameObjects.Image(scene, 24, 0, "icon_hp");
    this.hp.setOrigin(0, 0);
    this.add(this.hp);

    this.opponent = new Phaser.GameObjects.Image(scene, 0, 0, '');
    this.opponent.visible = false;
    this.add(this.opponent);

    this.hero = new Phaser.GameObjects.Sprite(scene, 0, 0, '');
    // this.hero.setOrigin(0,0)
    this.hero.play('player_idle_back_anim')
    this.hero.y = 0;
    this.hero.x = 0;
    scene.add.existing(this.hero);
    this.add(this.hero);

    this.linkTxt = new Phaser.GameObjects.BitmapText(scene, 34, 16, 'coco-8-yellow');
    this.linkTxt.letterSpacing = -1
    this.add(this.linkTxt);

    this.hpTxt = new Phaser.GameObjects.BitmapText(scene, 24, 16, 'coco-8-hp');
    this.hpTxt.letterSpacing = -1
    this.add(this.hpTxt);

    let dx = -61;
    let dy = 3;
    this.hpTxt.setPosition(14 + dx, -1 + dy)
    this.linkTxt.setPosition(31 + dx, -1 + dy)
    this.hp.setPosition(16 + dx, -9 + dy)
    this.link.setPosition(34 + dx, -9 + dy)
  }

  public setTexture(texture: string) {
    this.opponent.visible = true;
    this.hero.visible = false;
    this.isPlayer = false;
    this.opponent.setTexture(texture);
    this.linkTxt.setPosition(31, -1)
    this.hpTxt.setPosition(14, -1)
    this.link.setPosition(34, -9)
    this.hp.setPosition(16, -9)
  }

  public populate(hp: number, link: number, linkMax: number) {
    this.linkTxt.text = link + '/' + linkMax;
    this.hpTxt.text = hp + '';

    if (this.isPlayer) {
      this.hpTxt.x = hp < 10 ? -44 : -47; 
    } else {
      this.hpTxt.x = hp < 10 ? 17 : 14; 
    }
  }

  public addLink(link: number, linkMax: number) {
    this.linkTxt.text = link + '/' + linkMax;

    let linkUp = new Phaser.GameObjects.Sprite(this.scene, 0, 0, '');
    linkUp.setOrigin(0,0)
    linkUp.play('link_up_anim')
    if (this.isPlayer) {
      linkUp.y = -56;
      linkUp.x = -65;
    }
    this.scene.add.existing(linkUp);
    this.add(linkUp);
  }

}