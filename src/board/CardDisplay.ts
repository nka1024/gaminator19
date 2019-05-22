/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  gaminator 19
*/

import { Scene } from "phaser";
import { CardData } from "../types/Types";
import { CardDetailsDisplay } from "./CardDetailsDisplay";

export class CardDisplay extends Phaser.GameObjects.Container {

  public card: CardData;

  private frame: Phaser.GameObjects.Image;
  private link: Phaser.GameObjects.Image;
  private heart: Phaser.GameObjects.Image;
  private sword: Phaser.GameObjects.Image;

  private creature: Phaser.GameObjects.Image;
  private cardMask: Phaser.GameObjects.Image;

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

    this.linkTxt = new Phaser.GameObjects.BitmapText(scene, 12, 5, 'coco-8-yellow');
    this.linkTxt.letterSpacing = -1
    this.add(this.linkTxt);

    this.atkTxt = new Phaser.GameObjects.BitmapText(scene, 12, 70, 'coco-8-white');
    this.atkTxt.letterSpacing = -1
    this.add(this.atkTxt);

    this.hpTxt = new Phaser.GameObjects.BitmapText(scene, 12, 87, 'coco-8-red');
    this.hpTxt.letterSpacing = -1
    this.add(this.hpTxt);

    this.creature = new Phaser.GameObjects.Image(scene, 0,0, 'creature_doogie')
    this.cardMask = new Phaser.GameObjects.Image(scene, 0,0, 'card_mask')
    this.cardMask.setOrigin(0,0)
    this.creature.setOrigin(0.5,0)
    this.creature.x = 9
    this.creature.y = 22
    this.cardMask.visible = false;
    this.creature.mask = new Phaser.Display.Masks.BitmapMask(scene, this.cardMask);
    this.add(this.creature)
  }
  
  public populate(card: CardData):CardDisplay {
    this.card = card;

    this.creature.visible = this.card != null;
    this.heart.visible    = this.card != null;
    this.sword.visible    = this.card != null;
    this.link.visible     = this.card != null;
    if (this.card != null) {
      this.linkTxt.text = card.link.toString();
      this.hpTxt.text = card.hp.toString();
      this.atkTxt.text = card.attack.toString();

      this.creature.setTexture(CardDetailsDisplay.creatureTextureByName(card.name));
    } else {
      this.linkTxt.text = ''
      this.hpTxt.text = ''
      this.atkTxt.text = ''
    }
    return this;
  }

  update() {
    this.cardMask.x = this.x
    this.cardMask.y = this.y
    let parent = this.parentContainer
    while(parent) {
      this.cardMask.x += parent.x;
      this.cardMask.y += parent.y;
      parent = parent.parentContainer
    }
  }
}