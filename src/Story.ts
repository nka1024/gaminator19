/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  gaminator 19
*/
import { DialogView } from "./DialogView";

export enum StoryEvent {
  BattleStart = 'battle_start',
  YesSelected = 'yes_selected',
  NoSelected = 'no_selected',
  EndDialog = 'end_dialog',
  PlatformTravel = 'platform_travel',
  ConditionalBattleStart = 'conditional_battle_start',
  CrystalActivation = 'crystal_activation',
  RetreiveProtocols = 'retreive_protocols',
  GrantAccessToLocation2 = 'grant_access_to_location_2',
  SphereDefeat = 'sphere_defeat',
  GameOver = 'game_over'
}
export enum DialogActorID {
  Unknown,
  Player,
  Controller,
  TestTerminal,
  Technician,
  Sphere
}
type DialogActorData = {
  id: DialogActorID,
  texture: string,
  name: string
}
export type DialogOption = {
  m: string,
  e?: string,
  next?: DialogLine[]
}
export type DialogLine = {
  a?: DialogActorID
  m?: string,
  e?: string,
  o?: DialogOption[]
}

export class Story {
  private view: DialogView;
  private enterKey: Phaser.Input.Keyboard.Key;
  private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  private currentDialog: DialogLine[];
  private currentDialogIdx: number;
  public events: Phaser.Events.EventEmitter;

  private actors: DialogActorData[] = [
    {
      id: DialogActorID.Controller,
      texture: null,
      name: 'Controller'
    },
    {
      id: DialogActorID.Player,
      texture: 'portrait_player_32x32',
      name: 'Debugger 4406'
    },
    {
      id: DialogActorID.TestTerminal,
      texture: null,
      name: 'Terminal'
    },
    {
      id: DialogActorID.Technician,
      texture: null,
      name: 'Technician'
    },
    {
      id: DialogActorID.Sphere,
      texture: null,
      name: 'Sphere'
    },
    {
      id: DialogActorID.Unknown,
      texture: null,
      name: ''
    }
  ]

  constructor(scene: Phaser.Scene ) {
    this.events = new Phaser.Events.EventEmitter();
    this.enterKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.cursorKeys = scene.input.keyboard.createCursorKeys();
    this.enterKey.on('down', (key, event) => {
      let dialog = this.currentDialog;
      if (dialog) this.processOptions();
      if (this.currentDialog == dialog && dialog != null) {
        this.nextLine();
        event.stopPropagation();
      }
    });
    this.cursorKeys.up.on('down', (key, event) => {
      if (this.currentDialog) {
        this.view.moveCursor(-1)
      }
    });
    this.cursorKeys.down.on('down', (key, event) => {
      if (this.currentDialog) {
        this.view.moveCursor(1)
      }
    });
  }

  private processOptions() {
    let line = this.currentDialog[this.currentDialogIdx]

    if (line.o) {
      let selected: DialogOption = line.o[this.view.getCursorPos()];
      if (selected.e) this.events.emit(selected.e);
      if (selected.next) {
        this.endDialog();
        this.startDialog(selected.next);
      }
      console.log(selected);
    }
  }
  public setDialogView(view: DialogView) {
    this.view = view;
  }

  public startDialog(dialog: DialogLine[]) {
    this.currentDialog = dialog;
    this.currentDialogIdx = 0
    this.showLine(this.currentDialog[this.currentDialogIdx]);
  }

  public endDialog() {
    this.currentDialog = null;
    this.view.hide();
  }

  public eventFinished() {
    if (this.currentDialog)
      this.nextLine();
  }

  private nextLine() {
    this.view.hide();

    this.currentDialogIdx++;
    if (this.currentDialogIdx < this.currentDialog.length) {
      let line = this.currentDialog[this.currentDialogIdx]
      this.showLine(line);
    } else {
      this.view.hide();
      this.currentDialog = null;
      this.currentDialogIdx = 0;
    }
  }

  private showLine(line: DialogLine) {
    if (line.e) {
      this.events.emit(line.e);
    } else {
      let actor = this.actorDataByID(line.a);
      this.view.showText(actor.texture, actor.name, line.m)
      let options = line.o;
      if (options) {
        for (let option of options) {
          this.view.addOption(option.m);
        }
      }
    }
  }

  private actorDataByID(id: DialogActorID): DialogActorData {
    for (let actor of this.actors) {
      if (actor.id == id) {
        return actor;
      }
    }
  }

}