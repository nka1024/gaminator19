/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  gaminator 19
*/

import { Scene } from "phaser";
import { TerminalScreenID } from "./board/TerminalDisplay";

export class AnimationRegistry {
  constructor(private scene: Scene) {
  }

  public initBoardAnimations() {
    this.registerPlayerAnimations(this.scene);
    this.registerFxAnimations(this.scene);
    this.registerBoardUIAnimations(this.scene);
    this.registerTerminalScreenAnimations(this.scene);
  }

  public initWorldAnimations() {
    this.registerPlayerAnimations(this.scene);
    this.registerAmbientAnimations(this.scene);
    this.registerWorldUIAnimations(this.scene);
  }

  private registerAmbientAnimations(scene: Scene) {
    
    // Bubbles
    scene.anims.create({
      key: 'bubble1_anim',
      frames: scene.anims.generateFrameNumbers('bubble1_128x128', { start: 0, end: 34 }),
      frameRate: 7,
      repeat: 0,
      repeatDelay: 0,
      hideOnComplete: true
    });
    scene.anims.create({
      key: 'bubble2_anim',
      frames: scene.anims.generateFrameNumbers('bubble2_128x128', { start: 0, end: 24 }),
      frameRate: 7,
      repeat: 0,
      repeatDelay: 0,
      hideOnComplete: true
    });
    scene.anims.create({
      key: 'bubble3_anim',
      frames: scene.anims.generateFrameNumbers('bubble3_128x128', { start: 0, end: 32 }),
      frameRate: 7,
      repeat: 0,
      repeatDelay: 0,
      hideOnComplete: true
    });
    
    // Fire
    scene.anims.create({
      key: 'fire_anim',
      frames: scene.anims.generateFrameNumbers('fire_128x128', { start: 0, end: 4 }),
      frameRate: 4,
      repeat: -1,
      repeatDelay: 0,
      hideOnComplete: false
    });

    // Bamboo
    scene.anims.create({
      key: 'bamboo1_anim',
      frames: scene.anims.generateFrameNumbers('bamboo1_40x96', { start: 0, end: 15 }),
      frameRate: 4,
      repeat: -1,
      repeatDelay: 0.5,
      hideOnComplete: false,
    });
    scene.anims.create({
      key: 'bamboo2_anim',
      frames: scene.anims.generateFrameNumbers('bamboo2_31x128', { start: 0, end: 8 }),
      frameRate: 4,
      repeat: -1,
      repeatDelay: 0.4,
      hideOnComplete: false
    });
    scene.anims.create({
      key: 'bamboo3_anim',
      frames: scene.anims.generateFrameNumbers('bamboo3_32x128', { start: 0, end: 12 }),
      frameRate: 4,
      repeat: -1,
      repeatDelay: 0.3,
      hideOnComplete: false
    });
    scene.anims.create({
      key: 'bamboo4_anim',
      frames: scene.anims.generateFrameNumbers('bamboo4_39x128', { start: 0, end: 12 }),
      frameRate: 4,
      repeat: -1,
      repeatDelay: 0.2,
      hideOnComplete: false
    });
  }

