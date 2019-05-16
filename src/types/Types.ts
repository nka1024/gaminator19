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
  MODULE,
  EFFECT
}

export enum CardEffectType  {
  HEAL,
  EMPOWER,
}

export type CardData = {
  type: CardType
  effect: CardEffectType
  name: string
  attack: number
  hp: number
  link: number
}