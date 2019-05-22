/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  gaminator 19
*/

import { PlayerBoardData, BoardData, CardData, CardType, CardSkillType, BoardPhase } from "../types/Types";

export class BattleService {

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
    let result: PlayerBoardData = {
      name: 'Sora',
      deck: [this.makeCard1(0), this.makeCard1(1), this.makeCard1(2), this.makeCard1(3), this.makeCard1(4), this.makeCard1(5), this.makeCard1(6)],
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
      name: 'Master Node',
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
      name: 'Doogie',
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
      name: 'Snuk-chak',
      attack: 1 + power,
      hp: 1 + power,
      link: 1 + power,
      turned: true
    }
  }

  public makeLootCards(): CardData[] {
    return [this.makeCard2(0), this.makeCard2(1), this.makeCard2(2), this.makeCard2(3), this.makeCard2(4), this.makeCard2(5), this.makeCard2(6)];
  }
}

