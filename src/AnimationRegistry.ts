/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  gaminator 19
*/

import { Scene } from "phaser";

export class AnimationRegistry {
  constructor(scene: Scene) {
    this.registerPlayerAnimations(scene);
    this.registerFxAnimations(scene);
    this.registerBoardUIAnimations(scene);
  }

  private registerPlayerAnimations(scene: Scene) {
    scene.anims.create({
      key: 'player_idle_back_anim',
      frames: scene.anims.generateFrameNumbers('idle_back_128x128', { start: 0, end: 4 }),
      frameRate: 5,
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