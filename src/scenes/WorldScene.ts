/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  Tecnho Nomads: gameplay prototype
*/

import { AssetsLoader } from "../AssetsLoader";
import { Keybinds } from "../Keybinds";
import { AnimationRegistry } from "../AnimationRegistry";
import { WorldPlayer } from "../world/WorldPlayer";
import { WorldAmbientObject } from "../world/WorldAmbientObject";

export class WorldScene extends Phaser.Scene {

  private MAP_W: number = 512;

  private player: WorldPlayer;
  private animationRegistry: AnimationRegistry;

  private pool: Phaser.GameObjects.Group;
  private waters = [
    ["water1", "water2"],
    ["water3", "water4"]];
  private grounds = [
    ["ground1", "ground2"],
    ["ground3", "ground4"]];

  constructor() {
    super({
      key: "WorldScene"
    });
  }

  preload() {
    AssetsLoader.preload(this);
  }

  create(data): void {

    this.cameras.main.setBackgroundColor(0x1f1f1f);
    this.animationRegistry = new AnimationRegistry(this);
    this.animationRegistry.initWorldAnimations();

    this.pool = this.add.group();
    this.pool.runChildUpdate = true;

    for (let i = 0; i < 1; i++) {
      for (let j = 0; j < 1; j++) {
        let x = this.MAP_W * j;
        let y = this.MAP_W * i;
        var shader = this.add.shader('chelnoque-water', x, y, this.MAP_W * 2, this.MAP_W * 2, ['water1']);
        shader.scaleX = 0.5;
        shader.scaleY = 0.5;
        shader.setChannel0(this.waters[i][j], { 'magFilter': 'nearest', 'minFilter': 'nearest' });
        shader.setOrigin(0, 0)
        this.add.image(x, y, this.grounds[i][j]).setOrigin(0, 0);
        console.log('place at ' + x + ':' + y);
      }
    }

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


    this.player = new WorldPlayer(this, 326, 156);
    this.pool.add(this.player);
    this.add.existing(this.player);

    this.game.scale.on('resize', (size: Phaser.GameObjects.Components.Size) => this.onWindowResize(size.width, size.height));

    this.onWindowResize(window.innerWidth, window.innerHeight);
  }

  update(): void {
    this.cameras.main.scrollX = this.player.x - this.cameras.main.displayWidth/2;
    this.cameras.main.scrollY = this.player.y - this.cameras.main.displayHeight/2;

    if (this.cameras.main.scrollX < 0) this.cameras.main.scrollX = 0
    if (this.cameras.main.scrollY < 0) this.cameras.main.scrollY = 0

    let cameraMaxX = this.MAP_W - this.cameras.main.displayWidth;
    let cameraMaxY = this.MAP_W - this.cameras.main.displayHeight;
    if (this.cameras.main.scrollX > cameraMaxX) this.cameras.main.scrollX = cameraMaxX
    if (this.cameras.main.scrollY > cameraMaxY) this.cameras.main.scrollY = cameraMaxY
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
}