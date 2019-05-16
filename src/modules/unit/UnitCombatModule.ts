/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  nomads
* @license      Apache 2.0
*/

import { IUnitModule } from "../interface/IUnitModule";
import { BaseUnit } from "../../actors/BaseUnit";
import { UnitMoverModule } from "./UnitMoverModule";
import { TileGrid } from "../../TileGrid";
import { Scene } from "phaser";
import { FloatingText } from "../../FloatingText";
import { EventEmitter } from "events";
import { UnitStateModule } from "./UnitStateModule";

export class UnitCombatModule implements IUnitModule {
  private owner: BaseUnit;
  private scene: Scene;
  private grid: TileGrid;

  private state: UnitStateModule;
  private mover: UnitMoverModule;

  private attackTimer: Phaser.Time.TimerEvent;
  private target: BaseUnit;

  public events: EventEmitter;

  public pacifist: boolean;

  constructor(owner: BaseUnit, scene: Scene, mover: UnitMoverModule, state: UnitStateModule, grid: TileGrid) {
    this.owner = owner;
    this.mover = mover;
    this.state = state;
    this.grid = grid;
    this.scene = scene;

    this.events = new EventEmitter();
    this.attackTimer = this.scene.time.addEvent({
      delay: 1000,
      callback: this.performAttack,
      callbackScope: this,
      loop: true,
      paused: true
    });

    this.mover.events.on('step_complete', () => {
      if (this.owner.conf.type != 'hero')
        this.findTargets();
    });
  }

  private setTarget(target: BaseUnit) {
    this.target = target;
    this.state.fightTarget = target;
    this.state.isFighting = target != null;
  }

  // Overrides

  private updateTargetsCnt: integer = 0;
  update() {

    if (!this.pacifist) {
      // start fight if attacker and defender are in the same tile
      // if (this.state.isChasing && !this.state.isFighting && !this.state.isMoving) {
      this.updateTargetsCnt += 1
      if (this.updateTargetsCnt > 20) {
        this.updateTargetsCnt = 0
        if (!this.state.isFighting && !this.state.isMoving && !this.state.isPathfinding) {
          this.findTargets();
        }
      }
    }
  }

  destroy() {
    this.stopFight('cleanup');
    if (this.attackTimer) this.attackTimer.destroy();
    this.attackTimer = null;
    this.state.fightTarget = null;
    this.state.isFighting = false;
    this.owner = null;
    this.scene = null;
    this.grid = null;
    this.mover = null;
    this.state = null;
  }


  // public

  public sufferAttack(attack: { attacker: BaseUnit, damage: number }) {
    if (!this.pacifist) {
      if (!this.state.isFighting && !this.state.isMoving && !this.state.isPathfinding) {
        if (this.isTargetInRange(attack.attacker)) {
          this.startFight(attack.attacker);
        }
      } else {
        if ((this.owner.conf.health - (attack.damage / this.owner.conf.armor)) <= 0) {
          this.stopFight("death");
        }
      }
    }

    // only destroy after all logic
    this.owner.conf.health -= attack.damage / this.owner.conf.armor;

    this.events.emit("damage_taken");
    if (this.owner.conf.health <= 0) {
      this.owner.events.emit('death');
    }
  }

  public startFight(target: BaseUnit) {
    if (!this.isTargetInRange(target)) {
      console.log('won\'t start fight - target too far')
      return;
    }
    console.log('start fight against: ' + target.conf.id);
    let direction = this.owner.perimeter.findRelativePerimeterSpot(target);
    this.setTarget(target);
    // this.owner.flipX = direction.j == 0;
    this.mover.pauseUpdates(true);
    this.owner.playUnitAnim('fight', true);

    // this.flipOriginByDirection(direction, false);
    // same tile
    this.attackTimer.paused = false;
    this.events.emit('started_fight');
  }

  /// reason: 'death', 'dead_target', 'no_target', 'return', 'command', 'target_too_far', 'cleanup'
  public stopFight(reason: string) {
    console.log('stop fight: ' + this.owner.conf.id + ' (reason: ' + reason + ')');
    if (this.mover) {
      this.mover.pauseUpdates(false);
    }
    this.setTarget(null);
    this.attackTimer.paused = true;

    if (reason != 'death' && reason != 'return') {
      this.events.emit('fight_end');
    }
  }

  // Private

  private performAttack() {
    if (this.target && this.state.isFighting) {
      if (!this.isTargetInRange(this.target)) {
        this.stopFight("target_too_far");
        return;
      }
    }

    if (!this.state.fightTarget || !this.state.fightTarget.active) {
      this.stopFight("no_target");
      return;
    }

    if (this.owner.conf.health <= 0) {
      console.log('stopping attack: target is dead');
      this.stopFight("dead_target")
    } else {
      let atk = this.owner.conf.attack + this.owner.conf.attackBonus + Math.floor(Math.random() * 3);
      let def = this.target.conf.defense + this.owner.conf.defenseBonus;

      let damage = atk - def;
      if (damage < 0) damage = 0;
      this.target.combat.sufferAttack({ attacker: this.owner, damage: damage });

      this.events.emit('damage_done', damage);
      this.showFloatyText(damage);
    }
  }

  private isTargetInRange(target: BaseUnit): boolean {
    let distance = this.grid.distance(this.owner.tile, target.tile, 'abs');
    return distance.i <= this.owner.conf.range && distance.j <= this.owner.conf.range;
  }

  private showFloatyText(damage: number) {
    let floatyX = this.target.x + Math.random() * 10 - 5;
    let floatyY = this.target.y - Math.random() * 10 - 10;
    let color = this.owner.conf.id.indexOf('enemy') != -1 ? 'red' : 'white';

    new FloatingText(this.scene, floatyX, floatyY, Math.floor(damage).toString(), color);
  }

  private findTargets() {
    if (this.owner.conf.type == 'harvester' || this.owner.conf.type == 'builder') {
      return;
    }
    let side = this.owner.side == "attack" ? "defend" : "attack";
    let nearest = this.grid.findClosestUnits(this.owner.tile, side, this.owner.conf.range);

    for (let squad of nearest) {
      // if (!squad.state.isMoving) {
      console.log('wanna attack ' + squad.conf.id);
      this.startFight(squad);
      break;
      // }
    }
  }

}