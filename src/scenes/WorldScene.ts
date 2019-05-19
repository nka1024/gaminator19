/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  Tecnho Nomads: gameplay prototype
*/

import { AssetsLoader } from "../AssetsLoader";
import { Keybinds } from "../Keybinds";
import { AnimationRegistry } from "../AnimationRegistry";
import { WorldPlayer } from "../world/WorldPlayer";

export class WorldScene extends Phaser.Scene {

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
        let x = 512 * j;
        let y = 512 * i;
        var shader = this.add.shader('chelnoque-water', x, y, 1024, 1024, ['water1'] );
        // shader.setUniform('size', '8.0')
        shader.scaleX = 0.5;
        shader.scaleY = 0.5;
        shader.setChannel0(this.waters[i][j], { 'magFilter': 'nearest', 'minFilter': 'nearest' });
        shader.setOrigin(0,0)
        this.add.image(x, y, this.grounds[i][j]).setOrigin(0, 0);
        console.log('place at ' + x + ':' + y);
      }
    }

    this.player = new WorldPlayer(this, 200, 200);
    this.pool.add(this.player);
    this.add.existing(this.player);

    this.game.scale.on('resize', (size: Phaser.GameObjects.Components.Size) => this.onWindowResize(size.width, size.height));

    this.onWindowResize(window.innerWidth, window.innerHeight);
  }

  update(): void {
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