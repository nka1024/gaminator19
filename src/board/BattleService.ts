/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  gaminator 19
*/

import { PlayerBoardData, BoardData, CardData, CardType, CardSkillType, BoardPhase } from "../types/Types";
import { EncounterName } from "../Encounters";
import { CONST } from "../const/const";

export enum CardName {
  ATTACK_PROTOCOL = 'Протокол атаки',
  DEBUG_HOOK = 'Отладочный хук',
  HIDDEN_METHOD = 'Скрытый метод',
  DYNAMIC_CONTRACT = 'Динамический контракт',
  AUTODEBUG = 'Авто-отладчик',
  STANDART_TEST = 'Стандартный тест',
  DEFENSE_BLOCK = 'Защитный блок',
  TRANSPORT_SYSTEM = 'Транспортная система',
  ENGINE_CONTROL = 'Управление двигателем',
  PUMP_CONTROLLER = 'Контроллер поршней',
  MAYHEM = 'Мэйхэм 0x1',
  LARKIN44B = 'Ларкин 44b',
  HINNA = 'H.I.N.N.A.',
  TENKI_CHAGU = 'Tenki-Chagu',
  MULTIPLE_DISPATCH = 'Multiple Dispatch',
  INTROSPECT = 'Интроспект',
  OVERLOAD = 'OVERLOAD',
  LITARAL = 'Литерал',
  CHAOS = 'ХАОС 2',
  MIXIN = 'MIX-IN',
  SHIELD_CONTROLLER = 'Контроллер щитов',
  DATABASE_SHIELD = 'Щит базы данных',
  BATTLE_CHIPSET = 'Боевой чипсет',
  HIGH_ORDER = 'Метод верхнего порядка',
  CRASH_OVERRIDE = 'CRASH OVERRIDE',
  INSTRUCTIONxA90013 = 'Инструкция xA90013',
  SLICE = 'Slice',
  NULLPTR = 'Нулевой указатель',
  ADD_ATK_MODULE = 'Усиление',
  ADD_HP_MODULE = 'Стабильность модуля',
  ADD_HP_CORE = 'Стабильность ядра',
  HYBERNATION = 'Гибернация',
  HYBRID = 'Гибрид',
  SUBTLETY = 'Сабтлети',
  INJECTION = 'Инжектор',
  DAMAGE_CORE = 'Урон ядру',
  DAMAGE_MODULE = 'Урон модулю',
  ENRAGE = 'Энрейдж',
}
export class BattleService {

  public static playerDeck: CardData[] = [];

  private copy(c: CardData): CardData {
    return {
      type: c.type,
      name: c.name,
      effect: c.effect,
      skill: c.skill,
      attack: c.attack,
      hp: c.hp,
      link: c.link,
      benefit: c.benefit,
      turned: c.turned,
      instant: c.instant,
    }
  }

