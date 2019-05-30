/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  Tecnho Nomads: gameplay prototype
*/

import { DialogLine, DialogActorID, StoryEvent } from "./Story";

export class Dialogs {
 
  //
  // Transport platform
  // 

  public static transportPlatformStart: DialogLine[] = [
    { a: DialogActorID.Unknown, m: 'Транспортная платформа должна доставить вас ко входу в сектор, но система управление платформой деактивирована. Можно попробовать отладить ее, подключившись к терминалу.'},
    { a: DialogActorID.TestTerminal, m: '', o: [
      { m:'Ничего не делать' },
      { m:'Подключиться к терминалу', e: StoryEvent.BattleStart }
    ]},
  ];

  public static transportPlatformDefeat: DialogLine[] = [
    { a: DialogActorID.Unknown, m: 'Попытка починить систему управления не удалась'},
  ];

  public static transportPlatformVictory: DialogLine[] = [
    { a: DialogActorID.Unknown, m: 'Вам удалось получить контроль над системой управления транспортной платформой'},
  ];

  public static transportPlatformRepeat: DialogLine[] = [
    { a: DialogActorID.Unknown, m: 'Система управления транспортной платформой активна, теперь можно отправиться в сектор назначения.'},
    { a: DialogActorID.TestTerminal, m: '', o: [
      { m:'Ничего не делать' },
      { m:'Пуск', e: StoryEvent.PlatformTravel }
    ]},
  ];

  

}