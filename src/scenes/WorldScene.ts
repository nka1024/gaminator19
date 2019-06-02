/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  gaminator 19
*/

import { AssetsLoader } from "../AssetsLoader";
import { AnimationRegistry } from "../AnimationRegistry";
import { WorldPlayer } from "../world/WorldPlayer";
import { WorldAmbientObject } from "../world/WorldAmbientObject";
import { Point } from "../types/Types";
import { TileGrid } from "../TileGrid";
import { MapImporterModule, MapObjetctData, MapTriggerData, MapTriggerType } from "../modules/scene/MapImporterModule";
import { FadeTransition } from "../FadeTransition";
import { DialogView } from "../DialogView";
import { Triggers } from "../world/Triggers";
import { BoxShadowOverlay } from "../BoxShadowOverlay";
import { Story, StoryEvent } from "../Story";
import { CONST } from "../const/const";
import { Encounters, EncounterName } from "../Encounters";
import { BattleService } from "../board/BattleService";
import { DebugPanel } from "../windows/DebugPanel";
import { WindowManager } from "../windows/WindowManager";
import { PlayerDisplay } from "../board/PlayerDisplay";
import { Dialogs } from "../Dialogs";

export class WorldScene extends Phaser.Scene {

  private prevWorldOffset: Point = null;
  private MAP_W: number = 1024;

  private debugPanel: DebugPanel;

  private groundImg: Phaser.GameObjects.Image;
  private waterShader: Phaser.GameObjects.Shader;

  private grid: TileGrid;
  private triggers: Triggers
  private mapImporter: MapImporterModule;

  private battleService: BattleService;
  private player: WorldPlayer;
  private animationRegistry: AnimationRegistry;
  private dialog: DialogView;
  private story: Story;
  private encounters: Encounters;

  private location2Opened: boolean = false;

  private enterKey: Phaser.Input.Keyboard.Key;
  private interactAnim: Phaser.GameObjects.Sprite;

  private transition: FadeTransition;
  private pool: Phaser.GameObjects.Group;
  private terrains = [
    ["water_01", "water_02", "water_03", "water_04"],
    ["water_05", "water_06", "water_07", "water_08"],
    ["water_09", "water_10", "water_11", "water_12"],
    ["water_13", "water_14", "water_15", "water_16"]];

  private mainThemeAudio: Phaser.Sound.BaseSound;

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

    WindowManager.initialize();
    this.debugPanel = new DebugPanel(this);
    this.debugPanel.show();

    this.animationRegistry = new AnimationRegistry(this);
    this.animationRegistry.initWorldAnimations();

    this.pool = this.add.group();
    this.pool.runChildUpdate = true;
    this.setupTriggers();
    this.grid = new TileGrid(this);
    this.loadMap();

    this.player = new WorldPlayer(this, 3200, 224, this.grid);
    // this.player.x = 20; // start of first location
    // this.player.y = 195;
    // this.player.x = 984; // next to passage to second location
    // this.player.y = 376;
    // this.player.x = 430; // next to data cache 1
    // this.player.y = 452;
    // this.player.x = 1448; // next to sphere
    // this.player.y = 504;
    
    this.pool.add(this.player);
    this.add.existing(this.player);

    this.game.scale.on('resize', (size: Phaser.GameObjects.Components.Size) => this.onWindowResize(size.width, size.height));

    this.onWindowResize(window.innerWidth, window.innerHeight);

    this.interactAnim = new Phaser.GameObjects.Sprite(this, 0, 0, '');
    this.interactAnim.play('interact_anim')
    this.interactAnim.visible = false;
    this.add.existing(this.interactAnim);
    this.interactAnim.depth = Number.MAX_VALUE - 1

    this.transition = new FadeTransition(this, 0, 0);
    this.add.existing(this.transition);
    this.transition.depth = Number.MAX_VALUE;

    this.dialog = new DialogView(this, 0, 0);
    this.add.existing(this.dialog);
    this.pool.add(this.dialog);
    this.dialog.visible = false;
    this.player.dialog = this.dialog;

    this.battleService = new BattleService();

