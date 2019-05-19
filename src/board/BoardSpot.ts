/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  gaminator 19
*/

import { Scene, Animations } from "phaser";
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

  public attack(direction: number, short: boolean) {
    let body = new Phaser.GameObjects.Sprite(this.scene, 0,0, 'attack_anim');
    
    body.play('attack_anim');
    body.on('animationcomplete', (anim: Animations.Animation, frame: Animations.AnimationFrame) => {
      body.destroy();
    });
    body.angle = direction ? -90 : 90;
    body.displayOriginX = 0;
    body.scaleX = short ? 0.5 : 1; 
    this.scene.add.existing(body);
    this.add(body);
  }

  public populate(card: CardData) {
    let playSpawnAnim = false;
    if (card != null && this.card != card) {
      playSpawnAnim = true
    }

    if (card != null) {
      this.visible = true;
      this.card = card;

      this.hpTxt.text = card.hp.toString();
      this.atkTxt.text = card.attack.toString();

      this.creature.setTexture(CardDetailsDisplay.creatureTextureByName(card.name));
      this.protected.visible = this.card.protected;
    } else {
      this.card = null;
      this.visible = false;
    }

    if (playSpawnAnim) {
      this.creature.alpha = 0;
      let spawnAnim = new Phaser.GameObjects.Sprite(this.scene, 0, 0, '');
      spawnAnim.play('board_spawn_anim')
      spawnAnim.y = -20;
      spawnAnim.x = 0;
      this.scene.add.existing(spawnAnim);
      this.add(spawnAnim);
      spawnAnim.on('animationcomplete', (anim: Animations.Animation, frame: Animations.AnimationFrame) => {
        spawnAnim.destroy();
        let timer = this.scene.time.addEvent({
          delay: 10,
          callback: () => {
            this.creature.alpha += 0.04
            if (this.creature.alpha >= 1) {
              timer.destroy();
            }
          },
          callbackScope: this,
          loop: true,
          paused: false
        });
      });
    }
  }

  public repopulate() {
    this.populate(this.card)
  }
}