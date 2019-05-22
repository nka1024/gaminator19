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
import { CardData, CardType, CardEffectType, CardSkillType } from "../types/Types";
import { HandDisplay } from "../board/HandDisplay";
import { Keybinds, KeybindType } from "../Keybinds";
import { CardDetailsDisplay } from "../board/CardDetailsDisplay";
import { BoardSpotsContainer } from "../board/BoardSpotsContainer";
import { Scene } from "phaser";
import { BattleService } from "../board/BattleService";
import { BattleController } from "../board/BattleController";
import { AnimationRegistry } from "../AnimationRegistry";
import { FadeTransition } from "../FadeTransition";

export class BoardScene extends Phaser.Scene {

  private spots: BoardSpotsContainer;
  private hand: HandDisplay;
  private playerDisplay: PlayerDisplay;
  private opponentDisplay: PlayerDisplay;
  private phaseDisplay: PhaseDisplay;
  private cardDetails: CardDetailsDisplay;
  private battleService: BattleService;
  private battleController: BattleController;
  private keybinds: Keybinds;

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
    this.transition.alphaTransition(1, 0, 0.005);

    this.events.on('wake', () => {
      this.transition.alphaTransition(1, 0, 0.1);
      this.hand.cleanup();
      this.spots.cleanup();
      this.initBattle();
    })
  }

  private initBattle() {
    this.battleService = new BattleService();
    this.battleController = new BattleController(this, this.keybinds, this.playerDisplay, this.opponentDisplay, this.phaseDisplay, this.spots, this.hand, this.cardDetails, this.battleService.makeBoardData());
    this.battleController.start();
    this.battleController.events.on('battle_end', () => {
      this.transition.alphaTransition(0, 1, 0.1, () => {
        this.scene.sleep();
        this.scene.run("DeckScene");
      });
    });
  }

  private addDisplays() {
    this.phaseDisplay = new PhaseDisplay(this)
    this.phaseDisplay.x = 60;
    this.phaseDisplay.y = 244;
    this.add.existing(this.phaseDisplay);

    this.playerDisplay = new PlayerDisplay(this)
    this.playerDisplay.x = 192;
    this.playerDisplay.y = 194;
    this.add.existing(this.playerDisplay);

    this.opponentDisplay = new PlayerDisplay(this)
    this.opponentDisplay.x = 194;
    this.opponentDisplay.y = 7;
    this.add.existing(this.opponentDisplay);

    let instructions = this.add.image(136, 284, "instructions");
    instructions.setOrigin(0, 0)

    let platforms = this.add.image(83, 100, "platforms");
    platforms.setOrigin(0, 0)

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
        this.cardDetails.populate(card.card);
      } else {
        this.cardDetails.visible = false;
      }
    })
    this.hand.putCursor(0);

    this.spots = new BoardSpotsContainer(this);
    this.add.existing(this.spots);
  }

  private addKeybinds() {
    this.keybinds = new Keybinds(this);
  }

  update(): void {
    this.hand.update();
    this.battleController.update();
    
    // update camera effects
    if (this.transition)
      this.transition.update();
  }
 
}
