/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  gaminator 19
*/

import { Scene } from "phaser";

export class AnimationRegistry {
  constructor(private scene: Scene) {
  }

  public initBoardAnimations() {
    this.registerPlayerAnimations(this.scene);
    this.registerFxAnimations(this.scene);
    this.registerBoardUIAnimations(this.scene);
  }

  public initWorldAnimations() {
    this.registerPlayerAnimations(this.scene);
    this.registerAmbientAnimations(this.scene);
    // 4 13
    // 3 13
    // 2 9
  }

  private registerAmbientAnimations(scene: Scene) {
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
    scene.anims.create({
      key: 'fire_anim',
      frames: scene.anims.generateFrameNumbers('fire_128x128', { start: 0, end: 4 }),
      frameRate: 4,
      repeat: -1,
      repeatDelay: 0,
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
      key: 'board_attack_anim',
      frames: scene.anims.generateFrameNumbers('attack_anim_128x32', { start: 0, end: 6 }),
      frameRate: 10,
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
      key: 'turn_current_anim',
      frames: scene.anims.generateFrameNumbers('turn_current_8x8', { start: 0, end: 1 }),
      frameRate: 2,
      repeat: -1,
      repeatDelay: 0,
      hideOnComplete: false
    });
  }

}