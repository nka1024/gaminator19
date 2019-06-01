/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  gaminator 19
*/

import { DialogLine, Story } from "./Story";
import { Dialogs } from "./Dialogs";
import { Point } from "./types/Types";

export enum EncounterName {
  UNKNOWN = '',
  TRANSPORT_PLATFORM = 'transport_platform_terminal',
  POMP_FILTER = 'pomp_filter_terminal',
  EXOSUIT = 'exosuit_terminal',
  DATA_CACHE_1 = 'data_cache_1_terminal',
  DEAD_TECHNICIAN = 'dead_technician',
  CRYSTAL = 'crystal_interaction',
  SPHERE = 'sphere'
}

export type Encounter = {
  name: EncounterName,
  damage: number
  start: DialogLine[],
  denied?: DialogLine[],
  victory: DialogLine[],
  defeat: DialogLine[],
  repeat: DialogLine[],
  interact: Point,

  deny?: boolean,
  defeated?: boolean,
}

export class Encounters {

  private encounters: Encounter[] = [
    { 
      name: EncounterName.TRANSPORT_PLATFORM,
      damage: 0,
      start:   Dialogs.transportPlatformStart,
      repeat:  Dialogs.transportPlatformRepeat,
      defeat:  Dialogs.transportPlatformDefeat,
      victory: Dialogs.transportPlatformVictory,
      interact: {x: 3540, y: 157},
    },
    { 
      name: EncounterName.EXOSUIT,
      damage: 0,
      start:   Dialogs.exosuitStart,
      repeat:  Dialogs.exosuitRepeat,
      defeat:  Dialogs.exosuitDefeat,
      victory: Dialogs.exosuitVictory,
      interact: {x: 168, y: 152},
    },
    { 
      name: EncounterName.POMP_FILTER,
      damage: 0,
      start:   Dialogs.pompFilterStart,
      repeat:  Dialogs.pompFilterRepeat,
      defeat:  Dialogs.pompFilterDefeat,
      victory: Dialogs.pompFilterVictory,
      interact: {x: 500, y: 44},
    },
    { 
      name: EncounterName.DATA_CACHE_1,
      damage: 0,
      start:   Dialogs.dataCache1Start,
      repeat:  Dialogs.dataCache1Repeat,
      defeat:  Dialogs.dataCache1Defeat,
      victory: Dialogs.dataCache1Victory,
      interact: {x: 464, y: 450},
    },
    { 
      name: EncounterName.DEAD_TECHNICIAN,
      damage: 0,
      deny: true,
      start:   Dialogs.technicianStart,
      repeat:  Dialogs.technicianRepeat,
      denied:  Dialogs.technicianDenied,
      defeat:  Dialogs.technicianDefeat,
      victory: Dialogs.technicianVictory,
      interact: {x: 944, y: 318},
    },
    { 
      name: EncounterName.SPHERE,
      damage: 0,
      start:   Dialogs.sphereStart,
      repeat:  Dialogs.sphereRepeat,
      defeat:  Dialogs.sphereDefeat,
      victory: Dialogs.sphereVictory,
      interact: {x: 1560, y: 492},
    }
  ]

  public currentEncounter: Encounter;
  constructor(private story: Story) {

  }

  public checkInteractXY(name: string): Point {
    for (let encounter of this.encounters) {
      if (encounter.name == name) {
        return encounter.interact;
      }
    }
    return null;
  }

  public startEncounter(name: string) {
    let encounter = this.encounterByName(name)
    if (encounter) {
      if (encounter.defeated && encounter.repeat) {
        this.story.startDialog(encounter.repeat);
        this.currentEncounter = encounter;
      } else if (!encounter.defeated && encounter.start){
        this.story.startDialog(encounter.start);
        this.currentEncounter = encounter;
      }
    }
  }

  public deniedEncounterDialog(name: string) {
    let encounter = this.encounterByName(name);
    this.story.startDialog(encounter.denied);
  }

  public endEncounter(name: string, won: boolean) {
    let encounter = this.encounterByName(name)
    if (encounter) {
      if (won && encounter.victory) {
        encounter.defeated = true;
        this.story.startDialog(encounter.victory);
        this.currentEncounter = null;
      } else if (!won && encounter.defeat) {
        this.story.startDialog(encounter.defeat);
        this.currentEncounter = null;
      }
    }
  }

  public encounterByName(name: string) {
    for (let encounter of this.encounters) {
      if (encounter.name == name) return encounter
    }
    return null;
  }

  public isEncounterAllowed(name: string) {
    return !this.encounterByName(name).deny;
  }
  public setEncounterAllowed(name: string) {
    this.encounterByName(name).deny = false;
  }
}