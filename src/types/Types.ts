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
  ZERO_TURN,
}

export type CardData = {
  type: CardType
  effect?: CardEffectType
  skill?: CardSkillType
  name: string
  attack?: number
  hp?: number
  link: number
}