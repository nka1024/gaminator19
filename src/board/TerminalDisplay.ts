/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  gaminator 19
*/

import { Scene, GameObjects } from "phaser";

export enum TerminalScreenID {
  PRESS_ENTER_TO_START = 'terminal_press_enter_to_start_anim',
  HIDE_MODULE = 'terminal_hide_module_anim',    
  SELECT_LANE = 'terminal_select_lane_anim',         
  SELECT_MODULE = 'terminal_select_module_anim',       
  UNABLE_TO_INSTALL = 'terminal_unable_to_install_anim',   
  UNSIFFICIENT_LINK = 'terminal_unsufficient_link_anim'
}

export class TerminalDisplay extends Phaser.GameObjects.Container {

  private headerImage: Phaser.GameObjects.Image;
  private screen: Phaser.GameObjects.Sprite;

  private currentScreen: TerminalScreenID;

  constructor(scene: Scene) {
    super(scene, 0, 0);

    this.headerImage = new Phaser.GameObjects.Image(scene, -3, -17, 'debug_terminal_header_bg');
    this.headerImage.setOrigin(0, 0);
    this.add(this.headerImage);

    this.screen = new Phaser.GameObjects.Sprite(scene, -3, -17, '');
    this.screen.setOrigin(0, 0);
    scene.add.existing(this.screen);
    this.add(this.screen);
    this.hide();
  }

  public setScreen(screen: TerminalScreenID) {
    this.currentScreen = screen;
    this.screen.play(screen);
    this.screen.visible = true;
  }

  public hide() {
    this.screen.visible = false;
  }
}