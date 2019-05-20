/**
* @author       Kirill Nepomnyaschiy <nka1024e@gmail.com>
* @copyright    nka1024
* @description  gaminator 19
* @license      Apache 2.0
*/

import { js as easystar } from "easystarjs";
import { UI_DEPTH, CONST } from "./const/const";
import { GameObjects } from "phaser";
import { Tile, Point } from "./types/Types";

export declare type GrassData = {
  object: GameObjects.Image;
  volume: number
}

export class TileGrid {

  public gridSize: number = 90;
  public tileSize: number = 16;
  
  private grid: Phaser.GameObjects.Image[];
  private tiles: Phaser.GameObjects.Image[][];
  private data: number[][];
  private fog: Phaser.GameObjects.Image[][];
  private grasses: any = {};
  public fogLayer: Phaser.Tilemaps.DynamicTilemapLayer;

  private scene: Phaser.Scene;
  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    this.data = [];
    this.tiles = [];
    this.fog = [];
    for (let i = 0; i < this.gridSize; i++) {
      this.data[i] = [];
      this.tiles[i] = [];
      this.fog[i] = [];
      for (let j = 0; j < this.gridSize; j++) {
        this.data[i][j] = 0;
        this.tiles[i][j] = null;
        this.fog[i][j] = null;
      }
    }

    this.initPathfinder();
    this.pathfinder.setGrid(this.data);
  }

  public toggleGrid() {
    // hide grid if it exists
    if (this.grid != null) {
      for (let img of this.grid) {
        img.destroy();
      }
      this.grid = null;

      for (let i = 0; i < this.gridSize; i++) {
        for (let j = 0; j < this.gridSize; j++) {
          this.tiles[i][j].destroy();
          this.tiles[i][j] = null;
        }
      }
      return;
    }


    var grid = [];
    // grid image
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        let img = new Phaser.GameObjects.Image(this.scene, 0, 0, null);
        img.scaleX = 2;
        img.scaleY = 2;
        img.originX = 0;
        img.originY = 0;
        img.setTexture("grid_128_30");
        img.x = 256 * i;
        img.y = 256 * j;
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


  /// Fog

  public createFog() {
    let fog: integer[][] = []
    for (let i = 0; i < this.gridSize; i++) {
      fog [i] = []
      for (let j = 0; j < this.gridSize; j++) {
        fog[i][j] = 0;
      }
    }

    let config:Phaser.Types.Tilemaps.TilemapConfig = {
      data: fog,
      tileWidth: 32,
      tileHeight: 32,
      insertNull: true
    }

    let tilemap = this.scene.make.tilemap(config);
    var tileset = tilemap.addTilesetImage('fog_tilemap');
    this.fogLayer = tilemap.createDynamicLayer(0, tileset, 0, 0);
    this.fogLayer.depth = UI_DEPTH.EDITOR_GRID_TILE;
  }

  public updateFog(center: Tile) {
    let size: number = 4;
    for (let i = center.i - (size - 1); i < center.i + size; i++) {
      for (let j = center.j - (size - 1); j < center.j + size; j++) {
        if (this.legit({ i: i, j: j })) {
          this.fogLayer.removeTileAt(j, i, true, false);
        }
      }
    }

    for (let i = center.i - (size - 2); i < center.i + (size - 1); i++) {
      for (let j = center.j - size; j < center.j + (size + 1); j++) {
        if (this.legit({ i: i, j: j })) {
          this.fogLayer.removeTileAt(j, i, true, false);
        }
      }
    }

    for (let i = center.i - size; i < center.i + (size + 1); i++) {
      for (let j = center.j - (size - 2); j < center.j + (size - 1); j++) {
        if (this.legit({ i: i, j: j })) {
          this.fogLayer.removeTileAt(j, i, true, false);
        }
      }
    }
  }

  public isFog(tile: Tile): boolean{
    return this.fogLayer.hasTileAt(tile.j, tile.i);
  }

  // Grass
  
  public addGrass(object: any, tile: Tile, volume: number) {
    let hashKey = tile.i + '_' + tile.j;
    let grass = {object: object, volume: volume};
    if (!this.grasses[hashKey]) {
      this.grasses[hashKey] = [grass];
    } else {
      this.grasses[hashKey].push(grass);
    }
  }

  public hasGrass(tile: Tile): boolean {
    return this.grassAt(tile) && this.grassAt(tile).length > 0;
  }

  public grassAt(tile: Tile): GrassData[] {
    let hashKey = tile.i + '_' + tile.j;
    return this.grasses[hashKey];
  }

  public consumeGrass(tile: Tile, volume: number) {
    let hashKey = tile.i + '_' + tile.j;
    let arr: GrassData[] = this.grasses[hashKey];
    let grass = arr[0];
    grass.volume -= volume;
    if (grass.volume <= 0) {
      grass.object.destroy();
      arr.shift();
    }
    return ;
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
    img.scaleX = 2;
    img.scaleY = 2;
    img.setTexture(fog ? 'fog_tile_16_a70' : 'grid_tile_' + color + '_16_a50');
    img.depth = UI_DEPTH.EDITOR_GRID_TILE;
    var wc = this.gridToWorld(tile)
    img.x = wc.x + this.gridSize/2;
    img.y = wc.y + this.gridSize/2;
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

    // todo: optimize?
    this.pathfinder.setGrid(this.data);
  }

  public cursorFollow(cursor: Phaser.GameObjects.Image) {
    let screenPosX = Math.round(this.scene.input.activePointer.x / 2) * 2;
    let screenPosY = Math.round(this.scene.input.activePointer.y / 2) * 2;
    let worldPosX = screenPosX + this.scene.cameras.main.scrollX;
    let worldPosY = screenPosY + this.scene.cameras.main.scrollY;

    let snapPos = this.snapToGrid({ x: worldPosX, y: worldPosY })
    cursor.x = snapPos.x + this.gridSize/2;
    cursor.y = snapPos.y + this.gridSize/2;
  }

  public export(): any {
    return this.data;
  }

  public import(grid: any) {
    this.data = grid;
    this.pathfinder.setGrid(this.data);
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


  // Pathfinding with Easystarjs

  private pathfinder: easystar;
  private initPathfinder() {
    this.pathfinder = new easystar();
    this.pathfinder.enableSync();
    this.pathfinder.enableDiagonals();
    this.pathfinder.setAcceptableTiles([0]);
  }

  public findPath(from: Tile, to: Tile, callback: (path: Tile[]) => void): number {
    return this.pathfinder.findPath(from.j, from.i, to.j, to.i, (path: Point[]) => {
      let result = null;
      if (path) {
        result = path.map((v, i, arr) => {
          return { i: v.y, j: v.x };
        });
      }
      callback(result);
    });
  }

  public update() {
    this.pathfinder.calculate();
  }
}