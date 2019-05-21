/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  gaminator 19
*/

import { MapTriggerData, MapTriggerType } from "./modules/scene/MapImporterModule";
import { Tile } from "./types/Types";

export class MapTriggers {

  public triggers: MapTriggerData[];

  constructor() {
  }

  public load(triggers: MapTriggerData[]) {
    if (!triggers) {
      this.triggers = []
    } else {
      this.triggers = triggers

      for (let trigger of this.triggers) {
        trigger.type = MapTriggers.typeByRawType(trigger.typeRaw);
      }
    }
  }

  public isTriggered(trigger: string) {
    // return this.flags[trigger]
  }

  public getTrigger(tile: Tile): MapTriggerData {
    for (let trigger of this.triggers) {
      if (trigger.i == tile.i && trigger.j == tile.j) {
        return trigger;
      }
    }
  }

  public removeTrigger(tile: Tile) {
    this.triggers.splice(this.triggers.indexOf(this.getTrigger(tile)), 1);
  }

  public addTrigger(tile: Tile, name: string, typeRaw: string) {
    while (this.getTrigger(tile)) {
      this.removeTrigger(tile)
    }
    let trigger: MapTriggerData = {
      i: tile.i,
      j: tile.j,
      name: name,
      typeRaw: typeRaw,
      type: MapTriggers.typeByRawType(typeRaw)
    }
    this.triggers.push(trigger)
  }

  public editTrigger(tile: Tile, name: string, typeRaw: string) {
    let trigger = this.getTrigger(tile);
    trigger.type = MapTriggers.typeByRawType(typeRaw);
    trigger.typeRaw = typeRaw
    trigger.name = name;
  }

  public static typeByRawType(rawType: string) {
    switch (rawType) {
      case 'once': return MapTriggerType.Once;
      case 'repeat': return MapTriggerType.Repeatable;
      default: return MapTriggerType.Undefined;
    }
  }
}