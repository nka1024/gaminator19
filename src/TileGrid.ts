/**
* @author       Kirill Nepomnyaschiy <nka1024e@gmail.com>
* @copyright    nka1024
* @description  gaminator 19
* @license      Apache 2.0
*/

import { UI_DEPTH, CONST } from "./const/const";
import { GameObjects } from "phaser";
import { Tile, Point } from "./types/Types";
import { MapTriggerType } from "./modules/scene/MapImporterModule";

export declare type GrassData = {
  object: GameObjects.Image;
  volume: number
}

export class TileGrid {

  public gridSize: number = 221;
  public tileSize: number = 16;

  private grid: Phaser.GameObjects.Image[];
  private tiles: Phaser.GameObjects.Image[][];
  private triggers: Phaser.GameObjects.Image[][];
  private data: number[][];
  private fog: Phaser.GameObjects.Image[][];
  public fogLayer: Phaser.Tilemaps.DynamicTilemapLayer;

  private scene: Phaser.Scene;
  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    this.data = [];
    this.tiles = [];
    this.fog = [];
    this.triggers = []
    for (let i = 0; i < this.gridSize; i++) {
      this.data[i] = [];
      this.tiles[i] = [];
      this.fog[i] = [];
      this.triggers[i] = [];
      for (let j = 0; j < this.gridSize; j++) {
        this.data[i][j] = 0;
        this.tiles[i][j] = null;
        this.fog[i][j] = null;
        this.triggers[i][j] = null;
      }
    }

  }

  public hideGrid() {
    // hide grid if it exists
    for (let img of this.grid) {
      img.destroy();
    }
    this.grid = null;

    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        this.tiles[i][j].destroy();
        this.tiles[i][j] = null;
        if (this.triggers[i][j]) {
          this.triggers[i][j].destroy();
          this.triggers[i][j] = null;
        }
      }
    }
    return;
  }

  public showGrid() {
    var grid = [];
    // grid image
    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 20; j++) {
        let img = new Phaser.GameObjects.Image(this.scene, 0, 0, null);
        img.scaleX = 1;
        img.scaleY = 1;
        img.originX = 0;
        img.originY = 0;
        img.setTexture("grid_128_30");
        img.x = 128 * i;
        img.y = 128 * j;
        img.depth = UI_DEPTH.EDITOR_GRID_FRAME;
        this.scene.add.existing(img);

        grid.push(img);
      }
    }
    this.grid = grid;

    // grid tiles
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        let n = this.data[i][j];
        let color = n == 0 ? "green" : "red";
        this.tiles[i][j] = this.createTile({ i: i, j: j }, color);
      }
    }
  }


  public getTileIJ(p: Point): any {
    try {
      if (p.x < 0 || p.y < 0) throw ('cant be negative')
      let gridPos = this.worldToGrid(p);
      let tile = this.data[gridPos.i][gridPos.j];
      return {
        i: gridPos.i,
        j: gridPos.j,
        walkable: tile == 0
      };
    } catch (e) {
      // console.log(e)
    }
    return null;
  }

  public isWalkable(tile: Tile): boolean {
    if (!this.legit(tile)) return false;
    return this.data[tile.i][tile.j] == 0;
  }

  public isFree(tile: Tile): boolean {
    return this.legit(tile) &&
      this.data[tile.i][tile.j] == 0
  }

  public legit(tile: Tile): boolean {
    if (tile.i < 0 || tile.i >= this.data.length) return false;
    if (tile.j < 0 || tile.j >= this.data.length) return false;
    return true;
  }

  private createTile(tile: Tile, color: string, fog: boolean = false): Phaser.GameObjects.Image {
    let img = new Phaser.GameObjects.Image(this.scene, 0, 0, null);
    // img.scaleX = 2;
    // img.scaleY = 2;
    img.setTexture(fog ? 'fog_tile_16_a70' : 'grid_tile_' + color + '_16_a50');
    img.depth = UI_DEPTH.EDITOR_GRID_TILE;
    var wc = this.gridToWorld(tile)
    img.x = wc.x + 8;
    img.y = wc.y + 8;
    this.scene.add.existing(img);
    return img;
  }

  public editTile(cursor: Point, color: string) {
    let tile = this.worldToGrid(cursor);
    let currentTile = this.tiles[tile.i][tile.j];
    if (currentTile != null) {
      currentTile.destroy();
    }
    let img = this.createTile(tile, color);
    this.tiles[tile.i][tile.j] = img;
    this.data[tile.i][tile.j] = color == "red" ? 1 : 0;

  }

  private createTriggerTile(tile: Tile, repeat: boolean) {
    let img = new Phaser.GameObjects.Image(this.scene, 0, 0, null);
    img.setTexture(repeat ? 'grid_tile_trigger_repeat_16_a100' : 'grid_tile_trigger_once_16_a100');
    img.depth = UI_DEPTH.EDITOR_GRID_TRIGGER;
    var wc = this.gridToWorld(tile)
    img.x = wc.x + 8;
    img.y = wc.y + 8;
    this.scene.add.existing(img);

    return img;
  }

  public addTrigger(tile: Tile, type: MapTriggerType) {
    let currentTile = this.triggers[tile.i][tile.j];
    if (currentTile != null) {
      currentTile.destroy();
      this.triggers[tile.i][tile.j] = null;
    }
    let img = this.createTriggerTile(tile, type == MapTriggerType.Repeatable ? true : false);
    this.triggers[tile.i][tile.j] = img;
  }

  public removeTrigger(tile: Tile) {
    let currentTile = this.triggers[tile.i][tile.j];
    if (currentTile != null) {
      currentTile.destroy();
      this.triggers[tile.i][tile.j] = null;
    }
  }

  public cursorFollow(cursor: Phaser.GameObjects.Image) {
    let screenPosX = Math.round(this.scene.input.activePointer.x / 2) * 2;
    let screenPosY = Math.round(this.scene.input.activePointer.y / 2) * 2;
    let worldPosX = screenPosX + this.scene.cameras.main.scrollX;
    let worldPosY = screenPosY + this.scene.cameras.main.scrollY;

    let snapPos = this.snapToGrid({ x: worldPosX, y: worldPosY })
    cursor.x = snapPos.x + this.tileSize / 2;
    cursor.y = snapPos.y + this.tileSize / 2;
  }

  public export(): any {
    return this.data;
  }

  public import(grid: number[][]) {
    let data = [];
    for (let i = 0; i < this.gridSize; i++) {
      data.push([])
      if (grid.length <= i) {
        for (let j = 0; j < this.gridSize; j++) {
          data[i].push(1);
        }
      } else {
        for (let j = 0; j < this.gridSize; j++) {
          if (grid[i].length <= j) {
            data[i].push(1)
          } else {
            data[i][j] = grid[i][j];
          }
        }
      }
    }

    this.data = data;
  }

  public gridToWorld(tile: Tile): Point {
    return {
      x: tile.j * this.tileSize,
      y: tile.i * this.tileSize
    };
  }
  public worldToGrid(p: Point): Tile {
    return {
      i: Math.floor(p.y / this.tileSize),
      j: Math.floor(p.x / this.tileSize)
    };
  }

  public snapToGrid(p: Point): Point {
    let gridPos = this.worldToGrid(p);
    return this.gridToWorld(gridPos);
  }

  get visible() {
    return this.grid != null;
  }

  public distanceXY(a: Point, b: Point, opt: string = null): Tile {
    let ap = this.worldToGrid(a);
    let bp = this.worldToGrid(b);
    return this.distance(ap, bp, opt);
  }

  public distance(a: Tile, b: Tile, opt: string = null): Tile {
    if (opt == 'abs')
      return { i: Math.abs(a.i - b.i), j: Math.abs(a.j - b.j) };
    else
      return { i: a.i - b.i, j: a.j - b.j };
  }
  
  public findPath(from: Tile, to: Tile, callback: (path: Tile[]) => void): number {
    return 1;
  }

  public update() {
  }
}