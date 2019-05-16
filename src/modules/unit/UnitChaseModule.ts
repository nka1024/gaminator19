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
import { Tile, Point } from "../../types/Position";
import { UnitStateModule } from "./UnitStateModule";

export class UnitChaseModule implements IUnitModule {

  private owner: BaseUnit;
  private mover: UnitMoverModule;
  private state: UnitStateModule;
  private grid: TileGrid;
  private range: number;

  private onChaseComplete: () => void;
  private lastDest: { i: number, j: number };

  private target: BaseUnit;

  private claimedDest: Tile;

  constructor(owner: BaseUnit, state: UnitStateModule, mover: UnitMoverModule, grid) {
    this.owner = owner;
    this.mover = mover;
    this.state = state;

    this.grid = grid;
  }

  private setTarget(target: BaseUnit) {
    this.target = target;
    if (this.state) {
      this.state.chaseTarget = target;
      this.state.isChasing = target != null;
    }
  }

  private claimDest(tile: Tile) {
    if (this.grid.isFree(tile)) {
      this.grid.claimDest(tile);
      this.claimedDest = tile;
    }
  }

  private unclaimDest() {
    if (this.claimedDest) {
      this.grid.unclaimDest(this.claimedDest);
      this.claimedDest = null;
    }
  }

  public deployDefender(target: BaseUnit) {
    this.start(target, 1, null);
  }

  public start(target: BaseUnit, range: number, onComplete: () => void) {
    this.range = range;
    this.unclaimDest();
    this.setTarget(target);
    
    this.lastDest = this.grid.worldToGrid(target);
    let tile = this.grid.findClosestFreeTile(target.tile, this.owner.tile);

    // stops at current tile when target in range
    let stopWhenInRange = () => {
      if (this.targetInRange(range)) {
        this.mover.stop();
        this.unclaimDest();
        this.claimDest(this.owner.tile);
        return true;
      } else {
        return false;
      }
    };
    if (stopWhenInRange()){
     return;
    }
    let onStepComplete = (stepsToGo: number, nextDest: Point) => {
      if (stopWhenInRange()) {
        return
      }
      if (stepsToGo == 1) {
        if (!this.grid.isFree(this.grid.worldToGrid(nextDest))) {
          this.start(target, range, onComplete);
        }
      }
    };
    let onPathComplete = () => {
      if (!this.mover.claimedTile) {
        this.start(target, range, onComplete);
      } else {
        if (onComplete) onComplete();
      }
    };
    
    this.mover.onPathComplete = onPathComplete;
    this.mover.onStepComplete = onStepComplete;
    this.mover.moveTo(this.grid.gridToWorld(tile), true);
    this.claimDest(tile);
  }


  public stop() {
    this.setTarget(null);
    this.unclaimDest();
    this.mover.onPathComplete = null;
    this.mover.onStepComplete = null;
    this.onChaseComplete = null;
  }

  private targetInRange(range: number): boolean {
    let distance = this.gridDistanceToTarget();
    return Math.abs(distance.i) <= range && Math.abs(distance.j) <= range;
  }

  private gridDistanceToTarget(): Tile {
    return this.grid.distanceXY(this.owner, this.target);
  }


  // Overrides

  update() {
    if (this.target) {
      if (this.lastDest.i != this.target.tile.i || this.lastDest.j != this.target.tile.j) {
        if (!this.targetInRange(this.range)) {
          this.start(this.target, this.range, this.onChaseComplete);
        }
        else {
          this.lastDest.i = this.target.tile.i;
          this.lastDest.j = this.target.tile.j;
        }
      }
    }
  }

  destroy() {
    this.unclaimDest();
    this.setTarget(null);
    this.owner = null;
    this.mover = null;
    this.grid = null;
    this.state = null;
    this.onChaseComplete = null;
    this.lastDest = null;
  }

}