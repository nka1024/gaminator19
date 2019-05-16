/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  nomads
* @license      Apache 2.0
*/

import { IUnit } from "./IUnit";
import { UnitMoverModule } from "../modules/unit/UnitMoverModule";
import { ProgressModule } from "../modules/unit/ProgressModule";
import { UnitModuleCore } from "../modules/UnitModuleCore";
import { TileGrid } from "../TileGrid";
import { UnitPerimeterModule } from "../modules/unit/UnitPerimeterModule";
import { UnitData } from "../Hero";
import { UnitCombatModule } from "../modules/unit/UnitCombatModule";
import { UnitChaseModule } from "../modules/unit/UnitChaseModule";
import { Tile } from "../types/Position";
import { UnitStateModule } from "../modules/unit/UnitStateModule";
import { UnitSelectionModule } from "../modules/unit/UnitSelectionModule";
import { UnitShootModule } from "../modules/unit/UnitShootModule";
import { UnitExplosionModule } from "../modules/unit/UnitExplosionModule";
import { Geom } from "phaser";
import { UnitExperienceModule } from "../modules/unit/UnitExperienceModule";

export class BaseUnit extends Phaser.GameObjects.Sprite implements IUnit {

  public conf: UnitData;
  public destroyed: boolean;
  
  public grid: TileGrid;

  // modules
  public shoot: UnitShootModule;
  public combat: UnitCombatModule;
  public selection: UnitSelectionModule;
  public mover: UnitMoverModule;
  public progress: ProgressModule;
  public hp: ProgressModule;
  public perimeter: UnitPerimeterModule;
  public events: Phaser.Events.EventEmitter;
  public chase: UnitChaseModule;
  public state: UnitStateModule;
  public explosion: UnitExplosionModule;
  public experience: UnitExperienceModule;

  protected core: UnitModuleCore;

  constructor(scene: Phaser.Scene, x: number, y: number, speed: number, grid: TileGrid, conf:UnitData, texture: string) {
    super(scene, x, y, texture);
    this.conf = conf;
    this.grid = grid;

    
    this.events = new Phaser.Events.EventEmitter();
    
    this.selection  = new UnitSelectionModule(this, scene);
    this.perimeter  = new UnitPerimeterModule(this, grid);
    this.state      = new UnitStateModule(this);
    this.mover      = new UnitMoverModule(this, scene, this.state, grid, speed);
    this.progress   = new ProgressModule(this, scene, 'progress');
    this.hp         = new ProgressModule(this, scene, 'hp');
    this.chase      = new UnitChaseModule(this, this.state, this.mover, grid);
    this.shoot      = new UnitShootModule(this, scene, this.state);
    this.combat     = new UnitCombatModule(this, scene, this.mover, this.state, grid);
    this.explosion  = new UnitExplosionModule(this, scene, this.state, this.combat);
    this.experience = new UnitExperienceModule(this, scene);

    this.core = new UnitModuleCore([
      this.selection, 
      this.mover, 
      this.progress, 
      this.state, 
      this.perimeter, 
      this.hp, 
      this.chase, 
      this.combat, 
      this.explosion, 
      this.shoot,
      this.experience
    ]);

    this.setInteractive();

    this.input.hitArea = new Geom.Rectangle(10, 10, 28, 28);
  }

  public playUnitAnim(key: string, ignoreIfPlaying: boolean) {
    throw ("NOT IMPLEMENTED");
  }

  public update() {
    if (this.conf.health < 1) {
      this.hp.show();
    } else {
      this.hp.hide();
    }
    this.hp.progress = this.conf.health
    this.core.update();
  }

  public destroy() {
    if (this.core) this.core.destroy();

    this.core = null;
    this.mover = null;
    this.progress = null;
    this.destroyed = true;
    super.destroy()
  }

  public get tile(): Tile {
    return this.grid.worldToGrid(this);
  }

  public aggressedBy(who: BaseUnit) {
    
  }
  
  public get side():string {
    return this.conf.side;
  }
  public death() {
  }
}