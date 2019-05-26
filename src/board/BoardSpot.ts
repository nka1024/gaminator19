/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  gaminator 19
*/

import { Scene, Animations } from "phaser";
import { CardData } from "../types/Types";
import { CardDetailsDisplay } from "./CardDetailsDisplay";
import { FloatingText } from "../FloatingText";

export class BoardSpot extends Phaser.GameObjects.Container {
  public card: CardData;

  private hp: Phaser.GameObjects.Image;
  private atk: Phaser.GameObjects.Image;
  private sandclock: Phaser.GameObjects.Image;
  private protected: Phaser.GameObjects.Image;
  private atkTxt: Phaser.GameObjects.BitmapText;
  private hpTxt: Phaser.GameObjects.BitmapText;
  private numbersBg: Phaser.GameObjects.Image;
  private creature: Phaser.GameObjects.Image;
  private screenAnim: Phaser.GameObjects.Sprite;

  constructor(scene: Scene, private isOpponent: boolean) {
    super(scene);

    this.screenAnim = new Phaser.GameObjects.Sprite(scene, 0,-7,'');
    // this.screenAnim.play('spot_screen_anim', false, Math.floor(Math.random()*23));
    this.screenAnim.visible = false;
    this.screenAnim.alpha = 0.75
    this.screenAnim.scaleY = isOpponent ? 1 : -1;
    this.scene.add.existing(this.screenAnim);
    this.add(this.screenAnim)
    
    this.numbersBg = new Phaser.GameObjects.Image(scene, 0, 8, 'numbers_highlight')
    this.add(this.numbersBg);
    this.creature = new Phaser.GameObjects.Image(scene, 0, 0, '')
    this.creature.setOrigin(0.5, 1);
    this.creature.y = 8
    this.add(this.creature);

    this.atk = new Phaser.GameObjects.Image(scene, -18, 8, "icon_attack");
    this.add(this.atk);

    this.hp = new Phaser.GameObjects.Image(scene, 18, 8, "icon_hp");
    this.add(this.hp);

    this.sandclock = new Phaser.GameObjects.Image(scene, 0, -32, "sandclock");
    this.add(this.sandclock);

    this.atkTxt = new Phaser.GameObjects.BitmapText(scene, -30, 0, 'coco-8-white');
    this.atkTxt.letterSpacing = -1;
    this.add(this.atkTxt);

    this.hpTxt = new Phaser.GameObjects.BitmapText(scene, 23, 0, 'coco-8-hp');
    this.hpTxt.letterSpacing = -1;
    this.add(this.hpTxt);

    this.protected = new Phaser.GameObjects.Image(scene, 1, 5, 'protected')
    this.add(this.protected);

    this.visible = false
  }

  public attack(direction: number, short: boolean) {
    let animKey = direction < 0 ? 'attack_blue_anim' : 'attack_yellow_anim';
    let body = new Phaser.GameObjects.Sprite(this.scene, 0, 0, animKey);

    body.play(animKey);
    body.on('animationcomplete', (anim: Animations.Animation, frame: Animations.AnimationFrame) => {
      body.destroy();
    });
    body.angle = direction < 0 ? 0 : 180;
    body.displayOriginX = 0;
    if (direction == -1) {
      body.y = -47
      body.x = -9
    } else {
      body.y = 30
      body.x = 11
    }
    this.scene.add.existing(body);
    this.add(body);
  }

  public populate(card: CardData) {
    let playSpawnAnim = false;
    if (card != null && this.card != card) {
      playSpawnAnim = true
    }

    this.screenAnim.visible = card != null;
    this.screenAnim.play('spot_screen_anim', false, Math.floor(Math.random()*23));
    if (card != null) {
      this.visible = true;
      this.card = card;

      this.sandclock.visible = card.turned;
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
      spawnAnim.y = -10;
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

  public deltaHPAnim(delta: number) {
    let text = (delta < 0 ? '-' : '+') + Math.abs(delta);
    new FloatingText(this.scene, this.x + this.hpTxt.x, this.y + this.hpTxt.y, text, 'hp');
  }

  public deltaAtkAnim(delta: number) {
    let text = (delta < 0 ? '-' : '+') + Math.abs(delta);
    new FloatingText(this.scene, this.x + this.atkTxt.x, this.y + this.hpTxt.y, text, 'white');
  }
}