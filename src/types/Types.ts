/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  gaminator 19
*/

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
  HYBRID,
  SUBTLETY,
  INJECTION,
  BUFF_ATK_WHILE_ALIVE,
}

export type CardData = {
  type: CardType
  effect?: CardEffectType
  skill?: CardSkillType
  name: string
  attack?: number
  hp?: number
  link: number
  benefit?: number
  protected?: boolean
  turned: boolean
  instant?: boolean

  // effects:
  hybernate?: number
  atkBuff?: number
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
  link: number
  linkMax: number
  hp: number
}