    this.story = new Story(this);
    this.story.setDialogView(this.dialog)
    this.story.events.on(StoryEvent.BattleStart, () => {
      this.startBattle(this.encounters.currentEncounter.name);
    })
    this.story.events.on(StoryEvent.SphereDefeat, () => {
      this.player.x = 430; 
      this.player.y = 452;
    })
    this.story.events.on(StoryEvent.GameOver, () => {
      this.gameOver();
    })
    this.story.events.on(StoryEvent.EndDialog, () => {
      this.story.endDialog();
    })
    this.story.events.on(StoryEvent.PlatformTravel, () => {
      this.onStoryPlatformTravel();
    })
    this.story.events.on(StoryEvent.ConditionalBattleStart, () => {
      if (this.encounters.isEncounterAllowed(this.encounters.currentEncounter.name)) {
        this.startBattle(this.encounters.currentEncounter.name);
      } else {
        this.encounters.deniedEncounterDialog(this.encounters.currentEncounter.name);
      }
    })
    this.story.events.on(StoryEvent.RetreiveProtocols, () => {
      this.encounters.encounterByName(EncounterName.DEAD_TECHNICIAN).deny = false;
    })
    this.story.events.on(StoryEvent.CrystalActivation, () => {
      if (this.encounters.encounterByName(EncounterName.DEAD_TECHNICIAN).defeated) {
        this.story.startDialog(Dialogs.crystaActivation);
      }
    })
    this.story.events.on(StoryEvent.GrantAccessToLocation2, () => {
      this.location2Opened = true;
      this.interactAnim.visible = false;
    })

    this.encounters = new Encounters(this.story);

    let boxShadow = new BoxShadowOverlay(this);
    this.add.existing(boxShadow)
    this.pool.add(boxShadow)

    this.events.on('wake', (sys, data: object) => {
      this.onEnter();

      this.player.stopMovement();
      this.story.eventFinished();
      if (this.triggers.currentTrigger)
        this.encounters.endEncounter(this.triggers.currentTrigger.name, data['won']);
    })
    this.mainThemeAudio = this.sound.add('main_theme', { loop: true, volume: 0.5 });

