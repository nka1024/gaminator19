/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  gaminator 19
*/

import { MapTriggerData, MapTriggerType } from "../modules/scene/MapImporterModule";
import { Tile } from "../types/Types";
import { MapTriggers } from "../MapTriggers";

export class Triggers {
  private usedTriggers: any = {};
  private triggers: MapTriggerData[] = []

  private currentTile: Tile;

  constructor() {
  }

  public import(triggers: MapTriggerData[]) {
    this.triggers = triggers;
  }

  public checkTrigger(tile: Tile): MapTriggerData {
    if (!this.currentTile || tile.j != this.currentTile.j || tile.i != this.currentTile.i) {
      this.currentTile = tile
      for (let trigger of this.triggers) {
        if (tile.i == trigger.i && tile.j == trigger.j) {
          if (this.usedTriggers[trigger.name] && trigger.type == MapTriggerType.Once) {
            return null;
          } else {
            this.usedTriggers[trigger.name] = true
            return trigger;
          }
        }
      }
    }
  }

  public add(o: MapTriggerData) {
    o.type = MapTriggers.typeByRawType(o.typeRaw);
    this.triggers.push(o)
  }
}