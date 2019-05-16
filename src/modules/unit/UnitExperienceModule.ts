/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  nomads
* @license      Apache 2.0
*/

import { IUnitModule } from "../interface/IUnitModule";
import { BaseUnit } from "../../actors/BaseUnit";
import { Hero } from "../../Hero";
import { Scene } from "phaser";
import { FloatingText } from "../../FloatingText";

export class UnitExperienceModule implements IUnitModule {

  private owner: BaseUnit;
  private scene: Scene;

  public events: Phaser.Events.EventEmitter;

  constructor(owner: BaseUnit, scene: Scene) {
    this.owner = owner;
    this.scene = scene;
    this.events = new Phaser.Events.EventEmitter();
  }

  public addExperience(experience: number) {
    let conf = this.owner.conf;
    conf.experience += experience;

    if (conf.experience > Hero.expTable[conf.level - 1]) {
      conf.level++
      this.events.emit('level_up', conf.level);
      this.showFloatyText(conf.level + ' level', 'yellow')
    }
  }

  private showFloatyText(text: string, color: string) {
    let floatyX = this.owner.x - 20;
    let floatyY = this.owner.y - 20;

    new FloatingText(this.scene, floatyX, floatyY, text, color);
  }

  // Overrides

  update() {
  }

  destroy() {
    this.owner = null;
    if (this.events) this.events.removeAllListeners();
    this.events = null;
    this.scene = null;
  }

}