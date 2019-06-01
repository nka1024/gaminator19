/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  Tecnho Nomads: gameplay prototype
*/

import { DialogLine, DialogActorID, StoryEvent } from "./Story";

export class Dialogs {

  public static crystalDefault: DialogLine[] = [
    { a: DialogActorID.Unknown, m: 'Ваш сканер показывает высокое содержание протоматерии в этих кристаллах. Согласно вашим данным, это вещество было синтезировано в лабораториях Такхона как альтернативный источник энергии, но его использование было признано опасным из-за эффектов, которое протоматерия оказывает на электронику.' },
    { a: DialogActorID.Unknown, m: 'Видимо, в этом секторе проводились несанкционированные эксперементы по протогенезу, что объясняет аномалии с оборудованием.' },
    { a: DialogActorID.Unknown, m: 'Рядом с кристаллами вы замечаете дрона со снятым блоком управления.'},
    { a: DialogActorID.Unknown, m: '', e: StoryEvent.CrystalActivation },
    
  ];

  public static crystaActivation: DialogLine[] = [
    {
      a: DialogActorID.Unknown, m: '', o: [
        { m: 'Подключить мозг техника к нейроинтерфейсу дрона' }
      ]
    },
    { a: DialogActorID.Technician, m: 'ЙОБА' },
  ];

  public static crystalInteraction: DialogLine[] = [
    { a: DialogActorID.Unknown, m: '' }
  ];

  //
  // Transport platform
  // 

  public static transportPlatformStart: DialogLine[] = [
    { a: DialogActorID.Unknown, m: 'Транспортная платформа должна доставить вас ко входу в сектор, но система управление платформой деактивирована. Можно попробовать отладить ее, подключившись к терминалу.' },
    {
      a: DialogActorID.Unknown, m: '', o: [
        { m: 'Ничего не делать' },
        { m: 'Подключиться к терминалу', e: StoryEvent.BattleStart }
      ]
    },
  ];

  public static transportPlatformDefeat: DialogLine[] = [
    { a: DialogActorID.Unknown, m: 'Попытка починить систему управления не удалась' },
  ];

  public static transportPlatformVictory: DialogLine[] = [
    { a: DialogActorID.Unknown, m: 'Контроль над системой управления транспортной платформой восстановлен. Теперь можно отправиться в сектор назначения.' },
    {
      a: DialogActorID.Unknown, m: '', o: [
        { m: 'Ничего не делать' },
        { m: 'Пуск', e: StoryEvent.PlatformTravel }
      ]
    },
  ];

  public static transportPlatformRepeat: DialogLine[] = [
    { a: DialogActorID.Unknown, m: 'Система управления транспортной платформой активна, теперь можно отправиться в сектор назначения.' },
    {
      a: DialogActorID.Unknown, m: '', o: [
        { m: 'Ничего не делать' },
        { m: 'Пуск', e: StoryEvent.PlatformTravel }
      ]
    },
  ];


  //
  // Pomp filter
  // 

  public static pompFilterStart: DialogLine[] = [
    { a: DialogActorID.Unknown, m: 'Старая нососно-фильтровальная подстанция. Поршни застыли в неподвижном состоянии. Она явно требует ремонта, но возможно у вас получится запустить систему хотя бы в аварийном режиме.' },
    {
      a: DialogActorID.Unknown, m: '', o: [
        { m: 'Ничего не делать' },
        { m: 'Начать процедуру отладки', e: StoryEvent.BattleStart }
      ]
    },
  ];

  public static pompFilterDefeat: DialogLine[] = [
    { a: DialogActorID.Unknown, m: 'Попытка запуска системы фильтрации не удалась' },
  ];

  public static pompFilterVictory: DialogLine[] = [
    { a: DialogActorID.Unknown, m: 'Вам удалось запустить систему фильтрации в аварийном режиме. Пусть не скоро, но вода очистится и запах гнили уйдет' },
  ];

  public static pompFilterRepeat: DialogLine[] = [
    { a: DialogActorID.Unknown, m: 'Насосно-фильтровальная подстанция гудит и громыхает поршнями, проводя через себя кубометры загрязненной воды' },
  ];


  //
  // Exosuit
  // 