    this.onEnter();

    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.enterKey.on('down', (key, event) => {
      // event.stopPropagation() was used
      if (event.cancelled == -1) {
        return;
      }
      if (
        this.interactAnim.visible &&
        this.triggers.currentTrigger &&
        !this.dialog.visible &&
        !this.transition.playing
      ) {
        if (this.triggers.currentTrigger.type == MapTriggerType.Repeatable) {
          if (this.triggers.currentTrigger.name == EncounterName.CRYSTAL) {
            this.story.startDialog(Dialogs.crystalDefault);
          } else {
            this.encounters.startEncounter(this.triggers.currentTrigger.name);
          }
        }
      }
    });
  }

  private setupTriggers() {
    this.triggers = new Triggers();
    this.triggers.events.on('no_trigger', () => {
      this.interactAnim.visible = false;
    });
    this.triggers.events.on('enter_trigger', (trigger: MapTriggerData) => {
      console.log('stepped on trigger: ' + trigger.name);

      let interactXY = this.encounters.checkInteractXY(trigger.name);
      if (interactXY) {
        this.interactAnim.x = interactXY.x;
        this.interactAnim.y = interactXY.y;
        this.interactAnim.visible = true;
      }

      if (trigger.name == EncounterName.CRYSTAL) {
        if (!this.location2Opened) {
          this.interactAnim.x = 862;
          this.interactAnim.y = 548;
          this.interactAnim.visible = true;
        }
      }
      else if (trigger.name == 'access_location_2') {
        if (!this.location2Opened) {
          this.player.x -= 16
          this.story.startDialog(Dialogs.access_location_2_forbidden);
        }
      } else if (trigger.name == 'location2_death')  {
        this.gameOver();
      }

    })
  }

  private onEnter() {
    if (!CONST.DEV) {
      this.mainThemeAudio.play();
      this.transition.alphaTransition(1, 0, 0.01);
    } else {
      this.transition.alphaTransition(1, 0, 0.5);
    }
  }

  update(): void {
    let wOffsetX = Math.floor(this.player.x / this.MAP_W);
    let wOffsetY = Math.floor(this.player.y / this.MAP_W);

    // camera management
    this.cameras.main.scrollX = this.player.x - this.cameras.main.displayWidth / 2;
    this.cameras.main.scrollY = this.player.y - this.cameras.main.displayHeight / 2;

    if (this.cameras.main.scrollX < wOffsetX * this.MAP_W) this.cameras.main.scrollX = wOffsetX * this.MAP_W
    if (this.cameras.main.scrollY < wOffsetY * this.MAP_W) this.cameras.main.scrollY = wOffsetY * this.MAP_W

    let cameraMaxX = (wOffsetX + 1) * this.MAP_W - this.cameras.main.displayWidth;
    let cameraMaxY = (wOffsetY + 1) * this.MAP_W - this.cameras.main.displayHeight;
    if (this.cameras.main.scrollX > cameraMaxX) this.cameras.main.scrollX = cameraMaxX
    if (this.cameras.main.scrollY > cameraMaxY) this.cameras.main.scrollY = cameraMaxY


    // ground and water management
    if (!this.prevWorldOffset || (this.prevWorldOffset.x != wOffsetX || this.prevWorldOffset.y != wOffsetY)) {
      this.prevWorldOffset = { x: wOffsetX, y: wOffsetY };

      let x = this.MAP_W * wOffsetX;
      let y = this.MAP_W * wOffsetY;

      // create water
      if (this.waterShader) {
        this.waterShader.setChannel0(this.terrains[wOffsetY][wOffsetX], { 'magFilter': 'nearest', 'minFilter': 'nearest' });
        this.waterShader.x = x;
        this.waterShader.y = y;
      } else {
        this.waterShader = this.add.shader('chelnoque-water', x, y, this.MAP_W * 2, this.MAP_W * 2, ['water1']);
        this.waterShader.setChannel0(this.terrains[wOffsetY][wOffsetX], { 'magFilter': 'nearest', 'minFilter': 'nearest' });
        this.waterShader.scaleX = 0.5;
        this.waterShader.scaleY = 0.5;
        this.waterShader.setOrigin(0, 0)
      }
      let groundTexture = this.terrains[wOffsetY][wOffsetX].replace('water', 'terrain');
      // create ground
      if (this.groundImg) {
        this.groundImg.setTexture(groundTexture);
        this.groundImg.x = x;
        this.groundImg.y = y;
      } else {
        this.groundImg = this.add.image(x, y, groundTexture).setOrigin(0, 0);
      }
      this.groundImg.depth = -Number.MAX_VALUE;
      this.waterShader.depth = -Number.MAX_VALUE;
    }

    // update camera effects
    if (this.transition)
      this.transition.update();

    this.triggers.checkTrigger(this.grid.worldToGrid({ x: this.player.x, y: this.player.y }));
  }

  private startBattle(encounter: EncounterName) {
    this.transition.alphaTransition(0, 1, 0.05, () => {
      this.player.stopMovement();
      this.scene.sleep();
      this.scene.run("BoardScene", this.battleService.makeBoardData(encounter));
      this.mainThemeAudio.pause();
    });
  }

  private gameOver() {
    this.transition.alphaTransition(0, 1, 0.02, () => {
      this.player.stopMovement();
      this.scene.sleep();
      this.scene.run("IntroScene", { win: true });
      // this.mainThemeAudio.pause();
    });
  }

  private onStoryPlatformTravel() {
    this.transition.alphaTransition(0, 1, 0.1, () => {
      this.player.x = 20;
      this.player.y = 195;
      this.transition.alphaTransition(1, 0, 0.025)
    })
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

  private loadMap() {
    this.mapImporter = new MapImporterModule(this, this.grid);
    this.mapImporter.grassHandler = (o: Phaser.GameObjects.Image, item: any) => {

    };

    this.mapImporter.triggerHandler = (o: MapTriggerData) => {
      console.log('new trigger: ' + o);
      this.triggers.add(o);
    };
    this.mapImporter.ambientHandler = (o: MapObjetctData) => {
      if (o.texture == 'ambient_1') {
        let ambient = new WorldAmbientObject(this, o.x, o.y);
        this.add.existing(ambient);
        this.pool.add(ambient);
        ambient.depth = o.depth;
      } else if (o.texture == 'ambient_3') {
        let ambient = new WorldAmbientObject(this, o.x, o.y);
        ambient.y -= 6
        ambient.playFireAnim();
        // ambient.scaleX = 0.5
        // ambient.scaleY = 0.5
        ambient.depth = o.depth + 6;
        this.add.existing(ambient);
        this.pool.add(ambient);
      } else if (o.texture == 'ambient_2') {
        let ambient = new WorldAmbientObject(this, o.x, o.y - 50);
        ambient.playBambooAnim();
        ambient.depth = o.depth;

        this.add.existing(ambient);
        this.pool.add(ambient);
      }
    };

    this.mapImporter.importMap(this.cache.json.get('map'));
  }
}