/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  Tecnho Nomads: gameplay prototype
*/

import { AssetsLoader } from "../AssetsLoader";

export class WorldScene extends Phaser.Scene {
  constructor() {
    super({
      key: "WorldScene"
    });
  }
  preload() {
    AssetsLoader.preload(this);
  }

  create(data): void {
    console.log('create')
    this.cameras.main.setBackgroundColor(0x1f1f1f);

    var shader = this.add.shader('helloworld', 0, 0, 1024, 1024, [ 'water' ]);
    shader.setChannel0('water', {'magFilter': 'nearest', 'minFilter': 'nearest'});
    // shader.scaleX = 2;
    // shader.scaleY = 2;
    this.add.image(0, 0, "ground").setOrigin(0,0);
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
    } else  {
      this.cameras.main.zoom = 2;
    }
    this.cameras.main.setOrigin(0,0);
  }
}