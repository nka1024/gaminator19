/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  gaminator 19
*/

import { Scene } from "phaser";
import { CardData } from "../types/Types";
import { CardDetailsDisplay } from "./CardDetailsDisplay";

export class BoardSpot extends Phaser.GameObjects.Container {
  public card: CardData;

  private heart: Phaser.GameObjects.Image;
  private sword: Phaser.GameObjects.Image;
  private protected: Phaser.GameObjects.Image;
  private atkTxt: Phaser.GameObjects.BitmapText;
  private hpTxt: Phaser.GameObjects.BitmapText;
  
  private creature: Phaser.GameObjects.Image;
  private shadow: Phaser.GameObjects.Image;

  constructor(scene: Scene) {
    super(scene);

    this.shadow = new Phaser.GameObjects.Image(scene, 0, 0, 'spot_shadow')
    this.shadow.alpha = 0.4
    this.shadow.setOrigin(0.5, 1);
    this.shadow.y = -4
    this.add(this.shadow);

    this.creature = new Phaser.GameObjects.Image(scene, 0, 0, 'creature_doogie')
    this.creature.setOrigin(0.5, 1);
    this.creature.y = -4
    this.add(this.creature);

    this.sword = new Phaser.GameObjects.Image(scene, -15, 0, "icon_sword");
    this.add(this.sword);

    this.heart = new Phaser.GameObjects.Image(scene, 15, 0, "icon_heart");
    this.add(this.heart);

    this.atkTxt = new Phaser.GameObjects.BitmapText(scene, -14, 0, 'coco-8-white');
    this.atkTxt.letterSpacing = -1;
    this.add(this.atkTxt);

    this.hpTxt = new Phaser.GameObjects.BitmapText(scene, 9, 0, 'coco-8-red');
    this.hpTxt.letterSpacing = -1;
    this.add(this.hpTxt);

    this.protected = new Phaser.GameObjects.Image(scene, 0, 0, 'protected')
    this.protected.y = -34
    this.protected.x = 10
    this.add(this.protected);

    this.visible = false
  }

  public populate(card: CardData) {
    if (card != null) {
      this.visible = true;
      this.card = card;

      this.hpTxt.text = card.hp.toString();
      this.atkTxt.text = card.attack.toString();

      this.creature.setTexture(CardDetailsDisplay.creatureTextureByName(card.name));
      this.protected.visible = this.card.protected;
    } else {
      this.visible = false;
    }
  }

  public repopulate() {
    this.populate(this.card)
  }
}