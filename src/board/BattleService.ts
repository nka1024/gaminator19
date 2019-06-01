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
  INSTRUCTIONxA90013 = 'Инструкция xA90013',
  SLICE = 'Slice',
  NULLPTR = 'Нулевой указатель',
  ADD_ATK_MODULE = 'Усиление',
  ADD_HP_MODULE = 'Стабильность модуля',
  ADD_HP_CORE = 'Стабильность ядра',
  HYBERNATION = 'Гибернация',
  HYBRID = 'Гибрид',
  SUBTLETY = 'Кардинал',
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
      loot: this.makeLootCardsForEncounter(encounter)
    }
    return result;
  }

  public makePlayerData(): PlayerBoardData {
    if (BattleService.playerDeck.length == 0) {
      BattleService.playerDeck = [

      this.makeCreatureCard(1, 1, 1, CardName.DYNAMIC_CONTRACT, CardSkillType.NONE),
      this.makeCreatureCard(1, 2, 3, CardName.AUTODEBUG, CardSkillType.BUFF_ALLIES_1_1),
      this.makeCreatureCard(1, 1, 2, CardName.DEBUG_HOOK, CardSkillType.BUFF_ALLIES_1_1),
      this.makeCreatureCard(1, 3, 1, CardName.ATTACK_PROTOCOL, CardSkillType.ZERO_TURN),
      this.makeCreatureCard(3, 4, 4, CardName.STANDART_TEST, CardSkillType.NONE),
      this.makeSkillCard(3, 4, CardName.DAMAGE_CORE,  CardSkillType.DAMAGE_CORE),
      this.makeSkillCard(3, 2, CardName.HYBERNATION,  CardSkillType.HYBERNATION),
      this.makeSkillCard(3, 3, CardName.ADD_HP_CORE,  CardSkillType.ADD_HP_CORE),
      this.makeSkillCard(1, 0, CardName.ENRAGE,  CardSkillType.ENRAGE),
      
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
    let result: PlayerBoardData = {
      name: 'Sora',
      deck: this.shuffle(this.copyAll(BattleService.playerDeck)),
      hand: [],
      board: [],
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
      link: 0,
      linkMax: 0,
      hp: 15
    }

    switch(encounter) {
      case EncounterName.TRANSPORT_PLATFORM: 
      result.deck = this.makeTransportPlatformDeck(); 
      result.name = 'Транспортная система'; 
      result.hp = 15;
      break;
      case EncounterName.DEAD_TECHNICIAN: 
      result.deck = this.makeTransportPlatformDeck(); 
      result.name = 'Нейроинтерфейс'; 
      result.hp = 15;
      break;
      case EncounterName.DATA_CACHE_1: 
      result.deck = this.makeTransportPlatformDeck(); 
      result.name = 'Региональный дата-кэш'; 
      result.hp = 15;
      break;
      default: throw 'unknown encounter type';
    }

    return result;
  }

  

  private makeTransportPlatformDeck(): CardData[] {
    return [
      this.makeCreatureCard(1, 1, 1, CardName.TRANSPORT_SYSTEM,   CardSkillType.NONE),
      this.makeCreatureCard(1, 2, 3, CardName.ENGINE_CONTROL,     CardSkillType.BUFF_ALLIES_1_1),
      this.makeCreatureCard(1, 1, 2, CardName.INSTRUCTIONxA90013, CardSkillType.BUFF_ALLIES_1_1),
      this.makeCreatureCard(3, 3, 4, CardName.NULLPTR,            CardSkillType.NONE),
      this.makeCreatureCard(3, 4, 4, CardName.NULLPTR,            CardSkillType.NONE),

      this.makeCreatureCard(1, 1, 1, CardName.TRANSPORT_SYSTEM,   CardSkillType.NONE),
      this.makeCreatureCard(1, 2, 3, CardName.ENGINE_CONTROL,     CardSkillType.BUFF_ALLIES_1_1),
      this.makeCreatureCard(1, 1, 2, CardName.INSTRUCTIONxA90013, CardSkillType.BUFF_ALLIES_1_1),
      this.makeCreatureCard(3, 3, 4, CardName.NULLPTR,            CardSkillType.NONE),
      this.makeCreatureCard(3, 4, 4, CardName.NULLPTR,            CardSkillType.NONE),
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

  public makeBombCard(): CardData {
    return {
      type: CardType.CREATURE,
      name: CardName.LARKIN44B,
      skill: CardSkillType.BOMB,
      attack: 0,
      hp: 3,
      link: 1,
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
      link: hp,
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
      link: hp,
      turned: true
    }
  }

  public makeDamageCreatureSpell(benefit: number): CardData {
    return {
      type: CardType.EFFECT,
      name: CardName.DAMAGE_MODULE,
      skill: CardSkillType.DAMAGE_CREATURE,
      benefit: benefit,
      link: benefit,
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

  // private randomName(): CardName {
  //   let a = [
  //     CardName.Snukchak,
  //     CardName.Doogie,
  //     CardName.x11F0C4,
  //     CardName.xAF2D10,
  //     CardName.x0B4211,
  //     CardName.x1D4531,
  //     CardName.x3A8C30,
  //     CardName.xF93A72,
  //     CardName.xA90013,
  //     CardName.xCF3081,
  //   ]
  //   return a[Math.floor(Math.random() * a.length)];
  // }
}

