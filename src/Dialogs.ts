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
    { a: DialogActorID.Unknown, m: '', o: [
      { m:'Ничего не делать' },
      { m:'Подключиться к терминалу', e: StoryEvent.BattleStart }
    ]},
  ];

  public static transportPlatformDefeat: DialogLine[] = [
    { a: DialogActorID.Unknown, m: 'Попытка починить систему управления не удалась'},
  ];

  public static transportPlatformVictory: DialogLine[] = [
    { a: DialogActorID.Unknown, m: 'Контроль над системой управления транспортной платформой восстановлен. Теперь можно отправиться в сектор назначения.'},
    { a: DialogActorID.Unknown, m: '', o: [
      { m:'Ничего не делать' },
      { m:'Пуск', e: StoryEvent.PlatformTravel }
    ]},
  ];

  public static transportPlatformRepeat: DialogLine[] = [
    { a: DialogActorID.Unknown, m: 'Система управления транспортной платформой активна, теперь можно отправиться в сектор назначения.'},
    { a: DialogActorID.Unknown, m: '', o: [
      { m:'Ничего не делать' },
      { m:'Пуск', e: StoryEvent.PlatformTravel }
    ]},
  ];


  //
  // Pomp filter
  // 

  public static pompFilterStart: DialogLine[] = [
    { a: DialogActorID.Unknown, m: 'Старая нососно-фильтровальная подстанция. Поршни застыли в неподвижном состоянии. Она явно требует ремонта, но возможно у вас получится запустить систему хотя бы в аварийном режиме.'},
    { a:  DialogActorID.Unknown, m: '', o: [
      { m:'Ничего не делать' },
      { m:'Начать процедуру отладки', e: StoryEvent.BattleStart }
    ]},
  ];
  
  public static pompFilterDefeat: DialogLine[] = [
    { a: DialogActorID.Unknown, m: 'Попытка запуска системы фильтрации не удалась'},
  ];

  public static pompFilterVictory: DialogLine[] = [
    { a: DialogActorID.Unknown, m: 'Вам удалось запустить систему фильтрации в аварийном режиме. Пусть не скоро, но вода очистится и запах гнили уйдет'},
  ];

  public static pompFilterRepeat: DialogLine[] = [
    { a: DialogActorID.Unknown, m: 'Насосно-фильтровальная подстанция гудит и громыхает поршнями, проводя через себя кубометры загрязненной воды'},
  ];


  //
  // Exosuit
  // 

  public static exosuitStart: DialogLine[] = [
    { a: DialogActorID.Unknown, m: 'Тело брошеного экзоскелета по пояс ушло под воду. Большая часть корпуса покрыта коррозиями и остается лишь догадываться в каком состоянии находится нижняя половина агрегата. '},
    { a: DialogActorID.Unknown, m: 'Несмотря на внешние повреждения, некоторые индикаторы консоли все еще мигают. Значит ядро системы управления пока не отключилось. В блоке памяти экзоскелета может быть что-то интересное.'},
    { a: DialogActorID.Unknown, m: '', o: [
      { m:'Ничего не делать' },
      { m:'Подключиться к консоли', e: StoryEvent.BattleStart }
    ]},
  ];
  
  public static exosuitDefeat: DialogLine[] = [
    { a: DialogActorID.Unknown, m: 'В доступе к системе экзоскелета отказано'},
  ];

  public static exosuitVictory: DialogLine[] = [
    { a: DialogActorID.Unknown, m: 'Добравшись до ядра системы экзоскелета вы нашли лог последних задач. Среди них "Транспортировка образцов протогенеза" и "Аварийная эвакуация персонала". '},
  ];

  public static exosuitRepeat: DialogLine[] = [
    { a: DialogActorID.Unknown, m: 'Экзоскелет в крайне плохом состоянии.'},
  ];

  
  

}