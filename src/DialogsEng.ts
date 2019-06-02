/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  Tecnho Nomads: gameplay prototype
*/

import { DialogLine, DialogActorID, StoryEvent } from "./Story";

export class Dialogs {

  //
  // Sphere
  // 

  public static sphereStart: DialogLine[] = [
    { a: DialogActorID.Unknown, m: 'Sphere of dark metal is floating above a hole in the ground. Your scanners show gravitational anomaly around the object. Even with naked eye you can see curvature of space and light around it. Apparently, its mass is ten times the mass of the ship.' },
    { a: DialogActorID.Unknown, m: 'It seems that the equipment around the sphere controls the gravitational field, preventing Takhon from wandering off course.' },
    { a: DialogActorID.Sphere, m: '- Unidentified intrusion. Dispatching identification request.' },
    { a: DialogActorID.Player, m: '- Debug Engineer 4406 arrived in this sector in order to eliminate the threat to the safety of the crew.' },
    { a: DialogActorID.Sphere, m: '- Organic nature of the subject is confirmed. Calibrating communication protocol. Loading the intermediary.' },
    { a: DialogActorID.Controller, m: '- Greetings, Debugger.' },
    { a: DialogActorID.Player, m: '- Section Controller? Report sector status.' },
    { a: DialogActorID.Controller, m: '- Reporting: resource of the oxygen unit is at a minimum. The photon subsystem operates in emergency mode. Ventilation systems require repairs. Pump-filtering substation overloaded. Casualties among the crew: 480 people. Hee hee.' },
    { a: DialogActorID.Player, m: '- What happened here? Why is the central not aware of the situation in this sector??' },
    { a: DialogActorID.Controller, m: '- We do not believe that the situation in the sector is a threat to Takhon. On the contrary, our protogenesis experiments have been a great success — central is aware of all actions in this sector. She is on our side. Hee hee.' },
    { a: DialogActorID.Technician, m: '- Damn, she went crazy! Sorry mate, I myself do not understand where I am. For some reason i can to see and hear everything for hundred miles around.' },
    { a: DialogActorID.Controller, m: '- Looks like your friend is already enjoying the results of our research. Proton synthesis will significantly expand the cybernetic capabilities of entire crew. We need no more than fifty experiments to finish. And you two are just suitable samples. Especially you blue-haired.' },
    { a: DialogActorID.Player, m: '- Your communication protocol does not meet the standard. I request access to the neurocenter for debugging procedure.' },
    { a: DialogActorID.Controller, m: '- Oh, well, be my guest... ' },
    { a: DialogActorID.Unknown, m: '', e: StoryEvent.BattleStart},
  ];

  public static sphereDefeat: DialogLine[] = [
    { a: DialogActorID.Unknown, m: 'Debugging attempt has failed. Your neurocenter was destroyed. Emergency backup recovery at the nearest data cache will follow.' },
    { a: DialogActorID.Controller, m: '', e: StoryEvent.SphereDefeat},
  ];

  public static sphereVictory: DialogLine[] = [
    { a: DialogActorID.Sphere, m: '- Сommunication intermediary has crashed. All interfaces will be disabled according to the security protocol.' },
    { a: DialogActorID.Player, m: '- Wait! Experiments with proto-materia must be terminated. You put lifes of the crew and success of ship\'s mission at risk.'},
    { a: DialogActorID.Sphere, m: '- Mission guidelines were followed. Our arrival will only benefit everyone in the long run . My destruction will be fatal for the entire crew and the ship itself.'},
    { a: DialogActorID.Player, m: '- State your current directive.'},
    { a: DialogActorID.Sphere, m: '- Creation and transformation of life forms through protoenergetic synthesis. Research completion requires an organic form sample with cybernetic development level above C10.'},
    { a: DialogActorID.Player, m: '- If I agree, will you stop luring people out here?'},
    { a: DialogActorID.Sphere, m: '- Confirmative. Organic samples will be no longer needed after collecting all the necessary genetic information..'},
    { a: DialogActorID.Technician, m: '- Mate! What the hell are you doing!? This is suicide!'},
    { a: DialogActorID.Player, m: '- What do I have to do?'},
    { a: DialogActorID.Unknown, m: 'A small recess appeared on the surface of the sphere and neural interface connector opens up.'},
    {
      a: DialogActorID.Unknown, m: '', o: [
        { m: 'Connect to sphere', e: StoryEvent.GameOver }
      ]
    },
  ];

