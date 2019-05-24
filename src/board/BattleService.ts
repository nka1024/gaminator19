/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  gaminator 19
*/

import { PlayerBoardData, BoardData, CardData, CardType, CardSkillType, BoardPhase } from "../types/Types";

export enum ModuleName {
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
      BattleService.playerDeck = [this.makeCard1(0), this.makeCard1(1), this.makeCard1(2), this.makeCard1(3), this.makeCard1(4), this.makeCard1(5), this.makeCard1(6)]
    }
    let result: PlayerBoardData = {
      name: 'Sora',
      deck: Object.assign([], BattleService.playerDeck),
      hand: [],
      board: [],
      link: 0,
      linkMax: 0,
      hp: 15
    }
    return result;
  }

  public makeOpponentData(): PlayerBoardData {
    let result: PlayerBoardData = {
      name: ModuleName.Doogie,
      deck: [this.makeCard2(0), this.makeCard2(1), this.makeCard2(2), this.makeCard2(3), this.makeCard2(4), this.makeCard2(5), this.makeCard2(6)],
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

  private randomName(): ModuleName {
    let a = [
      ModuleName.Snukchak,
      ModuleName.Doogie,
      ModuleName.x11F0C4,
      ModuleName.xAF2D10,
      ModuleName.x0B4211,
      ModuleName.x1D4531,
      ModuleName.x3A8C30,
      ModuleName.xF93A72,
      ModuleName.xA90013,
      ModuleName.xCF3081,
      ModuleName.HP6
    ]
    return a[Math.floor(Math.random() * a.length)];
  }
}

