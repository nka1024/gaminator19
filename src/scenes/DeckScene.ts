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
import { PlayerBoardData, CardData } from "../types/Types";
import { Keybinds } from "../Keybinds";
import { CardDetailsDisplay } from "../board/CardDetailsDisplay";
import { CONST } from "../const/const";

export class DeckScene extends Phaser.Scene {
  private deck: DeckDisplay;
  private loot: DeckDisplay;
  private activeDeck: DeckDisplay;
  private cardDetails: CardDetailsDisplay;

  private transition: FadeTransition;
  private keybinds: Keybinds;
  private animationRegistry: AnimationRegistry;

  private combatLoopAudio: Phaser.Sound.BaseSound;

  // private battleService: BattleService;
  // private player: PlayerBoardData;

  private imgRemoveModule: Phaser.GameObjects.Image;
  private imgAddModule: Phaser.GameObjects.Image;
  private lootCards: CardData[] = [];

  constructor() {
    super({
      key: "DeckScene"
    });
  }
 
  preload() {
    AssetsLoader.preload(this);
  }

  create(loot: CardData[]) {
    this.combatLoopAudio = this.sound.add('combat_loop', { loop: true, volume: 0.35 });

    this.lootCards = loot;
    this.animationRegistry = new AnimationRegistry(this);
    this.animationRegistry.initBoardAnimations();

    this.cameras.main.setBackgroundColor(0x000000);
    this.game.scale.on('resize', (size: Phaser.GameObjects.Components.Size) => this.onWindowResize(size.width, size.height));
    this.onWindowResize(window.innerWidth, window.innerHeight);

    let bg = new Phaser.GameObjects.Image(this, 0,0,'deck_background_505x300');
    bg.alpha = 0.5
    bg.setOrigin(0,0)
    this.add.existing(bg)

    let instructions = new Phaser.GameObjects.Image(this, 0,0,'tutorial_deck_230x11');
    instructions.x = this.cameras.main.displayWidth - 2
    instructions.y = this.cameras.main.displayHeight - 2
    instructions.setOrigin(1,1)
    this.add.existing(instructions)

    let currentDeck = new Phaser.GameObjects.Image(this, 66,6,'new_deck');
    currentDeck.setOrigin(0,0)
    this.add.existing(currentDeck);

    let newDeck = new Phaser.GameObjects.Image(this, 66,152,'current_deck');
    newDeck.setOrigin(0,0)
    this.add.existing(newDeck);

    this.transition = new FadeTransition(this, 0,0);
    this.add.existing(this.transition);

    this.events.on('wake', (sys, lootCards: CardData[]) => {
     this.onAwaken(lootCards);
    })
    this.keybinds = new Keybinds(this);

    this.deck = new DeckDisplay(this);
    this.add.existing(this.deck);
    this.deck.x = 4;
    this.deck.y = 32;

    this.loot = new DeckDisplay(this);
    this.add.existing(this.loot);
    this.loot.x = 64;
    this.loot.y = 180;

    this.cardDetails = new CardDetailsDisplay(this);
    this.add.existing(this.cardDetails)
    this.cardDetails.x = 330;
    this.cardDetails.y = 200;
    this.cardDetails.visible = false;
    this.deck.events.on('card_select', this.onCardSelect.bind(this))
    this.loot.events.on('card_select', this.onCardSelect.bind(this))

    this.imgAddModule = new Phaser.GameObjects.Image(this, 445, 160, 'add_module_100x20');
    this.imgRemoveModule = new Phaser.GameObjects.Image(this, 445, 160, 'remove_module_100x20');
    this.add.existing(this.imgAddModule);
    this.add.existing(this.imgRemoveModule);
    this.imgAddModule.visible = true
    this.imgAddModule.visible = false

    this.onAwaken(loot);
  }

  private onAwaken(loot: CardData[]) {
    this.lootCards = loot;
    this.transition.alphaTransition(1, 0, 0.1);
    this.repopulate();
    if (!CONST.DEV) {
      this.combatLoopAudio.play();
    }
  }

  private onCardSelect(card: CardDisplay) {
      if (card.card) {
        this.cardDetails.visible = true;
        this.cardDetails.populate(card.card);
      } else {
        this.cardDetails.visible = false;
      }
  }

  private repopulate() {
    this.deck.cleanup();
    this.loot.cleanup();

    for (let i = 0; i < 25; i++) {
      let card =  i < BattleService.playerDeck.length ? BattleService.playerDeck[i] : null
      this.deck.addCard(new CardDisplay(this).populate(card));
    }

    for (let i = 0; i < 10; i++) {
      let card =  i < this.lootCards.length ? this.lootCards[i] : null
      this.loot.addCard(new CardDisplay(this).populate(card));
    }
    this.loot.putCursor(0);
    this.deck.putCursor(0);
    this.setActiveDeck(this.loot);
  }

  private end() {
    BattleService.playerDeck = this.deck.getAllCardData();
    this.combatLoopAudio.stop();
    this.scene.sleep();
    this.scene.run("WorldScene", {won: true});
  }

  private setActiveDeck(deck: DeckDisplay) {
    if (this.activeDeck) {
      this.activeDeck.setCursorHidden(true);
    }
    this.activeDeck = deck
    if (this.activeDeck) {
      this.activeDeck.setCursorHidden(false);
      this.activeDeck.putCursor(this.activeDeck.cursorPos)
    }

    this.imgAddModule.visible = this.activeDeck == this.loot
    this.imgRemoveModule.visible = this.activeDeck == this.deck
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
    if (this.keybinds.escPressed) this.end();
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
      this.cardDetails.visible = false;
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