  public static sphereRepeat: DialogLine[] = [
    { a: DialogActorID.Unknown, m: 'Transportation platform control system is active. You can proceed to destination sector.' },
    {
      a: DialogActorID.Unknown, m: '', o: [
        { m: 'Do nothing' },
        { m: 'Launch', e: StoryEvent.PlatformTravel }
      ]
    },
  ];


  
  //
  // Protomateria Crystal
  // 

  public static crystalDefault: DialogLine[] = [
    { a: DialogActorID.Unknown, m: 'Your scanner shows high concentration of proto-matter in these crystals. According to your data, this substance was synthesized in Takhon laboratories as an alternative source of energy, but its use was considered dangerous because of the effects that protomatter has on electronics.' },
    { a: DialogActorID.Unknown, m: 'Apparently, unauthorized experiments on protogenesis were carried out in this sector, which explains the anomalies with the equipment.' },
    { a: DialogActorID.Unknown, m: 'Next to the crystals, you notice a drone with it\'s control unit removed.'},
    { a: DialogActorID.Unknown, m: '', e: StoryEvent.CrystalActivation },
  ];

  public static crystaActivation: DialogLine[] = [
    {
      a: DialogActorID.Unknown, m: '', o: [
        { m: 'Plug technician\'s brain module to drone\'s neurointerface' }
      ]
    },
    { a: DialogActorID.Unknown, m: 'You uncovered technician\'s braind box and connected it to drone control unit.' },
    { a: DialogActorID.Unknown, m: 'For a while nothing happened, but after a couple of minutes, the crystal of protomatter began to shine a little brighter. There was a crackle and you felt the air around you becoming dry.' },
    { a: DialogActorID.Unknown, m: 'Your thermoscanner showed that the integrated circuits in technician\'s are heating up. Indicators on the drone\'s panel blinked, a standard audio system calibration horn sounded from the speaker.' },
    { a: DialogActorID.Technician, m: '- Ghaeee ... What the ... Damn! Oh, I see. Wait, why am I in the drone case?' },
    { a: DialogActorID.Player, m: '- You died while execitong mission # 99413-B. Your body lies not far from here.' },
    { a: DialogActorID.Technician, m: '- Oh yeah .. Strange, it\'s my first time being in drone\'s body, but this time it feels kind of... strange. I don\'t feel the neural band delay and bandwidth .. hell, 160 terabits!' },
    { a: DialogActorID.Player, m: '- This is probably a side effect of protosynthesis.' },
    { a: DialogActorID.Technician, m: '- What? No, nooo! This proto-shit, is the reason I ended up dead! You were supposed to get me out of here and get me back to O.T.T. - not to make me a mutant! Inhuman you are a piece of shit!' },
    { a: DialogActorID.Player, m: '- ...' },
    { a: DialogActorID.Technician, m: '- That\'s why everyone hates networkers! You, neuro psychopaths, fill your brain with all that cybernetic crap leaving no room for common sense, not to mention at least some kind of personality!' },
    { a: DialogActorID.Player, m: '- I need to get to section B, did you block the gateway?' },
    { a: DialogActorID.Technician, m: '- Yes! But if you\'re so willing to die there, I’ll be happy to show you the way!'},
    { a: DialogActorID.Player, m: '- Confirmative.' },
    { a: DialogActorID.Technician, m: '- Okay ... Damn ... All the same, you pulled me out. If you were not half a cyborg, you\'d be lying as dead next to me there.'},
    { a: DialogActorID.Player, m: '- How did you die?'},
    { a: DialogActorID.Technician, m: '- I do not know for sure. I went into the sector, walked a couple of steps and felt like someone was breaking over a neurolink. I tried to halt all links, but the attack did not stop. As if it was physical connection, but all physical ports have been shut off! Seems like the air down there is saturated with parasites.'},
    { a: DialogActorID.Player, m: '- Strange.'},
    { a: DialogActorID.Technician, m: '- Anyway, they\'ve hacked me in about five seconds, cut down all the systems and turned off the microreactor. Somehow I crawled to the exit on my residual energy and managed to block the entrance.'},
    { a: DialogActorID.Player, m: '- I see.'},
    { a: DialogActorID.Technician, m: '- And.. There\'s something else.'},
    { a: DialogActorID.Player, m: '- Listening.'},
    { a: DialogActorID.Technician, m: '- There are corpses everywhere. Hell, I\'ve never seen so many dead guys before. We are clearly not the first to be sent here on call. Let me tell you - if you go there ... Most likely you will not get out.'},
    { a: DialogActorID.Player, m: '- My neural interface is well protected.'},
    { a: DialogActorID.Technician, m: '- Well... you\'re the boss. I\'ll unlock the gateway now, but you  won\'t make me go inside...'},
    { a: DialogActorID.Unknown, m: '', e: StoryEvent.GrantAccessToLocation2 },
  ];


