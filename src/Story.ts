/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  gaminator 19
*/
import { DialogView } from "./DialogView";

enum DialogActorID {
  Unknown,
  Player,
  Controller
}
type DialogActorData = {
  id: DialogActorID,
  texture: string,
  name: string
}
export type DialogLine = {
  a: DialogActorID
  m: string,
}

export class Story {
  private view: DialogView;
  private enterKey: Phaser.Input.Keyboard.Key;
  private currentDialog: DialogLine[];
  private currentDialogIdx: number;
  private actors: DialogActorData[] = [
    {
      id: DialogActorID.Controller,
      texture: 'portrait_controller_32x32',
      name: 'Контроллер'
    },
    {
      id: DialogActorID.Player,
      texture: 'portrait_player_32x32',
      name: 'Хиро'
    },
    {
      id: DialogActorID.Unknown,
      texture: null,
      name: ''
    }
  ]

  private arrival: DialogLine[] = [
    { a: DialogActorID.Player, m: '- Святая императрица, ну и вонь здесь. Контроллер, запросить статус эко-станции.' },
    { a: DialogActorID.Controller, m: '- Ресурс кислородного блока на минимуме. Фотонная подсистема функционирует в авайрийном режиме. Вентиляционные системы требуют ремонта. Насосно-фильтровальная подстанция перегружена.' },
    { a: DialogActorID.Player, m: '- Хоть что-то в этом секторе работает нормально?' },
    { a: DialogActorID.Controller, m: '- Прото-реактор функционирует штатно.' },
  ];

  private dialogs = {
    'arrival': this.arrival
  }
  constructor(scene: Phaser.Scene) {
    this.enterKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.enterKey.on('down', (key, event) => {
      if (this.currentDialog) {
        this.nextLine();
      }
    });
  }

  public setDialogView(view: DialogView) {
    this.view = view;
  }

  public startDialog(key: string) {
    let lines: DialogLine[] = this.dialogs[key];
    this.currentDialog = lines;
    this.currentDialogIdx = 0
    this.showLine(this.currentDialog[this.currentDialogIdx]);
  }

  private nextLine() {
    this.currentDialogIdx++;
    if (this.currentDialogIdx < this.currentDialog.length) {
      this.showLine(this.currentDialog[this.currentDialogIdx])
    } else {
      this.view.hide();
      this.currentDialog = null;
      this.currentDialogIdx = 0;
    }
  }

  private showLine(line: DialogLine) {
    let actor = this.actorDataByID(line.a);
    this.view.showText(actor.texture, actor.name, line.m)
  }

  private actorDataByID(id: DialogActorID): DialogActorData {
    for (let actor of this.actors) {
      if (actor.id == id) {
        return actor;
      }
    }
  }

}