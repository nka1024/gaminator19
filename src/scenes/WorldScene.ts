/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  Tecnho Nomads: gameplay prototype
*/

import { AssetsLoader } from "../AssetsLoader";
import { Keybinds } from "../Keybinds";

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

    var shader = this.add.shader('chelnoque-water', 0, 0, 1024, 1024, [ 'water' ]);
    shader.setChannel0('water', {'magFilter': 'nearest', 'minFilter': 'nearest'});
    this.add.image(0, 0, "ground").setOrigin(0,0);
    this.game.scale.on('resize', (size: Phaser.GameObjects.Components.Size) => this.onWindowResize(size.width, size.height));
    
    this.onWindowResize(window.innerWidth, window.innerHeight);
    
    let keybinds: Keybinds = new Keybinds(this);
    keybinds.events.on('keypress', (key, keytype) => {
      if (key == 'right') {
        this.cameras.main.scrollX+=1
      }
      if (key == 'left') {
        this.cameras.main.scrollX-=1
      }
      if (key == 'up') {
        this.cameras.main.scrollY-=1
      }
      if (key == 'down') {
        this.cameras.main.scrollY+=1
      }
    })
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