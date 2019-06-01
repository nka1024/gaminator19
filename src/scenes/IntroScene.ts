/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  gaminator 19
*/

import { AssetsLoader } from "../AssetsLoader";
import { FadeTransition } from "../FadeTransition";
import { CONST } from "../const/const";

export class IntroScene extends Phaser.Scene {
  private transition: FadeTransition;
  private enterKey: Phaser.Input.Keyboard.Key;
  private spaceKey: Phaser.Input.Keyboard.Key;
  private canSkip: boolean = false;

  private logo1: Phaser.GameObjects.Image;
  private logo2: Phaser.GameObjects.Image;

  private gameOver1: Phaser.GameObjects.Image;

  constructor() {
    super({
      key: "IntroScene"
    });
  }

  preload() {
    AssetsLoader.preload(this);
  }

  create(data: object): void {
    this.cameras.main.setBackgroundColor(0x1f1f1f);

    this.events.on('wake', (sys, data: object) => { this.onWakeup(data) })

    this.transition = new FadeTransition(this, 0, 0);
    this.add.existing(this.transition);
    this.transition.depth = Number.MAX_VALUE;


    this.logo1 = new Phaser.GameObjects.Image(this, 0, 0, 'gaminator_logo_1_505x300');
    this.logo1.setOrigin(0, 0);
    this.add.existing(this.logo1)

    this.logo2 = new Phaser.GameObjects.Image(this, 0, 0, 'gaminator_logo_2_505x300');
    this.logo2.setOrigin(0, 0);
    this.logo2.alpha = 0;
    this.add.existing(this.logo2)

    this.gameOver1 = new Phaser.GameObjects.Image(this, 0, 0, 'game_over_1_505x300');
    this.gameOver1.setOrigin(0, 0);
    this.gameOver1.visible = false;
    this.add.existing(this.gameOver1)

    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.enterKey.on('down', (key, event) => { this.onInput() })
    this.spaceKey.on('down', (key, event) => { this.onInput() })

    this.onWakeup(data);

    this.game.scale.on('resize', (size: Phaser.GameObjects.Components.Size) => this.onWindowResize(size.width, size.height));

    this.onWindowResize(window.innerWidth, window.innerHeight);
  }

  private onInput() {
    if (this.canSkip) {
      this.scene.sleep();
      this.scene.run("WorldScene");
    }
  }

  private onWakeup(data: object) {
    if (!CONST.DEV) {
      // this.mainThemeAudio.play();
      this.transition.alphaTransition(1, 0, 0.005);
    } else {
      this.transition.alphaTransition(1, 0, 0.5);
    }

    this.canSkip = false;

    if (data && data['death']) {
      this.logo1.visible = false;
      this.logo2.visible = false;
      this.gameOver1.visible = true;
    } else {
      this.time.addEvent({
        delay: 2000,
        callback: () => {
          this.canSkip = true
          this.tweens.add({
            targets: this.logo2,
            alpha: 1,
            duration: 1000,
            ease: 'Elastic',
            easeParams: [0.5, 0.5],
            delay: 0
          });
        },
        callbackScope: this,
        loop: false,
        paused: false
      });
    }
  }

  update() {
    this.transition.update();
  }

  private onWindowResize(w: number, h: number) {
    if (this.cameras && this.cameras.main) {
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

}