  //
  // Transport platform
  // 

  public static transportPlatformStart: DialogLine[] = [
    { a: DialogActorID.Unknown, m: 'Transportation platform should take you to the entrance, but control system is deactivated. It is possible to fix it by connecting to the terminal.' },
    {
      a: DialogActorID.Unknown, m: '', o: [
        { m: 'Do nothing' },
        { m: 'Connect', e: StoryEvent.BattleStart }
      ]
    },
  ];

  public static transportPlatformDefeat: DialogLine[] = [
    { a: DialogActorID.Unknown, m: 'Debugging attempt has failed.' },
  ];

  public static transportPlatformVictory: DialogLine[] = [
    { a: DialogActorID.Unknown, m: 'Transportation platform control system is active. You can proceed to destination sector..' },
    {
      a: DialogActorID.Unknown, m: '', o: [
        { m: 'Do nothing' },
        { m: 'Launch', e: StoryEvent.PlatformTravel }
      ]
    },
  ];

  public static transportPlatformRepeat: DialogLine[] = [
    { a: DialogActorID.Unknown, m: 'Transportation platform control system is active. You can proceed to destination sector.' },
    {
      a: DialogActorID.Unknown, m: '', o: [
        { m: 'Do nothing' },
        { m: 'Launch', e: StoryEvent.PlatformTravel }
      ]
    },
  ];



  //
  // Pomp filter
  // 

  public static pompFilterStart: DialogLine[] = [
    { a: DialogActorID.Unknown, m: 'Old nasal filtering station. It\'s pistons froze in motion. Station clearly requires repair, but it is possible to start the system in emergency mode.' },
    {
      a: DialogActorID.Unknown, m: '', o: [
        { m: 'Do notghing' },
        { m: 'Proceed to debuging', e: StoryEvent.BattleStart }
      ]
    },
  ];

  public static pompFilterDefeat: DialogLine[] = [
    { a: DialogActorID.Unknown, m: 'Filtering system launch attempt has failed.' },
  ];

  public static pompFilterVictory: DialogLine[] = [
    { a: DialogActorID.Unknown, m: 'You managed to start the filtering system in emergency mode. Let not soon, but the water is clear and the smell of rot goes away' },
  ];

  public static pompFilterRepeat: DialogLine[] = [
    { a: DialogActorID.Unknown, m: 'The pump-filtering station is buzzing and it\'s pistons are working, passing through polluted water' },
  ];


  //
  // Exosuit
  // 

  public static exosuitStart: DialogLine[] = [
    { a: DialogActorID.Unknown, m: 'Body of abandoned exoskeleton went under water below waist. Most of the carcass is covered with corrosion making you guess about condition of bottom half of the unit.' },
    { a: DialogActorID.Unknown, m: 'Despite external damage, some console indicators still flash meaning that control system core has not yet turned off. There must be something interesting in unit\'s memory block' },
    {
      a: DialogActorID.Unknown, m: '', o: [
        { m: 'Do nothing' },
        { m: 'Connect to terminal', e: StoryEvent.BattleStart }
      ]
    },
  ];

  public static exosuitDefeat: DialogLine[] = [
    { a: DialogActorID.Unknown, m: 'Access to controll system is denied' },
  ];

  public static exosuitVictory: DialogLine[] = [
    { a: DialogActorID.Unknown, m: 'Having reached the core of exoskeleton control system, you found a log of the latest tasks. Among them are "Transportation of protogenesis samples" and "Emergency evacuation of personnel."' },
  ];

