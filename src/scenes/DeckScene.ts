/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  gaminator 19
*/
import { AssetsLoader } from "../AssetsLoader";
import { AnimationRegistry } from "../AnimationRegistry";
import { FadeTransition } from "../FadeTransition";
import { DeckDisplay } from "../board/DeckDisplay";
import { BattleService } from "../board/BattleService";
import { CardDisplay } from "../board/CardDisplay";
import { PlayerBoardData } from "../types/Types";
import { Keybinds } from "../Keybinds";

export class DeckScene extends Phaser.Scene {
  private deck: DeckDisplay;
  private loot: DeckDisplay;
  private activeDeck: DeckDisplay;


  private transition: FadeTransition;
  private keybinds: Keybinds;
  private animationRegistry: AnimationRegistry;

  private battleService: BattleService;
  private player: PlayerBoardData;

  constructor() {
    super({
      key: "DeckScene"
    });
  }
 
  preload() {
    AssetsLoader.preload(this);
  }

  create() {
    this.animationRegistry = new AnimationRegistry(this);
    this.animationRegistry.initBoardAnimations();

    this.cameras.main.setBackgroundColor(0x1f1f1f);
    this.game.scale.on('resize', (size: Phaser.GameObjects.Components.Size) => this.onWindowResize(size.width, size.height));
    this.onWindowResize(window.innerWidth, window.innerHeight);

    this.transition = new FadeTransition(this, 0,0);
    this.add.existing(this.transition);
    this.transition.alphaTransition(1, 0, 0.01);

    this.events.on('wake', () => {
      this.transition.alphaTransition(1, 0, 0.1);
      this.repopulate();
    })
    this.keybinds = new Keybinds(this);
    this.battleService = new BattleService();
    this.player = this.battleService.makePlayerData();

    this.deck = new DeckDisplay(this);
    this.add.existing(this.deck);
    this.deck.x = 4;
    this.deck.y = 32;

    this.loot = new DeckDisplay(this);
    this.add.existing(this.loot);
    this.loot.x = 64;
    this.loot.y = 180;

    this.repopulate();
  }

  private repopulate() {
    this.deck.cleanup();
    // for (let card of this.player.deck) {
    //   if (card) {
    //     this.deck.addCard(new CardDisplay(this).populate(card));
    //   }
    // }
    for (let i = 0; i < 25; i++) {
      let card =  i < this.player.deck.length ? this.player.deck[i] : null
      this.deck.addCard(new CardDisplay(this).populate(card));
    }

    for (let i = 0; i < 10; i++) {
      this.loot.addCard(new CardDisplay(this).populate(null));
    }
    this.loot.putCursor(0);
    this.deck.putCursor(0)
    this.setActiveDeck(this.loot);
  }

  private end() {
    this.scene.sleep();
    this.scene.run("WorldScene");
  }

  private setActiveDeck(deck: DeckDisplay) {
    if (this.activeDeck) {
      this.activeDeck.setCursorHidden(true);
    }
    this.activeDeck = deck
    if (this.activeDeck) {
      this.activeDeck.setCursorHidden(false);
    }
  }
  update() {
    this.transition.update();

    this.loot.update();
    this.deck.update();

    if (this.keybinds.leftPressed) this.activeDeck.moveCursor(-1)
    if (this.keybinds.rightPressed) this.activeDeck.moveCursor(1)
    if (this.keybinds.downPressed) this.setActiveDeck(this.loot)
    if (this.keybinds.upPressed) this.setActiveDeck(this.deck)
    if (this.keybinds.enterPressed) this.moveCard();
  }

  private moveCard() {
    let fromDeck = this.activeDeck
    let toDeck = this.activeDeck == this.loot ? this.deck : this.loot;

    let toView = toDeck.getFreeView();
    let fromView = fromDeck.getCardAtCursor();

    if (!toView) {
      console.log('no free slot')
    } else if (!fromView.card)  {
      console.log('nothing to move')
    } else {
      toView.populate(fromView.card)
      fromView.populate(null);
    }
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