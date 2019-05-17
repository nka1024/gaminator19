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

export class BoardScene extends Phaser.Scene {

  private spots: BoardSpotsContainer;
  private hand: HandDisplay;
  private cardDetails: CardDetailsDisplay;

  private keybinds: Keybinds;

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

  create(data): void {
    console.log('create')
    this.cameras.main.setBackgroundColor(0x1f1f1f);

    this.add.image(0, 0, "battle_bg").setOrigin(0,0);
    
    this.addObjects()
    this.addKeybinds();
    this.game.scale.on('resize', (size: Phaser.GameObjects.Components.Size) => this.onWindowResize(size.width, size.height));
    this.onWindowResize(window.innerWidth, window.innerHeight);
  }

  private addObjects() {
    let phaseDisplay = new PhaseDisplay(this)
    phaseDisplay.x = 60;
    phaseDisplay.y = 254;
    this.add.existing(phaseDisplay);

    let playerDisplay = new PlayerDisplay(this)
    playerDisplay.x = 192;
    playerDisplay.y = 194;
    this.add.existing(playerDisplay);

    let instructions = this.add.image(136,284, "instructions");
    instructions.setOrigin(0, 0)

    let platforms = this.add.image(83, 100, "platforms");
    platforms.setOrigin(0, 0)

    let card1: CardData = {
      type: CardType.CREATURE,
      name: 'Doogie',
      skill: CardSkillType.BUFF_ALLIES_1_1,
      attack: 1,
      hp: 1,
      link: 1
    }
  
    let card2: CardData = {
      type: CardType.CREATURE,
      name: 'Snuk-chak',
      attack: 1,
      hp: 1,
      link: 1
    }

    this.cardDetails = new CardDetailsDisplay(this);
    this.add.existing(this.cardDetails)
    this.cardDetails.x = 330;
    this.cardDetails.y = 78;

    this.hand = new HandDisplay(this);
    this.add.existing(this.hand);
    this.hand.x = 328;
    this.hand.y = 144;
    this.hand.addCard(new CardDisplay(this).populate(card1))
    this.hand.addCard(new CardDisplay(this).populate(card2))

    this.hand.events.on('card_select', (card: CardDisplay) => {
      this.cardDetails.populate(card.card);
    })
    this.hand.putCursor(0);

    this.spots = new BoardSpotsContainer(this);
    this.add.existing(this.spots);
  }

  private addKeybinds() {
    this.keybinds = new Keybinds(this);
    this.keybinds.events.on('keypress', (key: string, type: KeybindType) => {
      if (key == 'left') this.hand.moveCursor(-1) 
      if (key == 'right') this.hand.moveCursor(1)
      
      if (key == 'left') this.spots.moveCursor(-1) 
      if (key == 'right') this.spots.moveCursor(1)
    });
  }

  update(): void {
    this.hand.update();
  }
 
}
