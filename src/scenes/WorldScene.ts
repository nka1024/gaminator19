/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  gaminator 19
*/

import { AssetsLoader } from "../AssetsLoader";
import { AnimationRegistry } from "../AnimationRegistry";
import { WorldPlayer } from "../world/WorldPlayer";
import { WorldAmbientObject } from "../world/WorldAmbientObject";
import { Point } from "../types/Types";
import { TileGrid } from "../TileGrid";
import { MapImporterModule } from "../modules/scene/MapImporterModule";

export class WorldScene extends Phaser.Scene {

  private prevWorldOffset: Point = null;
  private MAP_W: number = 1024;

  private groundImg: Phaser.GameObjects.Image;
  private waterShader: Phaser.GameObjects.Shader;

  private grid: TileGrid;
  private mapImporter: MapImporterModule;

  private player: WorldPlayer;
  private animationRegistry: AnimationRegistry;

  private pool: Phaser.GameObjects.Group;
  private terrains = [
    ["water_01", "water_02", "water_03", "water_04"],
    ["water_05", "water_06", "water_07", "water_08"],
    ["water_09", "water_10", "water_11", "water_12"],
    ["water_13", "water_14", "water_15", "water_16"]];
    

  constructor() {
    super({
      key: "WorldScene"
    });
  }

  preload() {
    AssetsLoader.preload(this);
  }

  create(data): void {

    this.grid = new TileGrid(this);
    this.loadMap();
    this.cameras.main.setBackgroundColor(0x1f1f1f);
    this.animationRegistry = new AnimationRegistry(this);
    this.animationRegistry.initWorldAnimations();

    this.pool = this.add.group();
    this.pool.runChildUpdate = true;

    let xs = [{ x: 200, y: 200 },
    { x: 324, y: 245 },
    { x: 364, y: 209 },
    { x: 340, y: 72 },
    { x: 274, y: 93 },
    { x: 211, y: 147 }];

    for (let cords of xs) {
      let ambient = new WorldAmbientObject(this, cords.x, cords.y);
      this.pool.add(ambient);
      this.add.existing(ambient);
    }

    let ambient = new WorldAmbientObject(this, 289, 204);
    ambient.playFireAnim();
    ambient.scaleX = 0.5
    ambient.scaleY = 0.5
    this.pool.add(ambient);
    this.add.existing(ambient);

    this.player = new WorldPlayer(this, 304, 208, this.grid);
    this.pool.add(this.player);
    this.add.existing(this.player);

    this.game.scale.on('resize', (size: Phaser.GameObjects.Components.Size) => this.onWindowResize(size.width, size.height));

    this.onWindowResize(window.innerWidth, window.innerHeight);
  }

  update(): void {
    let wOffsetX = Math.floor(this.player.x/this.MAP_W);
    let wOffsetY = Math.floor(this.player.y/this.MAP_W);

    // camera management
    this.cameras.main.scrollX = this.player.x - this.cameras.main.displayWidth/2;
    this.cameras.main.scrollY = this.player.y - this.cameras.main.displayHeight/2;

    if (this.cameras.main.scrollX < wOffsetX * this.MAP_W) this.cameras.main.scrollX = wOffsetX * this.MAP_W
    if (this.cameras.main.scrollY < wOffsetY * this.MAP_W) this.cameras.main.scrollY = wOffsetY * this.MAP_W

    let cameraMaxX = (wOffsetX + 1) * this.MAP_W - this.cameras.main.displayWidth;
    let cameraMaxY = (wOffsetY + 1) * this.MAP_W - this.cameras.main.displayHeight;
    if (this.cameras.main.scrollX > cameraMaxX) this.cameras.main.scrollX = cameraMaxX
    if (this.cameras.main.scrollY > cameraMaxY) this.cameras.main.scrollY = cameraMaxY


    // ground and water management
    if (!this.prevWorldOffset || (this.prevWorldOffset.x != wOffsetX || this.prevWorldOffset.y != wOffsetY)) {
      this.prevWorldOffset = {x: wOffsetX, y: wOffsetY};

      let x = this.MAP_W * wOffsetX;
      let y = this.MAP_W * wOffsetY;

      // create water
      if (this.waterShader) { 
        // this.waterShader.destroy()
        this.waterShader.setChannel0(this.terrains[wOffsetY][wOffsetX], { 'magFilter': 'nearest', 'minFilter': 'nearest' });
        this.waterShader.x = x;
        this.waterShader.y = y;
      } else {
        this.waterShader = this.add.shader('chelnoque-water', x, y, this.MAP_W * 2, this.MAP_W * 2, ['water1']);
        this.waterShader.setChannel0(this.terrains[wOffsetY][wOffsetX], { 'magFilter': 'nearest', 'minFilter': 'nearest' });
        this.waterShader.scaleX = 0.5;
        this.waterShader.scaleY = 0.5;
        this.waterShader.setOrigin(0, 0)
      }
      let groundTexture = this.terrains[wOffsetY][wOffsetX].replace('water', 'terrain');
      // create ground
      if (this.groundImg) {
        this.groundImg.setTexture(groundTexture);
        this.groundImg.x = x;
        this.groundImg.y = y;
      } else {
        this.groundImg = this.add.image(x, y, groundTexture).setOrigin(0, 0);
      }
      this.groundImg.depth = -Number.MAX_VALUE;
      this.waterShader.depth = -Number.MAX_VALUE;
    }
  }

  private onWindowResize(w: number, h: number) {
    console.log('resize to : 1010, 600')
    this.cameras.main.setSize(1010, 600);

    if (w < 500) {
      this.cameras.main.zoom = 2;
    } else if (w <= 1280) {
      this.cameras.main.zoom = 2;
    } else {
      this.cameras.main.zoom = 2;
    }
    this.cameras.main.setOrigin(0, 0);
  }

  private loadMap() {
    this.mapImporter = new MapImporterModule(this, this.grid);
    this.mapImporter.grassHandler = (o: Phaser.GameObjects.Image, item: any) => {
      // let tile = this.grid.worldToGrid({ x: o.x, y: o.y - o.height / 2 });
      // o.depth = o.y - 24;
      
    };

    // this.mapImporter.enemyHandler = (p: Point, type: string) => {
    //   let tile = this.grid.worldToGrid(p)
    //   this.createEnemy(tile.i, tile.j, type);
    // }
    this.mapImporter.importMap(this.cache.json.get('map'));
  }
}