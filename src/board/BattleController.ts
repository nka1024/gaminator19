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
      // select spot for card
      if (this.keybinds.leftPressed) this.spots.moveCursor(-1)
      if (this.keybinds.rightPressed) this.spots.moveCursor(1)
      if (this.keybinds.enterPressed) {
        let card = this.tmp.selectedCard
        if (card.link <= this.board.player.link) {
          // reduce link
          this.board.player.link -= card.link;
          this.player.populate(this.board.player.hp, this.board.player.link, this.board.player.linkMax);
          // put hard on board
          this.spots.putCardAtCursor(card);
          this.board.player.board[this.spots.getCursorCol()] = card;
          this.tmp.selectedCard = null;
          this.spots.setCursorHidden(true);
          this.spots.setNextPhaseHidden(true);
          // remove card from hand
          this.board.player.hand.splice(this.board.player.hand.indexOf(card), 1);
          this.hand.removeCardAtCursor();
        } else {
          console.log('not enough link');
        }
      }
      if (this.keybinds.escPressed) {
        this.tmp.selectedCard = null;
        this.spots.setCursorHidden(true);
      }
    } else {
      // select card from hand
      if (this.keybinds.leftPressed) this.hand.moveCursor(-1)
      if (this.keybinds.rightPressed) this.hand.moveCursor(1)
      if (this.keybinds.enterPressed) {
        if (this.hand.cursorPos < this.board.player.hand.length) {
          // activate spot cursor for selected card
          let card = this.board.player.hand[this.hand.cursorPos];
          if (card.link <= this.board.player.link) {
            this.tmp.selectedCard = card
            this.spots.putCursor(1, 1);
            this.spots.setCursorHidden(false);
            this.spots.setNextPhaseHidden(true);
          } else {
            console.log('not enough link');
          }
        } else {
          // next phase
          this.hand.setCursorHidden(true);
          this.details.visible = false;
          this.nextPhase();
        }
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
      this.spots.setNextPhaseHidden(false);
    }

    if (this.keybinds.leftPressed) this.spots.moveCursor(-1)
    if (this.keybinds.rightPressed) this.spots.moveCursor(1)
    if (this.keybinds.enterPressed) {
      if (!this.spots.isCursorNextPhase()) {
        // toggle card protection
        let card = this.spots.getCardAtCursor();

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
      } else {
        // go to compile phase
        if (this.keybinds.enterPressed) {
          this.spots.setCursorHidden(true);
          this.spots.setNextPhaseHidden(true);
          this.nextPhase();
        }
      }
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
    if (this.phaseStarted()) {
      console.log('вrawing player cards');

      // turn 
      this.board.turn++;
      this.turn.setPhase(PhaseType.OPPONENT);

      // increase & refill mana
      this.board.opponent.linkMax++;
      this.board.opponent.link = this.board.opponent.linkMax;
      // this.player.addLink(this.board.player.link, this.board.player.linkMax);

      // draw card
      for (let i = 0; i < (this.board.turn == 1 ? 3 : 1); i++) {
        let timer = this.scene.time.addEvent({
          delay: i * 250,
          callback: () => {
            let card = this.board.opponent.deck.shift();
            this.board.opponent.hand.push(card);
            // this.hand.addCard(new CardDisplay(this.scene).populate(card));
            timer.destroy();
          },
          callbackScope: this,
          loop: false,
          paused: false
        });
      }

      let timer = this.scene.time.addEvent({
        delay: 1000,
        callback: () => {
          this.nextPhase();
          timer.destroy();
        },
        callbackScope: this,
        loop: false,
        paused: false
      });
    }
  }

  //
  // OPPONENT COMMAND
  //
  private phaseOpponentCommand() {
    if (this.phaseStarted()) {
      console.log('opponent command')

      // select card and put it on board
      for (let card of this.board.opponent.hand) {
        if (card.link <= this.board.opponent.link) {
          let idxes = [];
          if (Math.random() > 0.66) idxes = [0,2,1]
          else if (Math.random() > 0.5) idxes = [1,0,2]
          else idxes = [2,1,0]

          for (let idx of idxes) {
            if (this.board.opponent.board[idx] == null) {
              this.board.opponent.board[idx] = card;
              this.spots.putCard(0, idx, card);
              this.board.opponent.link -= card.link; 
              this.board.opponent.hand.splice(this.board.player.hand.indexOf(card), 1);
              break;
            }
          }
        }
      }
    }
    this.nextPhase();
  }

  //
  // OPPONENT PROTECT
  //
  private phaseOpponentProtect() {
    if (this.phaseStarted()) {
      console.log('opponent protect')
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