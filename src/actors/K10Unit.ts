/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  nomads
* @license      Apache 2.0
*/

import { TileGrid } from "../TileGrid";
import { UnitData } from "../Hero";
import { SquadUnit } from "./SquadUnit";

export class K10Unit extends SquadUnit {

  private static idleAnim: Phaser.Animations.Animation;
  private static idleAnim2: Phaser.Animations.Animation;
  private static initializedSentry: boolean = false;

  

  constructor(scene: Phaser.Scene, x: number, y: number, grid: TileGrid, conf: UnitData) {
    super(scene, x, y, grid, conf);

    this.playUnitAnim('idle', true);

    let frames = this.conf.type == "k10" ? K10Unit.idleAnim.frames : K10Unit.idleAnim2.frames;
    this.anims.setCurrentFrame(frames[Math.floor((Math.random() * 8))]);

    if (this.conf.type == "k11") {
      this.scaleX = 1.5;
      this.scaleY = 1.5;
      this.shoot.spread = 6;
    } else {
      this.shoot.spread = 4;
    }
    this.combat.events.on('started_fight', () => {
      this.onStartedFight();
    });
  }

  public static deinit() {
    K10Unit.initializedSentry = false;
    K10Unit.idleAnim.destroy();
    K10Unit.idleAnim = null;
    K10Unit.idleAnim2.destroy();
    K10Unit.idleAnim2 = null;
  }

  protected isInitialized(): boolean {
    return K10Unit.initializedSentry;
  }
  protected setInitialized(value: boolean) {
    K10Unit.initializedSentry = value;
  }

  protected initializeOnce() {
    var idleAnim = {
      key: 'k10_idle',
      frames: this.scene.anims.generateFrameNumbers('k10_idle_anim_48x48', { start: 0, end: 7 }),
      frameRate: 5,
      repeat: -1,
      repeatDelay: 0
    };

    K10Unit.idleAnim = this.scene.anims.create(idleAnim);

    var idleAnim2 = {
      key: 'k11_idle',
      frames: this.scene.anims.generateFrameNumbers('k11_idle_anim_48x48', { start: 0, end: 7 }),
      frameRate: 5,
      repeat: -1,
      repeatDelay: 0
    };

    K10Unit.idleAnim2 = this.scene.anims.create(idleAnim2);
  }

  public playUnitAnim(key: string, ignoreIfPlaying: boolean) {

  }

  protected targetScanUpdate() {
    if (this.state.isFighting && !this.state.isChasing) {
      this.chase.start(this.state.fightTarget, this.conf.range, () => { });
    }
  }

  private onStartedFight() {
    console.log('EVT: fight started');

    let nearest = this.grid.findClosestUnits(this.tile, 'attack', 2);
    for (let squad of nearest) {
      // if (!squad.state.isMoving) {
        // console.log('wanna attack ' + squad.conf.id);
        if(!squad.state.isFighting && squad.conf.type != 'tower') {
          let dest = this.grid.gridToWorld(this.state.fightTarget.tile);
          squad.mover.moveTo(dest, true);
        }
      // }
    }
  }
  // Overrides


  update() {
    this.depth = this.y - 4;

    super.update();
    this.targetScanUpdate();

    this.flipX = false;

    let frames = this.conf.type == "k10" ? K10Unit.idleAnim.frames : K10Unit.idleAnim2.frames;
    let speed = null;
    if (this.state.isMoving) {
      speed = this.mover.speed;
    }
    else if (this.state.isFighting) {
      let t1 = this.tile;
      let t2 = this.state.fightTarget.tile;
      speed = { x: t2.j - t1.j, y: t2.i - t1.i }
    }

    if (this.state.isFighting || this.state.isMoving) {
      if (speed.x > 0 && speed.y == 0) this.anims.setCurrentFrame(frames[2])
      if (speed.x > 0 && speed.y > 0) this.anims.setCurrentFrame(frames[1])
      if (speed.x > 0 && speed.y < 0) this.anims.setCurrentFrame(frames[3])
      if (speed.x < 0 && speed.y == 0) this.anims.setCurrentFrame(frames[6])
      if (speed.x < 0 && speed.y < 0) this.anims.setCurrentFrame(frames[5])
      if (speed.x < 0 && speed.y > 0) this.anims.setCurrentFrame(frames[7])
      if (speed.x == 0 && speed.y > 0) this.anims.setCurrentFrame(frames[0])
      if (speed.x == 0 && speed.y < 0) this.anims.setCurrentFrame(frames[4])
    }
  }

  destroy() {
    super.destroy()
  }


  // public aggressedBy(who: BaseUnit) {
  // this.chase.start(who, this.conf.range, () => { });
  // }

}