  private shuffle(array: CardData[]): CardData[] {
    if (!CONST.SHUFFLE) {
      return array;
    }
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
      [array[i], array[j]] = [array[j], array[i]]; // swap elements
    }
    return array;
  }

  private copyAll(a: CardData[]): CardData[] {
    let result = [];
    for (let c of a) {
      result.push(this.copy(c));
    }
    return result;
  }

  public makeBoardData(encounter: EncounterName): BoardData {
    let result: BoardData = {
      opponent: this.makeOpponentForEncounter(encounter),
      player: this.makePlayerData(),
      phase: BoardPhase.UNDEFINED,
      turn: 0,
    }
    return result;
  }

  public makePlayerData(): PlayerBoardData {
    if (BattleService.playerDeck.length == 0) {
      BattleService.playerDeck = this.makeInitialPlayerDeck();
    }
    let result: PlayerBoardData = {
      name: 'Отладчик 4406',
      deck: this.shuffle(this.copyAll(BattleService.playerDeck)),
      hand: [],
      board: [],
      loot: [],
      link: 0,
      linkMax: 0,
      hp: 15
    }
    return result;
  }
  
  private makeLootCardsForEncounter(encounter: EncounterName): CardData[] {
    let deck = this.makeOpponentForEncounter(encounter).deck;
    deck = this.shuffle(deck);;
    let result = []
    for (let i = 0; i < 7; i++) {
      if (deck.length > i) {
        result.push(deck[i]);
      }
    }
    return result;
  }

  public makeOpponentForEncounter(encounter: EncounterName): PlayerBoardData {
    let result: PlayerBoardData = {
      name: '',
      deck: [],
      hand: [],
      board: [],
      loot: [],
      link: 0,
      linkMax: 0,
      hp: 15
    }

    switch(encounter) {
      case EncounterName.TRANSPORT_PLATFORM: 
      result.deck = this.makeTransportPlatformDeck(); 
      result.loot = this.makeTransportPlatformLoot();
      result.name = 'Транспортная система'; 
      result.hp = 15;
      break;
      case EncounterName.EXOSUIT: 
      result.deck = this.makeExosuitDeck(); 
      result.loot = this.makeExosuitLoot();
      result.name = 'Система управления экзоскелетом'; 
      result.hp = 15;
      break;
      case EncounterName.POMP_FILTER: 
      result.deck = this.makePompFilterDeck(); 
      result.loot = this.makePompFilterLoot();
      result.name = 'Насосно-фильтровальная подстанция'; 
      result.hp = 15;
      break;
      case EncounterName.DATA_CACHE_1: 
      result.deck = this.makeDataCache1Deck(); 
      result.loot = this.makeDataCache1Loot();
      result.name = 'Региональный дата-кэш'; 
      result.hp = 20;
      break;
      case EncounterName.DEAD_TECHNICIAN: 
      result.deck = this.makeTechnicianDeck(); 
      result.loot = this.makeTechnicianLoot();
      result.name = 'Нейроинтерфейс'; 
      result.hp = 25;
      break;
      default: throw 'unknown encounter type';
    }

    return result;
  }


  private makeInitialPlayerDeck(): CardData[] {
    return [

      this.makeCreatureCard(2, 1, 1, CardName.DYNAMIC_CONTRACT, CardSkillType.NONE),
      this.makeCreatureCard(1, 2, 3, CardName.AUTODEBUG, CardSkillType.BUFF_ALLIES_1_1),
      this.makeCreatureCard(2, 1, 2, CardName.DEBUG_HOOK, CardSkillType.BUFF_ALLIES_1_1),
      this.makeCreatureCard(2, 1, 3, CardName.ATTACK_PROTOCOL, CardSkillType.ZERO_TURN),
      this.makeCreatureCard(3, 4, 3, CardName.STANDART_TEST, CardSkillType.NONE),
      this.makeCreatureCard(2, 1, 1, CardName.DYNAMIC_CONTRACT, CardSkillType.NONE),
      this.makeSkillCard(3, 3, CardName.DAMAGE_CORE,  CardSkillType.DAMAGE_CORE),
      this.makeSkillCard(3, 2, CardName.HYBERNATION,  CardSkillType.HYBERNATION),
      this.makeSkillCard(0, 0, CardName.ENRAGE,  CardSkillType.ENRAGE),
      this.makeCardAddHPCore(3),

      // this.makeCreatureCard(1, 2, 1, CardName.TRANSPORT_SYSTEM,   CardSkillType.BUFF_ALLIES_1_1),
      // this.makeCreatureCard(1, 2, 3, CardName.ENGINE_CONTROL,     CardSkillType.BUFF_ALLIES_1_1),
      // this.makeCreatureCard(4, 2, 3, CardName.INSTRUCTIONxA90013, CardSkillType.NONE),
      // this.makeCreatureCard(5, 1, 3, CardName.NULLPTR,            CardSkillType.NONE),
      // this.makeCardAddHPCreature(3),
      // this.makeCardAddHPCreature(3),
      // this.makeCardAddHPCore(4),
      // this.makeCardAddHPCore(5),
      // this.makeCardAddHPCore(5),
      // this.makeDamageCreatureSpell(2),
      
      // this.makeCreatureCard(4, 2, 3, CardName.CHAOS,              CardSkillType.ZERO_TURN),
      // this.makeCreatureCard(2, 4, 5, CardName.SLICE,              CardSkillType.SUBTLETY),
      // this.makeCreatureCard(2, 2, 4, CardName.HYBRID,             CardSkillType.HYBRID),
      // this.makeCreatureCard(5, 2, 3, CardName.OVERLOAD,             CardSkillType.HYBRID),
      
        // this.makeCreatureCard(0),
        // this.makeSleeperHoldCard(),
        // this.makeBombCard(),
        // this.makeEnrageSpell(),
        // this.makeBuffAtkWhileALiveCard(),
        // this.makeZeroTurnCard(1),
        // this.makeCardAddHPCore(1),
        // this.makeCardAddHPCreature(2),
        // this.makeCardAddAtk(3),
        // this.makeHybernationCard(),
        // this.makeHybridCard(),
        // this.makeSubtletyCard(),
        // this.makeInjectionCard(),
        // this.makeDamageCoreSpell(1),
        // this.makeDamageCreatureSpell(2),
      ]
  }



  //
  //  Transport platform cards
  //

  private makeTransportPlatformDeck(): CardData[] {
    return [
      this.makeCreatureCard(1, 1, 1, CardName.TRANSPORT_SYSTEM,   CardSkillType.NONE),
      this.makeCreatureCard(1, 2, 3, CardName.ENGINE_CONTROL,     CardSkillType.NONE),
      this.makeCreatureCard(1, 1, 2, CardName.INSTRUCTIONxA90013, CardSkillType.NONE),
      this.makeCreatureCard(2, 3, 4, CardName.NULLPTR,            CardSkillType.NONE),
      this.makeCreatureCard(2, 3, 4, CardName.NULLPTR,            CardSkillType.NONE),

      this.makeCreatureCard(1, 1, 1, CardName.TRANSPORT_SYSTEM,   CardSkillType.NONE),
      this.makeCreatureCard(1, 2, 3, CardName.ENGINE_CONTROL,     CardSkillType.NONE),
      this.makeCreatureCard(1, 1, 2, CardName.INSTRUCTIONxA90013, CardSkillType.NONE),
    ]
  }

  private makeTransportPlatformLoot(): CardData[] {
    return [
      this.makeCreatureCard(1, 2, 1, CardName.TRANSPORT_SYSTEM,   CardSkillType.BUFF_ALLIES_1_1),
      this.makeCreatureCard(1, 2, 3, CardName.ENGINE_CONTROL,     CardSkillType.BUFF_ALLIES_1_1),
      this.makeCreatureCard(4, 2, 3, CardName.INSTRUCTIONxA90013, CardSkillType.NONE),
      this.makeCreatureCard(5, 1, 3, CardName.NULLPTR,            CardSkillType.NONE),
      this.makeCardAddHPCreature(3),
      
      this.makeCardAddHPCreature(3),
      this.makeCardAddHPCore(4),
      this.makeCardAddHPCore(5),
      this.makeCardAddHPCore(5),
      this.makeDamageCreatureSpell(2),
    ]
  }



  //
  //  Exosuit platform cards
  //

  private makeExosuitDeck(): CardData[] {
    return [
      this.makeCreatureCard(3, 2, 4, CardName.BATTLE_CHIPSET,     CardSkillType.NONE),
      this.makeCreatureCard(1, 1, 1, CardName.ENGINE_CONTROL,     CardSkillType.ZERO_TURN),
      this.makeCreatureCard(1, 1, 1, CardName.ENGINE_CONTROL,     CardSkillType.NONE),
      this.makeCreatureCard(1, 1, 2, CardName.MAYHEM,             CardSkillType.BUFF_ALLIES_1_1),
      this.makeCreatureCard(2, 3, 4, CardName.SLICE,              CardSkillType.NONE),

      this.makeCreatureCard(3, 2, 4, CardName.BATTLE_CHIPSET,     CardSkillType.NONE),
      this.makeCreatureCard(1, 1, 1, CardName.ENGINE_CONTROL,     CardSkillType.ZERO_TURN),
      this.makeCreatureCard(1, 1, 1, CardName.ENGINE_CONTROL,     CardSkillType.NONE),
      this.makeCreatureCard(1, 1, 2, CardName.MAYHEM,             CardSkillType.NONE),
    ]
  }

  private makeExosuitLoot(): CardData[] {
    return [
      this.makeCreatureCard(4, 2, 3, CardName.CHAOS,              CardSkillType.ZERO_TURN),
      this.makeCreatureCard(2, 4, 5, CardName.SLICE,              CardSkillType.SUBTLETY),
      this.makeCreatureCard(2, 2, 4, CardName.HYBRID,             CardSkillType.HYBRID),
      this.makeCreatureCard(5, 2, 4, CardName.OVERLOAD,           CardSkillType.NONE),
      
      this.makeCardAddHPCreature(2),
      this.makeCardAddHPCreature(3),
      this.makeCardAddHPCore(4),
      this.makeDamageCreatureSpell(4),
    ]
  }



  //
  //  Pump cards
  //

  private makePompFilterDeck(): CardData[] {
    return [
      this.makeCreatureCard(3, 2, 2, CardName.BATTLE_CHIPSET,     CardSkillType.NONE),
      this.makeCreatureCard(1, 1, 1, CardName.ENGINE_CONTROL,     CardSkillType.ZERO_TURN),
      this.makeCreatureCard(1, 1, 1, CardName.ENGINE_CONTROL,     CardSkillType.NONE),
      this.makeCreatureCard(1, 1, 2, CardName.MAYHEM,             CardSkillType.BUFF_ALLIES_1_1),
      this.makeCreatureCard(3, 3, 4, CardName.SLICE,              CardSkillType.NONE),

      this.makeCreatureCard(3, 2, 2, CardName.BATTLE_CHIPSET,     CardSkillType.NONE),
      this.makeCreatureCard(1, 1, 1, CardName.ENGINE_CONTROL,     CardSkillType.ZERO_TURN),
      this.makeCreatureCard(1, 1, 1, CardName.ENGINE_CONTROL,     CardSkillType.NONE),
      this.makeCreatureCard(1, 1, 2, CardName.MAYHEM,             CardSkillType.NONE),
    ]
  }

  private makePompFilterLoot(): CardData[] {
    return [
      this.makeBombCard(2, 3),
      this.makeBombCard(2, 3),
      this.makeCreatureCard(1, 2, 3, CardName.INJECTION,          CardSkillType.INJECTION),
      this.makeCreatureCard(6, 2, 4, CardName.TENKI_CHAGU,        CardSkillType.ZERO_TURN),
      this.makeCreatureCard(2, 5, 3, CardName.SHIELD_CONTROLLER,  CardSkillType.NONE),
      
      this.makeDamageCreatureSpell(4),
      this.makeDamageCreatureSpell(3),
      this.makeCardAddHPCore(6),
      this.makeDamageCoreSpell(4),
    ]
  }



  //
  //  Data cache cards
  //

  private makeDataCache1Deck(): CardData[] {
    return [
      this.makeCreatureCard(3, 2, 2, CardName.BATTLE_CHIPSET,     CardSkillType.NONE),
      this.makeCreatureCard(1, 1, 1, CardName.ENGINE_CONTROL,     CardSkillType.ZERO_TURN),
      this.makeCreatureCard(1, 1, 1, CardName.ENGINE_CONTROL,     CardSkillType.NONE),
      this.makeCreatureCard(1, 1, 2, CardName.MAYHEM,             CardSkillType.BUFF_ALLIES_1_1),
      this.makeCreatureCard(3, 3, 4, CardName.SLICE,              CardSkillType.NONE),

      this.makeCreatureCard(3, 2, 2, CardName.BATTLE_CHIPSET,     CardSkillType.NONE),
      this.makeCreatureCard(1, 1, 1, CardName.ENGINE_CONTROL,     CardSkillType.ZERO_TURN),
      this.makeCreatureCard(1, 1, 1, CardName.ENGINE_CONTROL,     CardSkillType.NONE),
      this.makeCreatureCard(1, 1, 2, CardName.MAYHEM,             CardSkillType.NONE),

      this.makeCreatureCard(3, 2, 2, CardName.BATTLE_CHIPSET,     CardSkillType.NONE),
      this.makeCreatureCard(1, 1, 1, CardName.ENGINE_CONTROL,     CardSkillType.ZERO_TURN),
      this.makeCreatureCard(1, 1, 1, CardName.ENGINE_CONTROL,     CardSkillType.NONE),
      this.makeCreatureCard(1, 1, 2, CardName.MAYHEM,             CardSkillType.NONE),
    ]
  }

  private makeDataCache1Loot(): CardData[] {
    return [
      this.makeCreatureCard(2, 4, 4, CardName.HIDDEN_METHOD,      CardSkillType.BUFF_ATK_WHILE_ALIVE),
      this.makeCreatureCard(2, 3, 4, CardName.MULTIPLE_DISPATCH,  CardSkillType.SLEEPER_HOLD),
      this.makeCreatureCard(1, 2, 3, CardName.INTROSPECT,         CardSkillType.INJECTION),
      this.makeCreatureCard(5, 1, 5, CardName.SLICE,              CardSkillType.SUBTLETY),
      
      this.makeCardAddHPCreature(4),
      this.makeCardAddHPCreature(5),
      this.makeCardAddHPCore(8),
      this.makeDamageCreatureSpell(4),
    ]
  }



  //
  //  Tecnhician cards
  //

  private makeTechnicianDeck(): CardData[] {
    return [
      this.makeCreatureCard(3, 2, 2, CardName.BATTLE_CHIPSET,     CardSkillType.NONE),
      this.makeCreatureCard(1, 2, 1, CardName.DEFENSE_BLOCK,     CardSkillType.ZERO_TURN),
      this.makeCreatureCard(1, 2, 1, CardName.DEFENSE_BLOCK,     CardSkillType.NONE),
      this.makeCreatureCard(1, 1, 3, CardName.MAYHEM,             CardSkillType.BUFF_ALLIES_1_1),
      this.makeCreatureCard(3, 3, 4, CardName.ATTACK_PROTOCOL,    CardSkillType.NONE),

      this.makeCreatureCard(3, 2, 2, CardName.MULTIPLE_DISPATCH,  CardSkillType.NONE),
      this.makeCreatureCard(2, 3, 4, CardName.LARKIN44B,          CardSkillType.ZERO_TURN),
      this.makeCreatureCard(2, 3, 5, CardName.MIXIN,              CardSkillType.BUFF_ATK_WHILE_ALIVE),
      this.makeCreatureCard(1, 1, 2, CardName.MAYHEM,             CardSkillType.NONE),

      this.makeCreatureCard(3, 2, 2, CardName.BATTLE_CHIPSET,     CardSkillType.NONE),
      this.makeCreatureCard(5, 3, 7, CardName.ENGINE_CONTROL,     CardSkillType.ZERO_TURN),
      this.makeCreatureCard(6, 2, 6, CardName.SLICE,               CardSkillType.NONE),
      this.makeCreatureCard(1, 1, 2, CardName.MAYHEM,             CardSkillType.NONE),
    ]
  }

  private makeTechnicianLoot(): CardData[] {
    return [
      this.makeCreatureCard(2, 4, 4, CardName.HIDDEN_METHOD,      CardSkillType.BUFF_ATK_WHILE_ALIVE),
      this.makeCreatureCard(2, 3, 4, CardName.MULTIPLE_DISPATCH,  CardSkillType.SLEEPER_HOLD),
      
      this.makeCardAddHPCreature(5),
      this.makeCardAddHPCreature(5),
      this.makeCardAddHPCore(10),
      this.makeDamageCreatureSpell(6),
      this.makeDamageCoreSpell(8),
    ]
  }
  

  public makeCreatureCard(atk: number, hp: number, link: number, name: CardName, skill: CardSkillType): CardData {
    return {
      type: CardType.CREATURE,
      name: name,
      skill: skill,
      attack: atk,
      hp: hp,
      link: link,
      turned: true
    }
  }

  public makeSkillCard(benefit: number, link: number, name: CardName, skill: CardSkillType): CardData {
    let result: CardData =  {
      type: CardType.EFFECT,
      name: name,
      skill: skill,
      link: link,
      benefit: benefit,
      turned: true
    }
    switch(skill) {
      case CardSkillType.ADD_HP_CORE:
      case CardSkillType.DAMAGE_CORE:
        result.instant = true;
      default:
          break;
    }
    return result;
  }

  public makeSleeperHoldCard(): CardData {
    return {
      type: CardType.CREATURE,
      name: CardName.SLICE,
      skill: CardSkillType.SLEEPER_HOLD,
      attack: 1,
      hp: 5,
      link: 1,
      turned: true
    }
  }

  public makeBombCard(hp: number, link: number): CardData {
    return {
      type: CardType.CREATURE,
      name: CardName.CRASH_OVERRIDE,
      skill: CardSkillType.BOMB,
      attack: 0,
      hp: hp,
      link: link,
      turned: true
    }
  }
  
  public makeHybridCard(): CardData {
    return {
      type: CardType.CREATURE,
      name: CardName.HYBRID,
      skill: CardSkillType.HYBRID,
      attack: 1,
      hp: 2,
      link: 1,
      turned: true
    }
  }

  public makeInjectionCard(): CardData {
    return {
      type: CardType.CREATURE,
      name: CardName.INJECTION,
      skill: CardSkillType.INJECTION,
      attack: 2,
      hp: 2,
      link: 1,
      turned: true,
    }
  }

  public makeSubtletyCard(): CardData {
    return {
      type: CardType.CREATURE,
      name: CardName.SUBTLETY,
      skill: CardSkillType.SUBTLETY,
      attack: 2,
      hp: 1,
      link: 1,
      turned: true
    }
  }

  public makeBuffAtkWhileALiveCard(): CardData {
    return {
      type: CardType.CREATURE,
      name: CardName.MULTIPLE_DISPATCH,
      skill: CardSkillType.BUFF_ATK_WHILE_ALIVE,
      attack: 2,
      hp: 1,
      link: 1,
      turned: true
    }
  }

  public makeCardAddHPCore(hp: number): CardData {
    return {
      type: CardType.EFFECT,
      name: CardName.ADD_HP_CORE,
      skill: CardSkillType.ADD_HP_CORE,
      benefit: hp,
      link: Math.round(hp/2),
      turned: true,
      instant: true
    }
  }

  public makeDamageCoreSpell(benefit: number): CardData {
    return {
      type: CardType.EFFECT,
      name: CardName.DAMAGE_CORE,
      skill: CardSkillType.DAMAGE_CORE,
      benefit: benefit,
      link: benefit,
      turned: true,
      instant: true
    }
  }

  public makeHybernationCard(): CardData {
    return {
      type: CardType.EFFECT,
      name: CardName.HYBERNATION,
      skill: CardSkillType.HYBERNATION,
      link: 1,
      turned: true
    }
  }

  public makeCardAddHPCreature(hp: number): CardData {
    return {
      type: CardType.EFFECT,
      name: CardName.ADD_HP_MODULE,
      skill: CardSkillType.ADD_HP_CREATURE,
      benefit: hp,
      link: Math.round(hp/2),
      turned: true
    }
  }

  public makeDamageCreatureSpell(benefit: number): CardData {
    return {
      type: CardType.EFFECT,
      name: CardName.DAMAGE_MODULE,
      skill: CardSkillType.DAMAGE_CREATURE,
      benefit: benefit,
      link: Math.round(benefit/2),
      turned: true
    }
  }

  public makeEnrageSpell(): CardData {
    return {
      type: CardType.EFFECT,
      name: CardName.ENRAGE,
      skill: CardSkillType.ENRAGE,
      benefit: 0,
      link: 0,
      turned: true
    }
  }

  public makeCardAddAtk(atk: number): CardData {
    return {
      type: CardType.EFFECT,
      name: CardName.ADD_ATK_MODULE,
      skill: CardSkillType.ADD_ATTACK_CREATURE,
      benefit: atk,
      link: atk,
      turned: true
    }
  }
}

