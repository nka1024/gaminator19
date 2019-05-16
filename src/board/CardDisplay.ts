/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  Tecnho Nomads: gameplay prototype
*/

import { Scene } from "phaser";
import { CardData } from "../types/Types";

export class CardDisplay extends Phaser.GameObjects.Container {

  private card: CardData;

  private frame: Phaser.GameObjects.Image;
  private link: Phaser.GameObjects.Image;
  private heart: Phaser.GameObjects.Image;
  private sword: Phaser.GameObjects.Image;

  private linkTxt: Phaser.GameObjects.BitmapText;
  private atkTxt: Phaser.GameObjects.BitmapText;
  private hpTxt: Phaser.GameObjects.BitmapText;

  constructor(scene: Scene) {
    super (scene);

    this.frame = new Phaser.GameObjects.Image(scene, 0, 0, "card_frame");
    this.heart = new Phaser.GameObjects.Image(scene, 0, 87, "icon_heart");
    this.sword = new Phaser.GameObjects.Image(scene, 1, 70, "icon_sword");
    this.link  = new Phaser.GameObjects.Image(scene, 1, 8, "icon_link");

    for (let img of [this.frame, this.heart, this.sword, this.link]) {
      img.setOrigin(0, 0);
      this.add(img);
    }

    this.linkTxt = new Phaser.GameObjects.BitmapText(scene, 12, 5, 'coco-8-yellow', '2');
    this.linkTxt.letterSpacing = -1
    this.add(this.linkTxt);

    this.atkTxt = new Phaser.GameObjects.BitmapText(scene, 12, 70, 'coco-8-white', '4');
    this.atkTxt.letterSpacing = -1
    this.add(this.atkTxt);

    this.hpTxt = new Phaser.GameObjects.BitmapText(scene, 12, 87, 'coco-8-red', '2');
    this.hpTxt.letterSpacing = -1
    this.add(this.hpTxt);
  }
  
  public populate(card: CardData) {
    this.card = card;

    this.linkTxt.text = card.link.toString();
    this.hpTxt.text = card.hp.toString();
    this.atkTxt.text = card.attack.toString();
  }
}