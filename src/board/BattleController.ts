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
  private phase: BoardPhase = BoardPhase.UNDEFINED;
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
      console.log('battle begins. press enter to start');
      this.player.populate(this.board.player.hp, this.board.player.link, this.board.player.linkMax);
      this.turn.setPhase(PhaseType.LOAD);
    }
    this.nextPhase();
  }

  //
  // PLAYER DRAW
  //
  private phasePlayerDraw() {
    if (this.phaseStarted()) {
      console.log('вrawing player cards');

      // turn 
      this.board.turn++;
      this.turn.setPhase(PhaseType.OPPONENT);

      // draw card
      for (let i = 0; i < (this.board.turn == 1 ? 3 : 1); i++) {
        let card = this.board.player.deck.shift();
        this.board.player.hand.push(card);
        this.hand.addCard(new CardDisplay(this.scene).populate(card));
      }
      // increase & refill mana
      this.board.player.linkMax++;
      this.board.player.link = this.board.player.linkMax;
      this.player.addLink(this.board.player.link, this.board.player.linkMax);

      if (this.board.turn == 1) {
        console.log('press enter to confirm your initial hand');
      } else {
        this.nextPhase();
        return;
      }
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
      this.turn.setPhase(PhaseType.COMMANDS)
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
      this.turn.setPhase(PhaseType.PROTECT);
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
      this.turn.setPhase(PhaseType.COMPILE);
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
    this.turn.setPhase(PhaseType.OPPONENT)
    if (this.phaseStarted()) {
      console.log('opponent draw')
    }
    this.nextPhase();
  }

  //
  // OPPONENT COMMAND
  //
  private phaseOpponentCommand() {
    if (this.phaseStarted()) {
      console.log('opponent draw')
    }
    this.nextPhase();
  }

  //
  // OPPONENT PROTECT
  //
  private phaseOpponentProtect() {
    if (this.phaseStarted()) {
      console.log('opponent draw')
    }
    this.nextPhase();
  }

  //
  // OPPONENT COMPILE
  //
  private phaseOpponentCompile() {
    if (this.phaseStarted()) {
      console.log('opponent draw')
    }
    this.nextPhase();
  }

  private phaseStarted(): boolean {
    let isStart = this.phase != this.board.phase
    this.phase = this.board.phase;
    return isStart;
  }


  private nextPhase() {
    if (this.board.phase == BoardPhase.OPPONENT_COMPILE) {
      this.board.phase = BoardPhase.PLAYER_DRAW
    } else {
      this.board.phase++;
    }
    this.tmp = {};
  }
}