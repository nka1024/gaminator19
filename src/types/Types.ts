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