/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  gaminator 19
* @license      Apache 2.0
*/


import { AssetsLoader } from "../AssetsLoader";
import { PhaseDisplay } from "../board/PhaseDisplay";
import { PlayerDisplay } from "../board/PlayerDisplay";
import { CardDisplay } from "../board/CardDisplay";
import { HandDisplay } from "../board/HandDisplay";
import { Keybinds } from "../Keybinds";
import { CardDetailsDisplay } from "../board/CardDetailsDisplay";
import { BoardSpotsContainer } from "../board/BoardSpotsContainer";
import { BattleService } from "../board/BattleService";
import { BattleController, BattleControllerEvent } from "../board/BattleController";
import { AnimationRegistry } from "../AnimationRegistry";
import { FadeTransition } from "../FadeTransition";
import { ScrollingImage } from "../board/ScrollingImage";
import { TerminalDisplay } from "../board/TerminalDisplay";
import { CardData, BoardData } from "../types/Types";
import { Animations } from "phaser";
import { CONST } from "../const/const";

export class BoardScene extends Phaser.Scene {

  private entranceLinkAnim: Phaser.GameObjects.Sprite;
  private entranceRevealAnim: Phaser.GameObjects.Sprite;

  private spots: BoardSpotsContainer;
  private hand: HandDisplay;
  private playerDisplay: PlayerDisplay;
  private opponentDisplay: PlayerDisplay;
  private phaseDisplay: PhaseDisplay;
  private terminalDisplay: TerminalDisplay;
  private cardDetails: CardDetailsDisplay;
  private battleService: BattleService;
  private controller: BattleController;
  private keybinds: Keybinds;

  private boxShadow: Phaser.GameObjects.Image;
  private stripesTop: ScrollingImage;
  private stripesBottom: ScrollingImage;
  private codeA: ScrollingImage;
  private codeB: ScrollingImage;
  private codeC: ScrollingImage;

  private transition: FadeTransition;

  private animationRegistry: AnimationRegistry;

