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
  HP6 = 'HP 6'
}
export class BattleService {

  public static playerDeck: CardData[] = [];

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
      BattleService.playerDeck = [this.makeCard1(0), this.makeCardHPCore(2), this.makeCard1(1), this.makeCard1(2), this.makeCard1(3), this.makeCard1(4), this.makeCard1(5), this.makeCard1(6)]
    }
    let result: PlayerBoardData = {
      name: 'Sora',
      deck: Object.assign([], BattleService.playerDeck),
      hand: [],
      board: [],
      link: 0,
      linkMax: 0,
      hp: 1
    }
    return result;
  }

  public makeOpponentData(): PlayerBoardData {
    let result: PlayerBoardData = {
      name: CardName.Doogie,
      deck: [this.makeCard2(0), this.makeCard2(1), this.makeCard2(2), this.makeCard2(3), this.makeCard2(4), this.makeCard2(5), this.makeCard2(6)],
      hand: [],
      board: [],
      link: 0,
      linkMax: 0,
      hp: 1
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

  public makeCardHPCore(hp: number): CardData {
    return {
      type: CardType.EFFECT,
      name: CardName.HP6,
      skill: CardSkillType.RECOVER_HP_CORE,
      attack: 0,
      hp: hp,
      link: hp,
      turned: true
    }
  }

  public makeCardHPCreature(hp: number): CardData {
    return {
      type: CardType.EFFECT,
      name: CardName.HP6,
      skill: CardSkillType.RECOVER_HP_CREATURE,
      attack: 0,
      hp: hp,
      link: hp,
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
      CardName.HP6
    ]
    return a[Math.floor(Math.random() * a.length)];
  }
}

