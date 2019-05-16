/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  nomads
* @license      Apache 2.0
*/

import { IUnitModule } from "../interface/IUnitModule";
import { BaseUnit } from "../../actors/BaseUnit";
import { Scene, GameObjects } from "phaser";
import { UI_DEPTH } from "../../const/const";
import { UnitStateModule } from "./UnitStateModule";
import { UnitCombatModule } from "./UnitCombatModule";

export class UnitExplosionModule implements IUnitModule {

  private static explode1: Phaser.Animations.Animation;
  private static explode2: Phaser.Animations.Animation;
  private owner: BaseUnit;
  private scene: Scene;
  private state: UnitStateModule;
  private combat: UnitCombatModule;

  private sprites: GameObjects.Sprite[] = [];

  constructor(owner: BaseUnit, scene: Scene, state: UnitStateModule, combat: UnitCombatModule) {
    this.owner = owner;
    this.scene = scene;
    this.state = state;
    this.combat = combat;

    this.combat.events.on('visual_damage_taken', this.onVisualDamageTaken);
    this.init();
  }

  private init() {
    if (!UnitExplosionModule.explode1) {
      var explode1: AnimationConfig = {
        key: 'explosion1',
        frames: this.scene.anims.generateFrameNumbers('explosion_anim_1_48x48', { frames: [0, 1, 2, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6] }),
        frameRate: 26,
        repeat: 0,
        repeatDelay: 0,
        hideOnComplete: true
      };
      UnitExplosionModule.explode1 = this.scene.anims.create(explode1);

      var explode2: AnimationConfig = {
        key: 'explosion2',
        frames: this.scene.anims.generateFrameNumbers('explosion_anim_3_48x48', { frames: [0, 1, 2, 3, 4, 4, 4, 5, 5, 5, 6, 6,6, 7, 7,7,8,8,8,9,9,9] }),
        frameRate: 26,
        repeat: 0,
        repeatDelay: 0,
        hideOnComplete: true
      };
      UnitExplosionModule.explode2 = this.scene.anims.create(explode2);
    }
  }

  private onVisualDamageTaken = () => {
    if (this.sprites.length > 0) {
      if (this.sprites[0].anims.currentFrame.index == 1) {
        return
      }
      if (this.sprites.length >= 2) {
        return;
      } else if (Math.random() > 1) {
        return
      }
    }
    let offset = 10;
    let x = Math.floor(Math.random() * offset) - offset / 2;
    let y = Math.floor(Math.random() * offset) - offset / 2;
    let sprite = this.scene.add.sprite(this.owner.x + x, this.owner.y + y, 'explosion_anim_1_48x48');
    sprite.depth = UI_DEPTH.EXPLOSIONS;
    let key = Math.random() > 0.3 ? 'explosion1' : 'explosion2';
    sprite.anims.load(key);
    sprite.anims.play(key);
    sprite.alpha = 0.8;
    if (key == 'explosion2') {
      sprite.alpha = 1;
      // sprite.scaleX = 0.5
      // sprite.scaleY = 0.5
    }
    this.sprites.push(sprite);
  }


  // overrides

  update() {
    for (let sprite of this.sprites) {
      if (!sprite.visible) {
        sprite.destroy()
      }
    }
    this.sprites = this.sprites.filter((o, idx, arr) => { return o.active });
  }

  destroy() {
    this.combat.events.removeListener('visual_damage_taken', this.onVisualDamageTaken);
    for (let sprite of this.sprites) {
      sprite.destroy()
    }
    this.sprites = null;
    this.owner = null;
    this.scene = null;
    this.state = null;
  }

}