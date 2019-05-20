/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  gaminator 19
* @license      Apache 2.0
*/


import { AssetsLoader } from "../AssetsLoader";
import { TileGrid } from "../TileGrid";


import { Hero, UnitData } from "../Hero";
import { GameObjects } from "phaser";

import { CONST } from "../const/const";


export class GameplayRootScene extends Phaser.Scene {

  private grid: TileGrid;

  // objects
  public hero: Hero;
  private unitsGrp: Phaser.GameObjects.Group;


  // modules


  private escapeKey: Phaser.Input.Keyboard.Key;

  constructor() {
    super({
      key: "GameplayRootScene"
    });
    
  }

  preload() {
    AssetsLoader.preload(this);
  }

  injectDependencies() {
    this.hero = new Hero();
    this.grid = new TileGrid(this);
  }

  private onWindowResize(w: number, h: number) {
    this.cameras.main.setSize(w, h);
    if (w < 500) {
      this.cameras.main.zoom = 1;
    } else if (w <= 1280) {
      this.cameras.main.zoom = 2;
    } else  {
      this.cameras.main.zoom = 3;
    }
    // this.unitsPanel.zoom = this.cameras.main.zoom;
  }

  create(data): void {
    this.injectDependencies();
    this.cameras.main.setBackgroundColor(0x1f1f1f);

    let mapsize = this.grid.gridSize * this.grid.tileSize;
    this.cameras.main.setBounds(0, 0, mapsize, mapsize);

    this.events.on('resize', (w: number, h: number) => this.onWindowResize(w, h));

    this.grid.createFog();


    this.onWindowResize(window.innerWidth, window.innerHeight);

    this.escapeKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
  }

  private fogUpdateCnt: number = 60;
  update(): void {
    if (this.grid) {
      this.fogUpdateCnt++
      if (this.fogUpdateCnt > 60) {
        this.fogUpdateCnt = 0;
        // this.grid.updateFog(this.player.tile);
      }
      this.grid.update();
    }
  }
}
