/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  gaminator 19
*/

import { DialogLine, Story } from "./Story";
import { Dialogs } from "./Dialogs";

export enum EncounterName {
  UNKNOWN = '',
  TRANSPORT_PLATFORM = 'transport_platform'
}

export type Encounter = {
  type: EncounterName,
  damage: number
  start: DialogLine[],
  victory: DialogLine[],
  defeat: DialogLine[],
  repeat: DialogLine[],

  defeated?: boolean,
}

export class Encounters {

  private encounters: Encounter[] = [
    { 
      type: EncounterName.TRANSPORT_PLATFORM,
      damage: 0,
      start: Dialogs.transportPlatformStart,
      victory: Dialogs.transportPlatformVictory,
      defeat: Dialogs.transportPlatformDefeat,
      repeat: Dialogs.transportPlatformRepeat,
    }
  ]

  public currentEncounter: Encounter;
  constructor(private story: Story) {

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

  private encounterByName(name: string) {
    for (let encounter of this.encounters) {
      if (encounter.type == name) return encounter
    }
    return null;
  }
}