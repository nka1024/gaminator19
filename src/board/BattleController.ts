/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  gaminator 19
*/

import { Keybinds } from "../Keybinds";
import { BoardSpotsContainer } from "./BoardSpotsContainer";
import { HandDisplay } from "./HandDisplay";
import { BoardData, BoardPhase, PhaseType, CardData } from "../types/Types";
import { CardDetailsDisplay } from "./CardDetailsDisplay";
import { CardDisplay } from "./CardDisplay";
import { PlayerDisplay } from "./PlayerDisplay";
import { PhaseDisplay } from "./PhaseDisplay";
import { TerminalDisplay, TerminalScreenID } from "./TerminalDisplay";

type TMPData = {
  prepareFinished?: boolean;
  selectedCard?: CardData;
  protectedCard?: CardData;
  compileFinished?: boolean;
}

export class BattleController {
  private phase: BoardPhase = BoardPhase.UNDEFINED;
  private tmp: TMPData = {};

  public events: Phaser.Events.EventEmitter;

  constructor(
    private scene: Phaser.Scene,
    private keybinds: Keybinds,
    private player: PlayerDisplay,
    private opponent: PlayerDisplay,
    private turn: PhaseDisplay,
    private terminal: TerminalDisplay,
    private spots: BoardSpotsContainer,
    private hand: HandDisplay,
    private details: CardDetailsDisplay,
    private board: BoardData) {
    this.events = new Phaser.Events.EventEmitter();
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
      case BoardPhase.OPPONENT_COMPILE: this.phaseOpponentCompile(); return
    }
  }

  //
  // PREPARE
  //
  private phasePrepare() {
    if (this.phaseStarted()) {
      this.terminal.setScreen(TerminalScreenID.PRESS_ENTER_TO_START);
      console.log('battle begins. press enter to start');
      this.player.populate(this.board.player.hp, this.board.player.link, this.board.player.linkMax);
      this.opponent.populate(this.board.opponent.hp, this.board.opponent.link, this.board.opponent.linkMax);
      this.opponent.setTexture('creature_snakey');
      this.turn.setPhase(PhaseType.LOAD);

      let timer = this.scene.time.addEvent({
        delay: 2000,
        callback: () => {
          this.tmp.prepareFinished = true;
          timer.destroy();
          this.nextPhase();
        },
        callbackScope: this,
        loop: false,
        paused: false
      });
    }
    if (this.tmp.prepareFinished) {
      this.nextPhase();
    }
  }

  //
  // PLAYER DRAW
  //
  private phasePlayerDraw() {
    if (this.phaseStarted()) {
      console.log('вrawing player cards');

      // turn 
      this.board.turn++;
      this.turn.setPhase(PhaseType.LOAD);

      // draw card
      for (let i = 0; i < (this.board.turn == 1 ? 3 : 1); i++) {
        let card = this.board.player.deck.shift();
        if (card) {
          this.board.player.hand.push(card);
          this.hand.addCard(new CardDisplay(this.scene).populate(card));
        }
      }

      if (this.board.turn == 1) {
        for (let i = 0; i < 3; i++) {
          let card = this.board.opponent.deck.shift();
          if (card) {
            this.board.opponent.hand.push(card);
            this.opponent.setHandSize(this.board.opponent.hand.length)
          }
        }
      }

      // increase & refill mana
      this.board.player.linkMax++;
      this.board.player.link = this.board.player.linkMax;
      this.player.addLink(this.board.player.link, this.board.player.linkMax);

      // unturn turned cards 
      for (let i = 0; i < 3; i++) {
        if (this.board.player.board[i])
          this.board.player.board[i].turned = false;
        this.spots.refresh();
      }

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
      this.terminal.setScreen(TerminalScreenID.SELECT_MODULE);
      this.hand.setCursorHidden(false)
      this.hand.putCursor(0);
      this.details.visible = true;
    }

    if (this.tmp.selectedCard) {
      // select spot for card
      if (this.keybinds.downPressed) this.spots.moveCursor(0, 1)
      if (this.keybinds.upPressed) this.spots.moveCursor(0, -1)
      if (this.keybinds.leftPressed) this.spots.moveCursor(-1)
      if (this.keybinds.rightPressed) this.spots.moveCursor(1)
      if (this.keybinds.enterPressed) {
        if (this.spots.getCursorRow() == 0) {
          this.terminal.setScreen(TerminalScreenID.UNABLE_TO_INSTALL);
        } else {
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
            this.terminal.setScreen(TerminalScreenID.UNSIFFICIENT_LINK);
          }
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
            this.terminal.setScreen(TerminalScreenID.SELECT_LANE);
            this.spots.putCursor(1, 1);
            this.spots.setCursorHidden(false);
            this.spots.setNextPhaseHidden(true);
          } else {
            this.terminal.setScreen(TerminalScreenID.UNSIFFICIENT_LINK);
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
      this.terminal.setScreen(TerminalScreenID.HIDE_MODULE);
      this.spots.putCursor(1, 1);
      this.spots.setNextPhaseHidden(false);
    }

    if (this.keybinds.leftPressed) this.spots.moveCursor(-1)
    if (this.keybinds.rightPressed) this.spots.moveCursor(1)
    if (this.keybinds.enterPressed) {
      // let col = this.spots.getCursorCol();
      // let short = this.board.opponent.board[col] != null
      // this.spots.attack(1, col, -1, short);
      if (!this.spots.isCursorNextPhase()) {
        // toggle card protection
        let card = this.spots.getCardAtCursor();

        for (let bcard of this.board.player.board) {
          if (bcard && bcard != card) {
            bcard.protected = false;
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

      for (let i = 0; i < 3; i++) {
        let t = this.scene.time.addEvent(this.onPlayerAttack(i))
      }

      let timer = this.scene.time.addEvent({
        delay: 2000,
        callback: () => {
          this.tmp.compileFinished = true;
          // this.events.emit('battle_end');
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
  }


  private onPlayerAttack(i: number):Phaser.Types.Time.TimerEventConfig {
    return {
      delay: i * 500,
      callback: () => {
        let card = this.board.player.board[i];
        if (card && !card.turned) {
          let opponentCard = this.board.opponent.board[i];
          let short = opponentCard != null
          this.spots.attack(1, i, -1, short);
          // deal damage
          if (opponentCard) {
            if (!card.protected) {
              opponentCard.hp -= card.attack;
              this.spots.refresh();
            } else {
              this.board.opponent.hp -= card.attack;
              this.spots.refresh();
              this.opponent.populate(this.board.opponent.hp, this.board.opponent.link, this.board.opponent.linkMax);
            }
            if (opponentCard.hp <= 0) {
              this.board.opponent.board[i] = null;
              this.spots.putCard(0, i, null);
              console.log('destroyed opponent card at slot ' + i);
            }
          } else {
            this.board.opponent.hp -= card.attack;
            this.spots.refresh();
            this.opponent.populate(this.board.opponent.hp, this.board.opponent.link, this.board.opponent.linkMax);
          }
        }
        // t.destroy();
      },
      callbackScope: this,
      loop: false,
      paused: false
    };

  }
  //
  // OPPONENT DRAW
  //
  private phaseOpponentDraw() {
    if (this.phaseStarted()) {
      console.log('вrawing player cards');

      // turn 
      this.turn.setPhase(PhaseType.OPPONENT);

      // increase & refill mana
      this.board.opponent.linkMax++;
      this.board.opponent.link = this.board.opponent.linkMax;
      this.opponent.addLink(this.board.opponent.link, this.board.opponent.linkMax);

      // unturn turned cards 
      for (let i = 0; i < 3; i++) {
        if (this.board.opponent.board[i])
          this.board.opponent.board[i].turned = false;
        this.spots.refresh();
      }

      // draw card
      let timerDraw = this.scene.time.addEvent({
        delay: 250,
        callback: () => {
          let card = this.board.opponent.deck.shift();
          if (card) {
            this.board.opponent.hand.push(card);
            this.opponent.setHandSize(this.board.opponent.hand.length)
            // this.hand.addCard(new CardDisplay(this.scene).populate(card));
          }
          timerDraw.destroy();
        },
        callbackScope: this,
        loop: false,
        paused: false
      });


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
          let variants = [
            [0, 2, 1],
            [0, 1, 2],
            [1, 0, 2],
            [1, 2, 0],
            [2, 1, 0],
            [2, 0, 1]
          ]
          let idxes = variants[Math.floor(Math.random()*variants.length)];
          
          for (let idx of idxes) {
            if (this.board.opponent.board[idx] == null) {
              this.board.opponent.board[idx] = card;
              this.spots.putCard(0, idx, card);
              this.board.opponent.link -= card.link;
              this.board.opponent.hand.splice(this.board.opponent.hand.indexOf(card), 1);
              this.opponent.setHandSize(this.board.opponent.hand.length)
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
      this.turn.setPhase(PhaseType.OPPONENT);
      this.tmp.compileFinished = false;

      for (let i = 0; i < 3; i++) {
        let t = this.scene.time.addEvent(this.onOpponentAttack(i));
      }

      let timer = this.scene.time.addEvent({
        delay: 2000,
        callback: () => {
          this.tmp.compileFinished = true;
          timer.destroy();
          this.nextPhase();
        },
        callbackScope: this,
        loop: false,
        paused: false
      });
    }
  }

  private onOpponentAttack(i: number): Phaser.Types.Time.TimerEventConfig {
    return {
      delay: i * 500,
      callback: () => {
        let card = this.board.opponent.board[i];
        if (card && !card.turned) {
          let playerCard = this.board.player.board[i];
          let short = playerCard != null
          this.spots.attack(0, i, 1, short);
          // deal damage
          if (playerCard) {
            if (!playerCard.protected) {
              playerCard.hp -= card.attack;
              this.spots.refresh();
            } else {
              this.board.player.hp -= card.attack;
              this.spots.refresh();
              this.player.populate(this.board.player.hp, this.board.player.link, this.board.player.linkMax);
            }
            if (playerCard.hp <= 0) {
              this.board.player.board[i] = null
              this.spots.putCard(1, i, null);
            }
          } else {
            this.board.player.hp -= card.attack;
            this.spots.refresh();
            this.player.populate(this.board.player.hp, this.board.player.link, this.board.player.linkMax);
          }
        }
        // t.destroy();
      },
      callbackScope: this,
      loop: false,
      paused: false
    }
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