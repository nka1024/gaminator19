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
import { BattleController } from "../board/BattleController";
import { AnimationRegistry } from "../AnimationRegistry";
import { FadeTransition } from "../FadeTransition";
import { ScrollingImage } from "../board/ScrollingImage";
import { TerminalDisplay } from "../board/TerminalDisplay";
import { CardData } from "../types/Types";
import { Animations } from "phaser";

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
  private battleController: BattleController;
  private keybinds: Keybinds;

  private boxShadow: Phaser.GameObjects.Image;
  private stripesTop: ScrollingImage;
  private stripesBottom: ScrollingImage;
  private codeA: ScrollingImage;
  private codeB: ScrollingImage;
  private codeC: ScrollingImage;

  private transition: FadeTransition;

  private animationRegistry: AnimationRegistry;

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
      } else  {
        this.cameras.main.zoom = 2;
      }
      this.cameras.main.setOrigin(0,0);
    }
  }

  create(data): void {
    console.log('create')
    this.animationRegistry = new AnimationRegistry(this);
    this.animationRegistry.initBoardAnimations();
    
    this.cameras.main.setBackgroundColor(0x1f1f1f);

    this.add.image(0, 0, "battle_bg").setOrigin(0,0);
    
    this.addDisplays()
    this.addKeybinds();

    this.initBattle();
    this.game.scale.on('resize', (size: Phaser.GameObjects.Components.Size) => this.onWindowResize(size.width, size.height));
    this.onWindowResize(window.innerWidth, window.innerHeight);

    this.transition = new FadeTransition(this, 0,0);
    this.add.existing(this.transition);

    this.events.on('wake', () => {
      this.hand.cleanup();
      this.spots.cleanup();
      this.initBattle();
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
    this.entranceLinkAnim.visible = true;
    this.transition.alphaTransition(1, 0, 0.1);
    this.entranceLinkAnim.play('board_entrance1_anim');
  }

  private initBattle() {
    this.battleService = new BattleService();
    this.battleController = new BattleController(this, this.keybinds, this.playerDisplay, this.opponentDisplay, this.phaseDisplay, this.terminalDisplay, this.spots, this.hand, this.cardDetails, this.battleService.makeBoardData());
    this.battleController.start();
    this.battleController.events.on('battle_end', () => {
      this.transition.alphaTransition(0, 1, 0.1, () => {
        this.scene.sleep();
        this.scene.run("DeckScene", this.battleService.makeLootCards());
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
      if (card) {
        this.cardDetails.visible = true;
        this.cardDetails.populate(card);
      } else {
        // this.cardDetails.visible = true;
        let view = this.hand.cardAtCursor();
        if (view && view.card) {
          this.cardDetails.populate(view.card);
        }
        // this.cardDetails.visible = false;
      }
    })
  }

  private addKeybinds() {
    this.keybinds = new Keybinds(this);
  }

  update(): void {
    this.hand.update();
    this.battleController.update();
    
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
