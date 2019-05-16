/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  nomads
* @license      Apache 2.0
*/

import { TileGrid } from "../TileGrid";
import { ISelectable } from "./ISelectable";
import { BaseUnit } from "./BaseUnit";
import { UnitData } from "../Hero";
import { CONST } from "../const/const";

export class SquadUnit extends BaseUnit implements ISelectable {

  private static initialized: boolean = false;

  protected onFightEnd: () => void;

  constructor(scene: Phaser.Scene, x: number, y: number, grid: TileGrid, conf: UnitData) {

    super(scene, x, y, CONST.SQUAD_SPEED, grid, conf, 'infantry_1_idle_48x48');

    this.core.addModules([this.selection]);

    this.onFightEnd = () => {
    };
    this.combat.events.on('fight_end', this.onFightEnd);
    
    if(!this.isInitialized()) {
      this.setInitialized(true);
      this.initializeOnce();
    }

    this.playUnitAnim('idle', true);
  }

  protected isInitialized():boolean {
    return SquadUnit.initialized;
  }
  protected setInitialized(value: boolean) {
    SquadUnit.initialized = value;
  }

  protected initializeOnce() {
  
  }

  public playUnitAnim(key: string, ignoreIfPlaying: boolean) {
  }

  update() {
    this.visible = !this.grid.isFog(this.tile);

    this.depth = this.y - 4;

    super.update();

    if (this.mover.speed.x > 0) this.flipX = false;
    if (this.mover.speed.x < 0) this.flipX = true;
  
  }

  destroy() {
    if (this.combat) this.combat.events.removeListener('fight_end', this.onFightEnd);

    this.combat = null;
    this.progress = null;
    this.selection = null;
    super.destroy()
  }

  public aggressedBy(who: BaseUnit) {
    this.chase.start(who, this.conf.range, () => { });
  }

}