  private registerPlayerAnimations(scene: Scene) {
    scene.anims.create({
      key: 'player_idle_back_anim',
      frames: scene.anims.generateFrameNumbers('player_idle_back_128x128', { start: 0, end: 4 }),
      frameRate: 5,
      repeat: -1,
      repeatDelay: 0,
    });
    scene.anims.create({
      key: 'player_idle_front_anim',
      frames: scene.anims.generateFrameNumbers('player_idle_front_128x128', { start: 0, end: 4 }),
      frameRate: 5,
      repeat: -1,
      repeatDelay: 0,
      hideOnComplete: false
    });
    scene.anims.create({
      key: 'player_idle_left_anim',
      frames: scene.anims.generateFrameNumbers('player_idle_left_128x128', { start: 0, end: 4 }),
      frameRate: 5,
      repeat: -1,
      repeatDelay: 0,
      hideOnComplete: false
    });
    scene.anims.create({
      key: 'player_idle_right_anim',
      frames: scene.anims.generateFrameNumbers('player_idle_right_128x128', { start: 0, end: 4 }),
      frameRate: 5,
      repeat: -1,
      repeatDelay: 0,
      hideOnComplete: false
    });
    scene.anims.create({
      key: 'player_walk_back_anim',
      frames: scene.anims.generateFrameNumbers('player_walk_back_128x128', { start: 0, end: 5 }),
      frameRate: 5,
      repeat: -1,
      repeatDelay: 0,
      hideOnComplete: false
    });
    scene.anims.create({
      key: 'player_walk_front_anim',
      frames: scene.anims.generateFrameNumbers('player_walk_front_128x128', { start: 0, end: 5 }),
      frameRate: 5,
      repeat: -1,
      repeatDelay: 0,
      hideOnComplete: false
    });
    scene.anims.create({
      key: 'player_walk_left_anim',
      frames: scene.anims.generateFrameNumbers('player_walk_left_128x128', { start: 0, end: 7 }),
      frameRate: 7,
      repeat: -1,
      repeatDelay: 0,
      hideOnComplete: false
    });
    scene.anims.create({
      key: 'player_walk_right_anim',
      frames: scene.anims.generateFrameNumbers('player_walk_right_128x128', { start: 0, end: 7 }),
      frameRate: 7,
      repeat: -1,
      repeatDelay: 0,
      hideOnComplete: false
    });
  }

  private registerFxAnimations(scene: Scene) {
    scene.anims.create({
      key: 'board_entrance1_anim',
      frames: scene.anims.generateFrameNumbers('board_entrance_anim_505x300', { start: 0, end: 24 }),
      frameRate: 10,
      repeat: 0,
      repeatDelay: 0,
      hideOnComplete: false
    });
    scene.anims.create({
      key: 'board_entrance2_anim',
      frames: scene.anims.generateFrameNumbers('board_entrance2_anim_505x300', { start: 0, end: 12 }),
      frameRate: 15,
      repeat: 0,
      repeatDelay: 0,
      hideOnComplete: true
    });

    scene.anims.create({
      key: 'attack_yellow_anim',
      frames: scene.anims.generateFrameNumbers('attack4_yellow_48x48', { start: 0, end: 14 }),
      frameRate: 23,
      repeat: 0,
      repeatDelay: 0,
      hideOnComplete: true
    });
    scene.anims.create({
      key: 'attack_blue_anim',
      frames: scene.anims.generateFrameNumbers('attack4_48x48', { start: 0, end: 14 }),
      frameRate: 23,
      repeat: 0,
      repeatDelay: 0,
      hideOnComplete: true
    });
    scene.anims.create({
      key: 'board_spawn_anim',
      frames: scene.anims.generateFrameNumbers('spawn_64x64', { start: 0, end: 11 }),
      frameRate: 12,
      repeat: 0,
      repeatDelay: 0,
      hideOnComplete: true
    });
    scene.anims.create({
      key: 'board_death_anim',
      frames: scene.anims.generateFrameNumbers('explode_67x58', { start: 0, end: 10 }),
      frameRate: 12,
      repeat: 0,
      repeatDelay: 0,
      hideOnComplete: true
    });
    scene.anims.create({
      key: 'link_up_anim',
      frames: scene.anims.generateFrameNumbers('link_up_64x64', { start: 0, end: 17 }),
      frameRate: 12,
      repeat: 0,
      repeatDelay: 0,
      hideOnComplete: true
    });
    scene.anims.create({
      key: 'attack_anim',
      frames: scene.anims.generateFrameNumbers('attack_anim_128x32', { start: 0, end: 6 }),
      frameRate: 20,
      repeat: 0,
      repeatDelay: 0,
      hideOnComplete: true
    });
  }

  private registerWorldUIAnimations(scene: Scene) {
    scene.anims.create({
      key: 'enter_key_anim',
      frames: scene.anims.generateFrameNumbers('enter_40x16',{ frames: [0, 1] }),
      frameRate: 2,
      repeat: -1,
      repeatDelay: 0,
      hideOnComplete: false
    });
    scene.anims.create({
      key: 'interact_anim',
      frames: scene.anims.generateFrameNumbers('interact_33x18',{ frames: [0, 1] }),
      frameRate: 2,
      repeat: -1,
      repeatDelay: 0,
      hideOnComplete: false
    });
  }

