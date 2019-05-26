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
}
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
export type DialogOption = {
  m: string,
  e?: string,
  next?: string
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
    { a: DialogActorID.Player, m: '- Святая императрица, ну и вонь здесь. Контроллер, запросить статус эко-станции.'},
    { a: DialogActorID.Controller, m: '- Ресурс кислородного блока на минимуме. Фотонная подсистема функционирует в авайрийном режиме. Вентиляционные системы требуют ремонта. Насосно-фильтровальная подстанция перегружена.' },
    { a: DialogActorID.Player, m: '- Хоть что-то в этом секторе работает нормально?' },
    { a: DialogActorID.Controller, m: '- Прото-реактор функционирует штатно.', o: [
      { m:'Нет', next: 'afterArrival' },
      { m:'Да!', e: StoryEvent.BattleStart }
    ]},
    // { e: StoryEvent.BattleStart },
  ];


  private afterArrival: DialogLine[] = [
    { a: DialogActorID.Player, m: '- Ясно. А откуда ветер?'},
    { a: DialogActorID.Controller, m: '- Сбой датчиков даления в блоках 92J, 93J, 92P, 114B...' },
    { a: DialogActorID.Player, m: '- Стоп. Просто отправь полный отчет мне в память.' },
    { a: DialogActorID.Controller, m: '- Отчет отправлен.', o: [
      { m:'Нет', e: StoryEvent.EndDialog },
      { m:'Да!', e: StoryEvent.BattleStart }
    ]}
  ];

  private dialogs = {
    'arrival': this.arrival,
    'afterArrival': this.afterArrival
  }
  constructor(scene: Phaser.Scene) {
    this.events = new Phaser.Events.EventEmitter();
    this.enterKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.cursorKeys = scene.input.keyboard.createCursorKeys();
    this.enterKey.on('down', (key, event) => {
      let dialog = this.currentDialog;
      if (dialog) this.processOptions();
      if (this.currentDialog == dialog && dialog != null) this.nextLine();
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

  public startDialog(key: string) {
    let lines: DialogLine[] = this.dialogs[key];
    this.currentDialog = lines;
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