  private combatLoopAudio: Phaser.Sound.BaseSound;
  private victoryAudio: Phaser.Sound.BaseSound;
  private defeatAudio: Phaser.Sound.BaseSound;
  private connectAudio: Phaser.Sound.BaseSound;
  private connectAudio2: Phaser.Sound.BaseSound;
  private connectAudio3: Phaser.Sound.BaseSound;
  private selectAudio: Phaser.Sound.BaseSound;
  private selectAudio2: Phaser.Sound.BaseSound;
  private spawnAudio: Phaser.Sound.BaseSound;
  private damage1Audio: Phaser.Sound.BaseSound;
  private damage2Audio: Phaser.Sound.BaseSound;
  private linkUpAudio: Phaser.Sound.BaseSound;
  private healModuleAudio: Phaser.Sound.BaseSound;
  private healCoreAudio: Phaser.Sound.BaseSound;
  private buffAudio: Phaser.Sound.BaseSound;
  private errAudio: Phaser.Sound.BaseSound;
  private moduleDeathAudio: Phaser.Sound.BaseSound;
  private moduleDrawAudio: Phaser.Sound.BaseSound;

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
    if (this.cameras && this.cameras.main) {
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

  create(boardData: BoardData): void {
    this.combatLoopAudio = this.sound.add('combat_loop', { loop: true, volume: 0.35 });
    this.victoryAudio = this.sound.add('victory_audio', { loop: false, volume: 0.5 });
    this.defeatAudio = this.sound.add('defeat_audio', { loop: false, volume: 0.35 });
    this.connectAudio = this.sound.add('connect', { loop: false, volume: 0.3 });
    this.connectAudio2 = this.sound.add('connect2', { loop: false, volume: 0.3 });
    this.connectAudio3 = this.sound.add('connect3', { loop: false, volume: 0.3 });
    this.selectAudio = this.sound.add('select_blip', { loop: false, volume: 0.3 });
    this.selectAudio2 = this.sound.add('select_blop', { loop: false, volume: 0.3 });
    this.spawnAudio = this.sound.add('spawn_whoosh', { loop: false, volume: 0.5 });
    this.damage1Audio = this.sound.add('damage1_shuh', { loop: false, volume: 0.4 });
    this.damage2Audio = this.sound.add('damage2_shuh', { loop: false, volume: 0.4 });
    this.linkUpAudio = this.sound.add('linkup_wurl', { loop: false, volume: 0.4 });
    this.healCoreAudio = this.sound.add('heal_swir', { loop: false, volume: 0.5 });
    this.healModuleAudio = this.sound.add('heal_swir', { loop: false, volume: 0.5 });
    this.buffAudio = this.sound.add('buff_brlrl', { loop: false, volume: 0.3 });
    this.errAudio = this.sound.add('err_skwii', { loop: false, volume: 0.4 });
    this.moduleDrawAudio = this.sound.add('card_draw_plick', { loop: false, volume: 0.3 });
    this.moduleDeathAudio = this.sound.add('card_death_frfr', { loop: false, volume: 0.3 });
    
    
    this.animationRegistry = new AnimationRegistry(this);
    this.animationRegistry.initBoardAnimations();

    this.cameras.main.setBackgroundColor(0x1f1f1f);

    this.add.image(0, 0, "battle_bg").setOrigin(0, 0);

    this.addDisplays()
    this.addKeybinds();

    this.initBattle(boardData);
    this.game.scale.on('resize', (size: Phaser.GameObjects.Components.Size) => this.onWindowResize(size.width, size.height));
    this.onWindowResize(window.innerWidth, window.innerHeight);

    this.transition = new FadeTransition(this, 0, 0);
    this.add.existing(this.transition);

    this.events.on('wake', (sys, boardData: BoardData) => {
      this.hand.cleanup();
      this.spots.cleanup();
      this.initBattle(boardData);
      this.onEnter();
    })

    this.entranceLinkAnim = new Phaser.GameObjects.Sprite(this, 0, 0, 'board_entrance1_anim');
    this.add.existing(this.entranceLinkAnim)
    this.entranceLinkAnim.setOrigin(0, 0);
    this.entranceLinkAnim.depth = Number.MAX_VALUE;
    this.entranceLinkAnim.visible = false;
    this.entranceLinkAnim.on('animationcomplete', (anim: Animations.Animation, frame: Animations.AnimationFrame) => {
      this.entranceLinkAnim.visible = false;
      this.entranceRevealAnim.visible = true;
      this.entranceRevealAnim.play('board_entrance2_anim');
      this.transition.alphaTransition(1, 0, 0.01);
    });

    this.entranceRevealAnim = new Phaser.GameObjects.Sprite(this, 0, 0, 'board_entrance2_anim');
    this.add.existing(this.entranceRevealAnim)
    this.entranceRevealAnim.setOrigin(0, 0)
    this.entranceRevealAnim.depth = Number.MAX_VALUE;
    this.entranceRevealAnim.visible = false;

    this.onEnter();
  }

  private onEnter() {
    this.hand.visible = true;
    this.opponentDisplay.visible = true;
    this.playerDisplay.visible = true;
    // this.cardDetails.visible = true;
    if (!CONST.DEV) {
      this.connectAudio2.play();
      this.time.addEvent({
        delay: 1300,
        callback: () => {
          this.connectAudio.play();
        },
        callbackScope: this,
        loop: false,
        paused: false
      });
      this.time.addEvent({
        delay: 2800,
        callback: () => {
          this.connectAudio3.play();
        },
        callbackScope: this,
        loop: false,
        paused: false
      });
      this.combatLoopAudio.play();

      this.entranceLinkAnim.visible = true;
      this.transition.alphaTransition(1, 0, 0.1);
      this.entranceLinkAnim.play('board_entrance1_anim');
    } else {
      this.transition.alphaTransition(1, 0, 1);
    }
  }

  private initBattle(boardData: BoardData) {
    this.battleService = new BattleService();

    this.controller = new BattleController(this, this.keybinds, this.playerDisplay, this.opponentDisplay, this.phaseDisplay, this.terminalDisplay, this.spots, this.hand, this.cardDetails, boardData);
    this.controller.start();
    this.controller.events.on(BattleControllerEvent.BATTLE_END, (result: string) => {
      this.time.removeAllEvents();
      if (result == 'win') {
        this.transition.alphaTransition(0, 1, 0.1, () => {
          this.scene.sleep();
          this.scene.run("DeckScene", boardData.loot);
          this.combatLoopAudio.pause();
        });
      } else {
        this.scene.sleep();
        this.scene.run("WorldScene", {won: false});
        this.combatLoopAudio.pause();
      }
    });
    this.controller.events.on(BattleControllerEvent.CORE_DAMAGE, () => {
      Math.random()> 0.5? this.damage1Audio.play() : this.damage2Audio.play();
    })
    this.controller.events.on(BattleControllerEvent.CORE_HEAL, () => {
      this.healCoreAudio.play();
    });
    this.controller.events.on(BattleControllerEvent.MODULE_DAMAGE, () => {
      Math.random()> 0.5? this.damage1Audio.play() : this.damage2Audio.play();
    })
    this.controller.events.on(BattleControllerEvent.MODULE_HEAL, () => {
      this.healModuleAudio.play();
    });
    this.controller.events.on(BattleControllerEvent.MODULE_BUFF, () => {
      this.buffAudio.play();
    });
    this.controller.events.on(BattleControllerEvent.LINK_UP, () => {
      this.linkUpAudio.play();
    });
    this.controller.events.on(BattleControllerEvent.ERROR, () => {
      this.errAudio.play();
    });
    this.controller.events.on(BattleControllerEvent.MODULE_DEATH, () => {
      this.moduleDeathAudio.play();
    });
    this.controller.events.on(BattleControllerEvent.MODULE_DRAW, () => {
      this.moduleDrawAudio.play();
    });
    this.controller.events.on(BattleControllerEvent.PLAYER_LOST, () => {
      this.time.addEvent({
        delay: 700,
        callback: () => {
          this.defeatAudio.play();
         } ,
        callbackScope: this,
        loop: false,
        paused: false
      });
    });
    this.controller.events.on(BattleControllerEvent.PLAYER_WON, () => {
      this.time.addEvent({
        delay: 700,
        callback: () => {
          this.victoryAudio.play();
         } ,
        callbackScope: this,
        loop: false,
        paused: false
      });
    });
  }

  private addDisplays() {
    this.stripesTop = new ScrollingImage(this, 0, 14);
    this.stripesTop.configure(-0.5, 0, 'stripes_1_endless_bg');
    this.stripesTop.alpha = 0.05;
    this.add.existing(this.stripesTop);

    this.stripesBottom = new ScrollingImage(this, 0, 250);
    this.stripesBottom.configure(0.5, 0, 'stripes_2_endless_bg');
    this.stripesBottom.alpha = 0.05;
    this.add.existing(this.stripesBottom);

    this.codeA = new ScrollingImage(this, -5, 0);
    this.codeA.configure(0, 0.5, 'code_endless_bg', true);
    this.codeA.alpha = 0.05;
    this.add.existing(this.codeA);

    this.codeB = new ScrollingImage(this, 186, 0);
    this.codeB.configure(0, -0.5, 'code_endless_bg', true);
    this.codeB.alpha = 0.05;
    this.add.existing(this.codeB);

    this.codeC = new ScrollingImage(this, 388, 0);
    this.codeC.configure(0, 0.5, 'code_endless_bg', true);
    this.codeC.alpha = 0.05;
    this.add.existing(this.codeC);

    let spotsBackground = this.add.image(25, 0, 'spots_background');
    spotsBackground.alpha = 0.8
    spotsBackground.setOrigin(0, 0)

    this.boxShadow = new Phaser.GameObjects.Image(this, 0, 0, 'pixel_box_shadow_505x300');
    this.boxShadow.setOrigin(0, 0);
    this.add.existing(this.boxShadow)

    this.phaseDisplay = new PhaseDisplay(this)
    this.phaseDisplay.x = 430;
    this.phaseDisplay.y = 18;
    this.add.existing(this.phaseDisplay);

    this.terminalDisplay = new TerminalDisplay(this)
    this.terminalDisplay.x = 250;
    this.terminalDisplay.y = 18;
    this.add.existing(this.terminalDisplay);

    this.playerDisplay = new PlayerDisplay(this)
    this.playerDisplay.x = 206;
    this.playerDisplay.y = 261;
    this.add.existing(this.playerDisplay);

    this.opponentDisplay = new PlayerDisplay(this)
    this.opponentDisplay.x = 174;
    this.opponentDisplay.y = 37;
    this.add.existing(this.opponentDisplay);

    let instructions = this.add.image(270, 288, 'tutorial_combat');
    instructions.setOrigin(0, 0);

    this.cardDetails = new CardDetailsDisplay(this);
    this.add.existing(this.cardDetails)
    this.cardDetails.x = 330;
    this.cardDetails.y = 78;
    this.cardDetails.visible = false;

    this.hand = new HandDisplay(this);
    this.add.existing(this.hand);
    this.hand.x = 328;
    this.hand.y = 144;

    this.hand.events.on('card_select', (card: CardDisplay) => {
      this.selectAudio.play();
      if (card) {
        this.cardDetails.visible = true;
        this.cardDetails.populate(card.card);
      } else {
        this.cardDetails.visible = false;
      }
    })


    this.hand.putCursor(0);

    this.spots = new BoardSpotsContainer(this);
    this.add.existing(this.spots);
    this.spots.events.on('spot_select', (card: CardData) => {
      this.selectAudio2.play();
      if (card) {
        this.cardDetails.visible = true;
        this.cardDetails.populate(card);
      } else {
        let view = this.hand.cardAtCursor();
        if (view && view.card) {
          this.cardDetails.populate(view.card);
        }
      }
    })
    this.spots.events.on('spot_populated', (card: CardData) => {
      if (card != null) {
        this.spawnAudio.play();
      }
    });
  }

  private addKeybinds() {
    this.keybinds = new Keybinds(this);
  }

  update(): void {
    this.hand.update();
    this.controller.update();

    this.stripesTop.update();
    this.stripesBottom.update();
    this.codeA.update();
    this.codeB.update();
    this.codeC.update();
    this.terminalDisplay.update();
    // update camera effects
    if (this.transition)
      this.transition.update();
  }

}
