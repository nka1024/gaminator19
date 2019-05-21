/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  gaminator 19
* @license      Apache 2.0
*/

import { TileGrid } from "../../TileGrid";
import { UI_DEPTH } from "../../const/const";
import { GameObjects } from "phaser";
import { Point } from "../../types/Types";

export type MapObjetctData = {
  texture: string,
  depth: number,
  x: number,
  y: number
}
export class MapImporterModule {
  private scene: Phaser.Scene;
  private grid: TileGrid;

  public enemyHandler: (p: Point, type: string) => void;

  public grassHandler: (obj:GameObjects.Image, item: any) => void;
  public ambientHandler: (obj: MapObjetctData) => void;

  constructor(scene: Phaser.Scene, grid: TileGrid) {
    this.scene = scene;
    this.grid = grid;
  }

  public importMap(map: any) {
    // cleanup
    for (let child of this.scene.children.getAll()) {
      // exclude UI
      let depth = (child as Phaser.GameObjects.Image).depth;
      if (![
        UI_DEPTH.CURSOR, 
        UI_DEPTH.EDITOR_GRID_FRAME, 
        UI_DEPTH.EDITOR_GRID_TILE
      ].includes(depth)) {
        child.destroy()
      }
    }

    // create grid from config
    this.grid.import(map.grid);
    // create objects from config      
    for (let item of map.objects) {
      let o = this.createObjectFromConfig(item);

      let texture: string = item.texture;
      if (texture.startsWith('grass')) {
        if (this.grassHandler) {
          this.grassHandler(o, item);
        }
      }
    }
  }

  private createObjectFromConfig(data: any): GameObjects.Image {
    if (data.texture.startsWith('actor_') && this.enemyHandler) {
      let enemyType = null;
      if (data.texture == 'actor_2') enemyType = 'tower'
      if (data.texture == 'actor_3') enemyType = 'boss'
      if (data.texture == 'actor_4') enemyType = 'k11'
      
      this.enemyHandler(data, enemyType);
      return null;      
    } else if (data.texture.startsWith('ambient_') && this.ambientHandler) {
       this.ambientHandler(data);
    } else return this.createImageFromConfig(data);
  }

  private createImageFromConfig(data: any) {
    let obj = new GameObjects.Image(this.scene, data.x, data.y, null);
    obj.scaleX = 1;
    obj.scaleY = 1;
    if (data.texture.startsWith('terrain')) {
      obj.originX = 0;
      obj.originY = 0;
    } else {
      obj.originX = 0.5;
      obj.originY = 1;
    }
    obj.setTexture(data.texture);
    // obj.x = data.x;
    // obj.y = data.y + 32;
    if (data.texture.startsWith('device')) {
      obj.depth = data.depth - 70;
    } else {
      obj.depth = data.depth;
    }
    this.scene.add.existing(obj);
    return obj;
  }
  
}

