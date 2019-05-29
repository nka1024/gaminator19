/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  gaminator 19
*/

import { PlayerBoardData, BoardData, CardData, CardType, CardSkillType, BoardPhase } from "../types/Types";

export enum CardName {
  Snukchak = 'Snuk-chak',
  Doogie = 'Doogie',
  x11F0C4 = '0x11F0C4',
  xAF2D10 = '0xAF2D10',
  x0B4211 = 'x0B4211',
  x1D4531 = 'x1D4531',
  x3A8C30 = 'x3A8C30',
  xF93A72 = 'xF93A72',
  xA90013 = 'xA90013',
  xCF3081 = 'xCF3081',
  ADD_ATK_MODULE = 'Add power',
  ADD_HP_MODULE = 'Add module HP',
  ADD_HP_CORE = 'Add core HP',
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
    return array;
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

  public makeBoardData(): BoardData {
    let result: BoardData = {
      opponent: this.makeOpponentData(),
      player: this.makePlayerData(),
      phase: BoardPhase.UNDEFINED,
      turn: 0
    }
    return result;
  }

  public makePlayerData(): PlayerBoardData {
    if (BattleService.playerDeck.length == 0) {
      BattleService.playerDeck = [
        this.makeCard1(0),
        this.makeBombCard(),
        this.makeEnrageSpell(),
        this.makeBuffAtkWhileALiveCard(),
        this.makeZeroTurnCard(1),
        this.makeCardAddHPCore(1),
        this.makeCardAddHPCreature(2),
        this.makeCardAddAtk(3),
        this.makeHybernationCard(),
        this.makeHybridCard(),
        this.makeSubtletyCard(),
        this.makeInjectionCard(),
        this.makeDamageCoreSpell(1),
        this.makeDamageCreatureSpell(2),
        this.makeCard1(1),
        this.makeCard1(2),
        this.makeCard1(3),
        this.makeCard1(4),
        this.makeCard1(5),
        this.makeCard1(6)]
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
  public makeOpponentDeck(): CardData[] {
    return [
      this.makeCard2(0),
      this.makeCard2(1),
      this.makeCard2(2),
      this.makeCard2(3),
      this.makeCard2(4),
      this.makeCard2(5),
    ]
  }

  public makeOpponentData(): PlayerBoardData {
    let result: PlayerBoardData = {
      name: CardName.Doogie,
      deck: this.makeOpponentDeck(),
      hand: [],
      board: [],
      link: 0,
      linkMax: 0,
      hp: 15
    }
    return result;
  }

  public makeCard1(power: number = 0): CardData {
    return {
      type: CardType.CREATURE,
      name: this.randomName(),
      skill: CardSkillType.BUFF_ALLIES_1_1,
      attack: 1 + power,
      hp: 1 + power,
      link: 1 + power,
      turned: true
    }
  }

  public makeZeroTurnCard(power: number = 0): CardData {
    return {
      type: CardType.CREATURE,
      name: this.randomName(),
      skill: CardSkillType.ZERO_TURN,
      attack: 1 + power,
      hp: 1 + power,
      link: 1 + power,
      turned: true
    }
  }
  
  public makeBombCard(): CardData {
    return {
      type: CardType.CREATURE,
      name: CardName.xAF2D10,
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
      name: CardName.x3A8C30,
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

  public makeCard2(power: number = 0): CardData {
    return {
      type: CardType.CREATURE,
      name: this.randomName(),
      attack: 1 + power,
      hp: 1 + power,
      link: 1 + power,
      turned: true
    }
  }

  public makeLootCards(): CardData[] {
    return [this.makeCard2(0), this.makeCard2(1), this.makeCard2(2), this.makeCard2(3), this.makeCard2(4), this.makeCard2(5), this.makeCard2(6)];
  }

  private randomName(): CardName {
    let a = [
      CardName.Snukchak,
      CardName.Doogie,
      CardName.x11F0C4,
      CardName.xAF2D10,
      CardName.x0B4211,
      CardName.x1D4531,
      CardName.x3A8C30,
      CardName.xF93A72,
      CardName.xA90013,
      CardName.xCF3081,
    ]
    return a[Math.floor(Math.random() * a.length)];
  }
}