  public static exosuitStart: DialogLine[] = [
    { a: DialogActorID.Unknown, m: 'Тело брошеного экзоскелета по пояс ушло под воду. Большая часть корпуса покрыта коррозиями и остается лишь догадываться в каком состоянии находится нижняя половина агрегата. ' },
    { a: DialogActorID.Unknown, m: 'Несмотря на внешние повреждения, некоторые индикаторы консоли все еще мигают. Значит ядро системы управления пока не отключилось. В блоке памяти экзоскелета может быть что-то интересное.' },
    {
      a: DialogActorID.Unknown, m: '', o: [
        { m: 'Ничего не делать' },
        { m: 'Подключиться к консоли', e: StoryEvent.BattleStart }
      ]
    },
  ];

  public static exosuitDefeat: DialogLine[] = [
    { a: DialogActorID.Unknown, m: 'В доступе к системе экзоскелета отказано' },
  ];

  public static exosuitVictory: DialogLine[] = [
    { a: DialogActorID.Unknown, m: 'Добравшись до ядра системы экзоскелета вы нашли лог последних задач. Среди них "Транспортировка образцов протогенеза" и "Аварийная эвакуация персонала". ' },
  ];

  public static exosuitRepeat: DialogLine[] = [
    { a: DialogActorID.Unknown, m: 'Экзоскелет в крайне плохом состоянии.' },
  ];



  //
  // Dead Technician
  // 

  public static technicianStart: DialogLine[] = [
    { a: DialogActorID.Unknown, m: 'Иссохшее тело человека в униформе Отдела Технического Обслуживания Такхон. Судя по внешнему виду, он пролежал здесь не меньше двух тысяч циклов. ' },
    {
      a: DialogActorID.Unknown, m: 'Разъем для нейросвязи не поврежден, возможно удастся подключиться к его блоку памяти.', o: [
        { m: 'Ничего не делать' },
        { m: 'Подключиться', e: StoryEvent.ConditionalBattleStart }
      ]
    },
  ];

  public static technicianDenied: DialogLine[] = [
    { a: DialogActorID.Unknown, m: 'Вы подсоединили кабель к телу техника, но ваша система не смогла установить связь с его нейроинтерфейсом: не удалось найти протокол соединения. Где-то поблизости должен быть коммутационный блок с набором нужных протоколов.' },
  ];

  public static technicianDefeat: DialogLine[] = [
    { a: DialogActorID.Unknown, m: 'Вам не удалось пробиться через защитную систему нейроядра техника.' },
  ];

  public static technicianVictory: DialogLine[] = [
    {
      a: DialogActorID.Unknown, m: 'Взломав нейрозщиту техника вы получили доступ к данным его мозга. В основном там оказались стандартные технические утилиты и журнальные логи, но один файл привлек ваше внимание.',
    },
    {
      a: DialogActorID.Unknown, m: 'Это незарегистрированный журнальный файл, судя по всему он был создан непосредственно перед смертью.', o: [
        { m: 'Открыть файл' }]
    },
    {
      a: DialogActorID.Unknown, m: 'Содержание файла: "Черт!! Черт! Эти синие твари снесли мне прошивку! Не могу пошевелиться, даже дыхалка остановилась. Линк тоже отрубился, но я успел скинуть вызов в центр."',
      o: [
        { m: 'Продолжить тение' }]
    },
    {
      a: DialogActorID.Unknown, m: '"Из того, что я успел изучить, без мощной нейрозащиты сдесь делать нечего - любой медик или техник за пару часов становится овощем и медленно разлагается, питая этих тварей"',
      o: [
        { m: 'Продолжить тение' }]
    },
    {
      a: DialogActorID.Unknown, m: '"Надежды мало, но я запросил помощь напрямую из отдела терминальщиков. Если кто-то и может тут выжить, то это они. Если кто-нибудь это прочтёт, значит я оказался прав."',
      o: [
        { m: 'Продолжить тение' }]
    },
    {
      a: DialogActorID.Unknown, m: '"Блокирую нейроактивность, надеюсь мой мозг не успеет разложится до прибытия помощи."',
      o: [
        { m: 'Конец файла' }]
    },
    {
      a: DialogActorID.Unknown, m: 'Судя по всему, техник аварийно переключил сознание в режим гибернации, но батарея разрядилась задолго до вашего прибытия и теперь ему уже врядли можно помочь. На всякий случай вы вскрыли его черепную коробку и достали блок нейроядра.',
    },
  ];

  public static technicianRepeat: DialogLine[] = [
    { a: DialogActorID.Unknown, m: 'Тело техника лежит в том же положении, в котором вы его оставили' },
  ];


}