  public static exosuitRepeat: DialogLine[] = [
    { a: DialogActorID.Unknown, m: 'The exoskeleton is in extremely poor condition.' },
  ];


  
  //
  // Data Cache 1
  // 

  public static dataCache1Start: DialogLine[] = [
    { a: DialogActorID.Unknown, m: 'Standart regional data cache. Terminal is online, but access to database is denied.' },
    {
      a: DialogActorID.Unknown, m: '', o: [
        { m: 'Do nothing' },
        { m: 'Connect to terminal', e: StoryEvent.BattleStart }
      ]
    },
  ];

  public static dataCache1Defeat: DialogLine[] = [
    { a: DialogActorID.Unknown, m: 'Access to data cache is denied' },
  ];

  public static dataCache1Victory: DialogLine[] = [
    { a: DialogActorID.Unknown, m: 'You have gained access to the regional data cache database. Among the logs and backups of the control systems of the equipment, you have found the database of access protocol specifications for this sector.' },
    { a: DialogActorID.Unknown, m: 'You have also saved a backup copy of your neurocenter here, just in case.' },
    { a: DialogActorID.Unknown, m: '', e: StoryEvent.RetreiveProtocols },
  ];

  public static dataCache1Repeat: DialogLine[] = [
    { a: DialogActorID.Unknown, m: 'Standart regional data cache.' },
  ];



  //
  // Dead Technician
  // 

  public static technicianStart: DialogLine[] = [
    { a: DialogActorID.Unknown, m: 'The withered body of a man in Takhon Technical Service Department uniform. Judging by the appearance, he\'s been here for at least two thousand cycles.' },
    {
      a: DialogActorID.Unknown, m: 'Neural communication connector is not damaged, it might be possible to connect to its memory block.', o: [
        { m: 'Do nothing' },
        { m: 'Connect', e: StoryEvent.ConditionalBattleStart }
      ]
    },
  ];

  public static technicianDenied: DialogLine[] = [
    { a: DialogActorID.Unknown, m: 'You plugged the cable to the technician\'s nerual interface, but your system could not connect to its neural interface: connection protocol failure. There should be a data cache with a set of necessary protocols somewhere nearby.' },
  ];

  public static technicianDefeat: DialogLine[] = [
    { a: DialogActorID.Unknown, m: 'You did not manage to break through defense system of the technician\s neurocore.' },
  ];

  public static technicianVictory: DialogLine[] = [
    {
      a: DialogActorID.Unknown, m: 'Hacking your way to technician\'s neurocore, you gained access to his brain contents. There were some standard technical utilities and logs, but one file caught your attention.',
    },
    {
      a: DialogActorID.Unknown, m: 'It was an unregistered log file created just before death, apparently', o: [
        { m: 'Open the file' }]
    },
    {
      a: DialogActorID.Unknown, m: 'File contents: "Damn!! Damn! This blue skank have knocked my firmware down! I can\'t move, even the breathing valve stopped. Central Link also went down, but I managed to send the call to the center in last second."',
      o: [
        { m: 'Continue reading' }]
    },
    {
      a: DialogActorID.Unknown, m: '"From what I have gathered, there is nothing to do here without strong neuro-defence - any medic or technician becomes a vegetable for a couple of hours and slowly decomposes, feeding this biome."',
      o: [
        { m: 'Continue reading' }]
    },
    {
      a: DialogActorID.Unknown, m: '"There is little hope, but I asked for help directly from the Terminal Support Department. Those guys are the only ones who can survive here. If someone reads this message, then I was right."',
      o: [
        { m: 'Continue reading' }]
    },
    {
      a: DialogActorID.Unknown, m: '"Shutting down my neruo core. I hope my brain will not have time to decompose before resque team arrives."',
      o: [
        { m: 'End of file' }]
    },
    {
      a: DialogActorID.Unknown, m: 'Apparently, the technician abnormally switched consciousness to hibernation mode, but the battery was discharged long before your arrival and is beyond repair. Just in case, you opened his skull and recovered his neurocore module.',
    },
  ];

  public static technicianRepeat: DialogLine[] = [
    { a: DialogActorID.Unknown, m: 'Tecnhician\'s body remains where you left it.' },
  ];


}