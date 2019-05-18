/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  gaminator
*/

import { Keybinds } from "../Keybinds";
import { BoardSpotsContainer } from "./BoardSpotsContainer";
import { HandDisplay } from "./HandDisplay";
import { BoardData, BoardPhase, PhaseType, CardData } from "../types/Types";
import { CardDetailsDisplay } from "./CardDetailsDisplay";
import { CardDisplay } from "./CardDisplay";
import { PlayerDisplay } from "./PlayerDisplay";
import { PhaseDisplay } from "./PhaseDisplay";

type TMPData = {
  selectedCard?: CardData;
  protectedCard?: CardData;
  compileFinished?: boolean;
}

export class BattleController {

  private timers: Array<Phaser.Time.TimerEvent> = []

  private phase: BoardPhase = BoardPhase.PREPARE;
  private tmp: TMPData = {};

  constructor(
    private scene: Phaser.Scene,
    private keybinds: Keybinds,
    private player: PlayerDisplay,
    private turn: PhaseDisplay,
    private spots: BoardSpotsContainer,
    private hand: HandDisplay,
    private details: CardDetailsDisplay,
    private board: BoardData) {

    // let timer = this.scene.time.addEvent({
    //   delay: weaponData.chargeInterval,
    //   callback: () => this.onWeaponChargeComplete(weaponData),
    //   callbackScope: this,
    //   loop: true,
    //   paused: false
    // });
    // this.timers.push(timer);

    // this.keybinds.events.on('keypress', (key: string, type: KeybindType) => {
    //   if (this.hand.inputEnabled) {
    //     if (key == 'left') this.hand.moveCursor(-1) 
    //     if (key == 'right') this.hand.moveCursor(1)
    //     if (key == 'enter') this.hand.
    //   }
    //   if (key == 'left') this.spots.moveCursor(-1) 
    //   if (key == 'right') this.spots.moveCursor(1)
    // });
  }


  public start() {
    this.board.phase = BoardPhase.PREPARE;
  }

  public update() {
    switch (this.board.phase) {
      case BoardPhase.PREPARE: this.phasePrepare(); return
      case BoardPhase.PLAYER_DRAW: this.phasePlayerDraw(); return
      case BoardPhase.PLAYER_COMMAND: this.phasePlayerCommand(); return
      case BoardPhase.PLAYER_PROTECT: this.phasePlayerProtect(); return
      case BoardPhase.PLAYER_COMPILE: this.phasePlayerCompile(); return
      case BoardPhase.OPPONENT_DRAW: this.phaseOpponentDraw(); return
      case BoardPhase.OPPONENT_COMMAND: this.phaseOpponentCommand(); return
      case BoardPhase.OPPONENT_PROTECT: this.phaseOpponentProtect(); return
      case BoardPhase.OPPONENT_COMPILE: this.phasePlayerCompile(); return
    }
  }

  //
  // PREPARE
  //
  private phasePrepare() {
    if (this.phaseStarted()) {
      console.log('battle begins');
    }
    if (this.keybinds.enterPressed) {
      this.nextPhase();
    }
  }

  //
  // PLAYER DRAW
  //
  private phasePlayerDraw() {
    if (this.phaseStarted()) {
      console.log('вrawing player cards');

      // draw card
      for (let i = 0; i < 3; i++) {
        let card = this.board.player.deck.shift()
        this.board.player.hand.push(card);
        this.hand.addCard(new CardDisplay(this.scene).populate(card))
      }
      // increase & refill mana
      this.board.player.linkMax++
      this.board.player.link = this.board.player.linkMax

      console.log('press enter to confirm your initial hand');
    }

    if (this.keybinds.enterPressed) {
      console.log('hand is confirmed');
      this.nextPhase();
    }
  }

  //
  // PLAYER COMMAND
  //
  private phasePlayerCommand() {
    if (this.phaseStarted()) {
      console.log('Select card to command');
      this.hand.setCursorHidden(false)
      this.hand.putCursor(0);
      this.details.visible = true;
    }

    if (this.tmp.selectedCard) {
      if (this.keybinds.leftPressed) this.spots.moveCursor(-1)
      if (this.keybinds.rightPressed) this.spots.moveCursor(1)
      if (this.keybinds.enterPressed) {
        let card = this.tmp.selectedCard
        // put hard on board
        this.spots.putCardAtCursor(card);
        this.board.player.board[this.spots.getCursorCol()] = card;
        this.tmp.selectedCard = null;
        this.spots.setCursorHidden(true);
        // remove card from hand
        this.board.player.hand.splice(this.board.player.hand.indexOf(card), 1);
        this.hand.removeCardAtCursor();
      }
      if (this.keybinds.escPressed) {
        this.tmp.selectedCard = null;
        this.spots.setCursorHidden(true);
      }
    } else {
      if (this.keybinds.leftPressed) this.hand.moveCursor(-1)
      if (this.keybinds.rightPressed) this.hand.moveCursor(1)
      if (this.keybinds.enterPressed) {
        // activate spot cursor for selected card
        this.tmp.selectedCard = this.board.player.hand[this.hand.cursorPos];
        this.spots.putCursor(1, 1);
        this.spots.setCursorHidden(false);
      }
      if (this.keybinds.escPressed) {
        this.hand.setCursorHidden(true);
        this.details.visible = true;
        this.nextPhase();
      }
    }
  }

  //
  // PLAYER PROTECT
  //
  private phasePlayerProtect() {
    if (this.phaseStarted()) {
      console.log('select protected card');
      this.spots.putCursor(1, 1);
    }

    if (this.keybinds.leftPressed) this.spots.moveCursor(-1)
    if (this.keybinds.rightPressed) this.spots.moveCursor(1)
    if (this.keybinds.enterPressed) {
      let card = this.spots.getCardAtCursor() ;

      if (this.tmp.protectedCard) {
        if (this.tmp.protectedCard != card) {
          this.tmp.protectedCard.protected = false;
        }
      }
      if (card) {
        card.protected = !card.protected;
      }
      this.tmp.protectedCard = this.spots.getCardAtCursor();
      this.spots.refresh();
    }
    if (this.keybinds.escPressed) {
      this.spots.setCursorHidden(true);
      this.nextPhase();
    }
  }

  //
  // PLAYER COMPILE
  //
  private phasePlayerCompile() {
    if (this.phaseStarted()) {
      console.log('compiling...');
      this.tmp.compileFinished = false;

      let timer = this.scene.time.addEvent({
        delay: 1000,
        callback: () => {
          this.tmp.compileFinished = true;
          timer.destroy();
        },
        callbackScope: this,
        loop: false,
        paused: false
      });
    }

    if (this.tmp.compileFinished) {
      console.log('compilation finished')
      this.nextPhase();
    }

    // this.timers.push(timer);
  }

  //
  // OPPONENT DRAW
  //
  private phaseOpponentDraw() {
    if (this.phaseStarted()) {
      console.log('opponent draw')
    }
  }

  //
  // OPPONENT COMMAND
  //
  private phaseOpponentCommand() {
  }

  //
  // OPPONENT PROTECT
  //
  private phaseOpponentProtect() {
  }

  //
  // OPPONENT COMPILE
  //
  private phaseOpponentCompile() {
  }

  private phaseStarted(): boolean {
    let isStart = this.phase != this.board.phase
    this.phase = this.board.phase;
    return isStart;
  }


  private nextPhase() {
    this.board.phase++;
    this.tmp = {};
  }
}