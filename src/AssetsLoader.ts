/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  gaminator 19
* @license      Apache 2.0
*/

import { CONST } from "./const/const";

export let ASSETS = {
  TERRAIN_MAX: 11,
  GRASS_MAX: 6,
  HOUSE_MAX: 8,
}

export class AssetsLoader {
  public static preload(scene: Phaser.Scene) {
    scene.load.json("map", "./assets/map.json");
 
    scene.load.glsl('bundle', 'assets/shaders/chelnoque-water.glsl');
    scene.load.image("water", "./assets/gaminator/water.png");
    scene.load.image("ground", "./assets/gaminator/ground.png");

    scene.load.image("add_heart", "./assets/board/add_heart.png");
    scene.load.image("add_sword", "./assets/board/add_sword.png");
    scene.load.image("battle_bg", "./assets/board/battle_bg.png");
    scene.load.image("card_frame", "./assets/board/card_frame.png");
    scene.load.image("cursor_hand", "./assets/board/cursor_hand.png");
    scene.load.image("cursor_spot", "./assets/board/cursor_spot.png");
    scene.load.image("spot_shadow", "./assets/board/spot_shadow.png");
    scene.load.image("icon_heart", "./assets/board/icon_heart.png");
    scene.load.image("icon_link", "./assets/board/icon_link.png");
    scene.load.image("icon_sword", "./assets/board/icon_sword.png");
    scene.load.image("protected", "./assets/board/protected.png");
    scene.load.image("instructions", "./assets/board/instructions.png");
    scene.load.image("platforms", "./assets/board/platforms.png");
    scene.load.image("player_data", "./assets/board/player_data.png");
    scene.load.image("trait_boost_atk_hp", "./assets/board/trait_boost_atk_hp.png");
    scene.load.image("turn_current", "./assets/board/turn_current.png");
    scene.load.image("turn_done", "./assets/board/turn_done.png");
    scene.load.image("turn_name_commands", "./assets/board/turn_name_commands.png");
    scene.load.image("turn_name_load", "./assets/board/turn_name_load.png");
    scene.load.image("turn_name_opponent", "./assets/board/turn_name_opponent.png");
    scene.load.image("turn_name_protect", "./assets/board/turn_name_protect.png");
    
    scene.load.image("card_mask", "./assets/board/card_mask.png");
    scene.load.image("creature_snakey", "./assets/board/creatures/snakey.png");
    scene.load.image("creature_doogie", "./assets/board/creatures/doogie.png");

    scene.load.image("grid_128_50", "./assets/grid_128_a50.png");
    scene.load.image("grid_128_30", "./assets/grid_128_a50.png");
    scene.load.image("path_end_14x14", "./assets/path_end_14x14.png");
    scene.load.image("path_mid_14x14", "./assets/path_mid_14x14.png");
    scene.load.spritesheet('fog_tilemap', './assets/fog_tile_32_a70.png', {frameWidth: 32, frameHeight: 32});
    scene.load.image("grid_tile_green_16_a50", "./assets/grid_tile_green_16_a50.png");
    scene.load.image("grid_tile_yellow_16_a50", "./assets/grid_tile_yellow_16_a50.png");
    scene.load.image("grid_tile_red_16_a50", "./assets/grid_tile_red_16_a50.png");
    scene.load.image("cursor", "./assets/cursor.png");
    scene.load.image("cursor_grid_32x32", "./assets/cursor_grid_32x32.png");
    scene.load.image("cursor_grid_2x_32x32", "./assets/cursor_grid_2x_32x32.png");
    scene.load.image("target_select_36x36", "./assets/target_select_36x36.png");
    scene.load.image("target_select_40x40", "./assets/target_select_40x40.png");

    scene.load.image("progress_yellow_50x2", "./assets/progress_yellow_50x2.png");
    scene.load.image("progress_black_52x4", "./assets/progress_black_52x4.png");

    scene.load.image("progress_green_32x2", "./assets/progress_green_32x2.png");
    scene.load.image("progress_black_34x4", "./assets/progress_black_34x4.png");

    scene.load.image("bullet_blue", "./assets/bullet_blue.png");
    scene.load.image("bullet_yellow", "./assets/bullet_yellow.png");

    scene.load.bitmapFont('hello-world-16-white',
      './assets/fonts/hello-world/hello-world-16-white.png',
      './assets/fonts/hello-world/hello-world-16.fnt');
    scene.load.bitmapFont('hello-world-16-shadow',
      './assets/fonts/hello-world/hello-world-16-shadow.png',
      './assets/fonts/hello-world/hello-world-16.fnt');

    scene.load.bitmapFont('coco-8-white',
      './assets/fonts/coco/coco-8-white.png',
      './assets/fonts/coco/coco-8.fnt');
    scene.load.bitmapFont('coco-8-shadow',
      './assets/fonts/coco/coco-8-shadow.png',
      './assets/fonts/coco/coco-8.fnt');
    scene.load.bitmapFont('coco-8-red',
      './assets/fonts/coco/coco-8-red.png',
      './assets/fonts/coco/coco-8.fnt');

    scene.load.bitmapFont('coco-8-yellow',
      './assets/fonts/coco/coco-8-yellow.png',
      './assets/fonts/coco/coco-8.fnt');

      scene.load.bitmapFont('coco-8-green',
      './assets/fonts/coco/coco-8-green.png',
      './assets/fonts/coco/coco-8.fnt');

    scene.load.spritesheet('mothership_48x48', './assets/sprites/mothership_48x48.png', {
      frameWidth: 48,
      frameHeight: 48,
      endFrame: 7
    });
    
    scene.load.spritesheet('mothership_128x128', './assets/sprites/mothership_128x128.png', {
      frameWidth: 128,
      frameHeight: 128,
      endFrame: 7
    });

    scene.load.spritesheet('k10_idle_anim_48x48', './assets/sprites/k10_idle_anim_48x48.png', {
      frameWidth: 48,
      frameHeight: 48,
      endFrame: 7
    });

    scene.load.spritesheet('k11_idle_anim_48x48', './assets/sprites/k11_idle_anim_48x48.png', {
      frameWidth: 48,
      frameHeight: 48,
      endFrame: 7
    });

    scene.load.spritesheet('explosion_anim_1_48x48', './assets/sprites/explosion_anim_1_48x48.png', {
      frameWidth: 48,
      frameHeight: 48,
      endFrame: 6
    });

    scene.load.spritesheet('explosion_anim_2_48x48', './assets/sprites/explosion_anim_2_48x48.png', {
      frameWidth: 48,
      frameHeight: 48,
      endFrame: 7
    });

    scene.load.spritesheet('explosion_anim_3_48x48', './assets/sprites/explosion_anim_3_48x48.png', {
      frameWidth: 48,
      frameHeight: 48,
      endFrame: 10
    });

    scene.load.spritesheet('explosion_anim_3_24x24', './assets/sprites/explosion_anim_3_24x24.png', {
      frameWidth: 24,
      frameHeight: 24,
      endFrame: 10
    });

    scene.load.spritesheet('gatherer_gather_anim_48x48', './assets/sprites/gatherer_gather_anim_48x48.png', {
      frameWidth: 48,
      frameHeight: 48,
      endFrame: 10
    });

    scene.load.spritesheet('gatherer_walk_anim_48x48', './assets/sprites/gatherer_walk_anim_48x48.png', {
      frameWidth: 48,
      frameHeight: 48,
      endFrame: 5
    });

    scene.load.spritesheet('builder_walk_anim_48x48', './assets/sprites/builder_walk_anim_48x48.png', {
      frameWidth: 48,
      frameHeight: 48,
      endFrame: 5
    });
    
    scene.load.spritesheet('builder_build_anim_48x48', './assets/sprites/builder_build_anim_48x48.png', {
      frameWidth: 48,
      frameHeight: 48,
      endFrame: 7
    });

    scene.load.spritesheet('sentry_idle_anim_48x48', './assets/sprites/sentry_idle_anim_48x48.png', {
      frameWidth: 48,
      frameHeight: 48,
      endFrame: 8 
    });

    scene.load.spritesheet('guardian_anim_48x48', './assets/sprites/guardian_anim_48x48.png', {
      frameWidth: 48,
      frameHeight: 48,
      endFrame: 5
    });

    scene.load.spritesheet('tower_anim_90x90', './assets/sprites/tower_anim_90x90.png', {
      frameWidth: 90,
      frameHeight: 90,
      endFrame: 5
    });

    scene.load.spritesheet('boss_anim_100x100', './assets/sprites/boss_anim_100x100.png', {
      frameWidth: 100,
      frameHeight: 100,
      endFrame: 7
    });
    scene.load.spritesheet('reactor_anim_48x48', './assets/sprites/reactor_anim_48x48.png', {
      frameWidth: 48,
      frameHeight: 48,
      endFrame: 4
    });

    scene.load.image("terrain_12", "./assets/tilemap/terrain_12.png");
    // for (let idx = 0; idx <= ASSETS.TERRAIN_MAX; idx++) {
    //   scene.load.image("terrain_" + idx, "./assets/tilemap/terrain_" + idx + ".png");
    // }
    for (let idx = 1; idx <= ASSETS.GRASS_MAX; idx++) {
      scene.load.image("grass_" + idx, "./assets/tilemap/grass_" + idx + ".png");
    }
    for (let idx = 1; idx <= ASSETS.HOUSE_MAX; idx++) {
      scene.load.image("house_" + idx, "./assets/tilemap/house_" + idx + ".png");
    }
    for (let idx = 1; idx <= 4; idx++) {
      scene.load.image("actor_" + idx, "./assets/tilemap/actor_" + idx + ".png");
    }
  }
}