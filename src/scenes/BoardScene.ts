/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  gaminator 19
* @license      Apache 2.0
*/


import { AssetsLoader } from "../AssetsLoader";
import { PhaseDisplay } from "../board/TurnInfo";

export class BoardScene extends Phaser.Scene {


  constructor() {
    super({
      key: "BoardScene"
    });
    
  }

  preload() {
    AssetsLoader.preload(this);
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

  create(data): void {
    console.log('create')
    this.cameras.main.setBackgroundColor(0x1f1f1f);

    this.add.image(0, 0, "battle_bg").setOrigin(0,0);;
    
    this.addObjects()
    this.game.scale.on('resize', (size: Phaser.GameObjects.Components.Size) => this.onWindowResize(size.width, size.height));
    this.onWindowResize(window.innerWidth, window.innerHeight);

  }

  private addObjects() {
    let phaseInfo = new PhaseDisplay(this)
    phaseInfo.x = 60;
    phaseInfo.y = 254;
    this.add.existing(phaseInfo);

    let instructions = this.add.image(136,284, "instructions");
    instructions.setOrigin(0,0)
  
  }

  update(): void {
    
  }

 
}