  private registerBoardUIAnimations(scene: Scene) {
    scene.anims.create({
      key: 'cursor_hand_anim',
      frames: scene.anims.generateFrameNumbers('cursor_hand_18x124',
        { frames: [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 7, 8] }),
      frameRate: 20,
      repeat: -1,
      repeatDelay: 0,
      hideOnComplete: false
    });
    scene.anims.create({
      key: 'spot_screen_anim',
      frames: scene.anims.generateFrameNumbers('screen_anim_48x48', { start: 0, end: 23 }),
      frameRate: 28,
      repeat: -1,
      repeatDelay: 2000,
      hideOnComplete: false
    });
    scene.anims.create({
      key: 'turn_current_anim',
      frames: scene.anims.generateFrameNumbers('turn_current_8x8', { start: 0, end: 1 }),
      frameRate: 2,
      repeat: -1,
      repeatDelay: 0,
      hideOnComplete: false
    });
    scene.anims.create({
      key: 'enemy_card_anim',
      frames: scene.anims.generateFrameNumbers('enemy_card_anim_13x15', { start: 0, end: 15 }),
      frameRate: 12,
      repeat: -1,
      repeatDelay: 0,
      hideOnComplete: false
    });
    scene.anims.create({
      key: 'cursor_spot_anim',
      frames: scene.anims.generateFrameNumbers('cursor_spot_68x70', { start: 0, end: 22 }),
      frameRate: 15,
      repeat: -1,
      repeatDelay: 0,
      hideOnComplete: false
    });
  }

  private registerTerminalScreenAnimations(scene: Scene) {
    scene.anims.create({
      key: TerminalScreenID.PRESS_ENTER_TO_START,
      frames: scene.anims.generateFrameNumbers('press_enter_to_start_178x60', { frames: [0, 1] }),
      frameRate: 2,
      repeat: -1,
      repeatDelay: 0,
      hideOnComplete: false
    });
    scene.anims.create({
      key: TerminalScreenID.HIDE_MODULE,
      frames: scene.anims.generateFrameNumbers('hide_module_link_178x64', { frames: [0, 1] }),
      frameRate: 2,
      repeat: -1,
      repeatDelay: 0,
      hideOnComplete: false
    });
    scene.anims.create({
      key: TerminalScreenID.SELECT_MODULE,
      frames: scene.anims.generateFrameNumbers('select_module_178x60', { frames: [0, 1] }),
      frameRate: 2,
      repeat: -1,
      repeatDelay: 0,
      hideOnComplete: false
    });
    scene.anims.create({
      key: TerminalScreenID.SELECT_LANE,
      frames: scene.anims.generateFrameNumbers('select_lane_178x60', { frames: [0, 1] }),
      frameRate: 2,
      repeat: -1,
      repeatDelay: 0,
      hideOnComplete: false
    });
    scene.anims.create({
      key: TerminalScreenID.UNABLE_TO_INSTALL,
      frames: scene.anims.generateFrameNumbers('unable_to_install_178x60', { frames: [0, 1] }),
      frameRate: 2,
      repeat: -1,
      repeatDelay: 0,
      hideOnComplete: false
    });
    scene.anims.create({
      key: TerminalScreenID.UNSIFFICIENT_LINK,
      frames: scene.anims.generateFrameNumbers('unsufficient_link_178x60', { frames: [0, 1] }),
      frameRate: 2,
      repeat: -1,
      repeatDelay: 0,
      hideOnComplete: false
    });
    scene.anims.create({
      key: TerminalScreenID.BATTLE_WON,
      frames: scene.anims.generateFrameNumbers('battle_won_178x64', { frames: [0, 1] }),
      frameRate: 2,
      repeat: -1,
      repeatDelay: 0,
      hideOnComplete: false
    });
    scene.anims.create({
      key: TerminalScreenID.BATTLE_LOST,
      frames: scene.anims.generateFrameNumbers('battle_lost_178x64', { frames: [0, 1] }),
      frameRate: 2,
      repeat: -1,
      repeatDelay: 0,
      hideOnComplete: false
    });

  }
  
}