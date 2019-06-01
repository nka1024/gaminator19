/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  gaminator 19
*/

import { CardName } from "../board/BattleService";

export type Tile = {
  i: number,
  j: number
}

export type Point = {
  x: number,
  y: number
}

export enum PhaseType  {
  LOAD = 0,
  COMMANDS,
  PROTECT,
  COMPILE,
  OPPONENT,
}

export enum CardType  {
  CREATURE,
  EFFECT,
}

export enum CardEffectType  {
  HEAL,
  EMPOWER,
}

export enum CardSkillType  {
  NONE,
  BUFF_ALLIES_1_1,
  ADD_HP_CREATURE,
  ADD_HP_CORE,
  ADD_ATTACK_CREATURE,
  DAMAGE_CREATURE,
  DAMAGE_CORE,
  HYBERNATION,
  ZERO_TURN,
  HYBRID, // eсли этот модуль заменяет другой модуль на поле, то их атаки и сабильность складываются
  SUBTLETY,   //  пока этот модуль защищен Скрытием, уменьшает весь получаемый ядром урон вдвое
  INJECTION, // при выходе на поле меняется местами с модулем противника напротив
  BUFF_ATK_WHILE_ALIVE, // пока на поле, ваши модули наносят 1 дополнительный урон
  ENRAGE, // наносит модулю 1 урон и дает +2 атаки
  BOMB, // во время гибели наносит 3 урона всем модулям противника
  SLEEPER_HOLD, // sleeper_hold При успешной защите вводит модуль противника в спящий режим на 1 цикл
}

export type CardData = {
  type: CardType
  effect?: CardEffectType
  skill?: CardSkillType
  name: CardName
  attack?: number
  hp?: number
  link: number
  benefit?: number
  protected?: boolean
  turned: boolean
  instant?: boolean

  // effects:
  hybernate?: number
}

export enum BoardPhase {
  UNDEFINED,
  PREPARE,
  PLAYER_DRAW,
  PLAYER_COMMAND,
  PLAYER_PROTECT,
  PLAYER_COMPILE,
  OPPONENT_DRAW,
  OPPONENT_COMMAND,
  OPPONENT_PROTECT,
  OPPONENT_COMPILE,
  BATTLE_END,
}

export type BoardData = {
  opponent: PlayerBoardData
  player: PlayerBoardData
  phase: BoardPhase
  turn: number
}

export type PlayerBoardData = {
  name: string
  deck: CardData[]
  hand: CardData[]
  board: CardData[]
  loot: CardData[]
  link: number
  linkMax: number
  hp: number
}