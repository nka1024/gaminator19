/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  gaminator 19
*/

import { Keybinds } from "../Keybinds";
import { BoardSpotsContainer } from "./BoardSpotsContainer";
import { HandDisplay } from "./HandDisplay";
import { BoardData, BoardPhase, PhaseType, CardData, CardType, CardSkillType, PlayerBoardData } from "../types/Types";
import { CardDetailsDisplay } from "./CardDetailsDisplay";
import { CardDisplay } from "./CardDisplay";
import { PlayerDisplay } from "./PlayerDisplay";
import { PhaseDisplay } from "./PhaseDisplay";
import { TerminalDisplay, TerminalScreenID } from "./TerminalDisplay";
import { CONST } from "../const/const";

type TMPData = {
  prepareFinished?: boolean;
  selectedCard?: CardData;
  protectedCard?: CardData;
  compileFinished?: boolean;
}

export enum BattleControllerEvent  {
  BATTLE_END = 'BATTLE_END',
  LINK_UP = 'LINK_UP',
  CORE_DAMAGE = 'CORE_DAMAGE',
  CORE_HEAL = 'CORE_HEAL',
  MODULE_DAMAGE = 'MODULE_DAMAGE',
  MODULE_HEAL = 'MODULE_HEAL',
  MODULE_BUFF = 'MODULE_BUFF',
  ERROR = 'ERROR',
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
        delay: CONST.DEV ? 100 : 2000,
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
      this.events.emit(BattleControllerEvent.LINK_UP);

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
  // HELPER METHODS
  // 
  private modifyCoreHP(data: PlayerBoardData, view: PlayerDisplay, value: number) {
    data.hp += value;
    view.populate(data.hp, data.link, data.linkMax);
    view.deltaHPAnim(value);

    if (value < 0) this.events.emit(BattleControllerEvent.CORE_DAMAGE);
    else if (value > 0 ) this.events.emit(BattleControllerEvent.CORE_HEAL);
  }

  private modifyCoreLink(data: PlayerBoardData, view: PlayerDisplay, value: number) {
    data.link += value;
    view.populate(data.hp, data.link, data.linkMax);
    view.deltaLinkAnim(value);
  }

  private modifyCardHP(card: CardData, value: number) {
    card.hp += value;
    let spot = this.spots.spotForCard(card);
    spot.deltaHPAnim(value);
    spot.repopulate();
    if (value < 0) this.events.emit(BattleControllerEvent.MODULE_DAMAGE);
    else if (value > 0 ) this.events.emit(BattleControllerEvent.MODULE_HEAL);
  }

  private modifyCardAtk(card: CardData, value: number) {
    card.attack += value;
    let spot = this.spots.spotForCard(card);
    spot.deltaAtkAnim(value);
    spot.repopulate();
    if (value > 0 ) this.events.emit(BattleControllerEvent.MODULE_BUFF);
  }

  private removeCardFromHand(card: CardData, hand: CardData[]) {
    hand.splice(hand.indexOf(card), 1);
    if (hand == this.board.opponent.hand) {
      this.opponent.setHandSize(hand.length)
    } else {
      this.hand.removeCardAtCursor();
    }
  }

  private putCardToBoard(card: CardData, col: number, playerData: PlayerBoardData) {
    let row = playerData == this.board.opponent ? 0 : 1;
    playerData.board[col] = card;
    this.spots.putCard(row, col, card);
  }

  private removeCardFromBoard(card: CardData) {
    let row = 0
    let col = 0;
    for (let i = 0; i < this.board.opponent.board.length; i++) {
      if (this.board.opponent.board[i] == card) {
        this.board.opponent.board[i] = null;
        row = 0;
        col = i;
        break;
      }
    }
    for (let i = 0; i < this.board.player.board.length; i++) {
      if (this.board.player.board[i] == card) {
        this.board.player.board[i] = null;
        row = 1;
        col = i;
        break;
      }
    }
    this.spots.putCard(row, col, null);
  }

  //
  // PLAYER COMMAND
  //
  private phasePlayerCommand() {
    if (this.phaseStarted()) {
      this.turn.setPhase(PhaseType.COMMANDS)
      this.hand.setCursorHidden(false)
      this.hand.putCursor(0);
      this.details.visible = true;
      this.terminal.setScreen(TerminalScreenID.SELECT_MODULE);
    }

    if (this.tmp.selectedCard) {
      this.commandSelectedPlayerCard();
    } else {
      
      // select card from hand
      if (this.keybinds.leftPressed) {
        this.hand.moveCursor(-1)
        this.terminal.setScreen(TerminalScreenID.SELECT_MODULE);
      }
      if (this.keybinds.rightPressed) {
        this.hand.moveCursor(1)
        this.terminal.setScreen(TerminalScreenID.SELECT_MODULE);
      }
      if (this.keybinds.enterPressed) {
        if (this.hand.cursorPos < this.board.player.hand.length) {
          // activate spot cursor for selected card
          let card = this.board.player.hand[this.hand.cursorPos];
          if (card.link <= this.board.player.link) {
            if (card.instant) {
              this.useInstantCard(card)
            } else {
              this.tmp.selectedCard = card
              this.terminal.setScreen(TerminalScreenID.SELECT_LANE);
              this.spots.putCursor(1, 1);
              this.spots.setCursorHidden(false);
              this.spots.setNextPhaseHidden(true);
            }
          } else {
            this.terminal.setScreen(TerminalScreenID.UNSIFFICIENT_LINK);
            this.events.emit(BattleControllerEvent.ERROR);
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
  // COMMAND HELPERS
  // 
  private useInstantCard(card: CardData) {
    if (card.skill == CardSkillType.ADD_HP_CORE) {
      this.modifyCoreHP(this.board.player, this.player, card.benefit);
      this.modifyCoreLink(this.board.player, this.player, -card.link);
      this.removeCardFromHand(card, this.board.player.hand);
      this.tmp.selectedCard = null;
    } else {
      throw ('unknown instant card skill type')
    }
  }

  private commandSelectedPlayerCard() {
    // select spot for card
    if (this.keybinds.downPressed) this.spots.moveCursor(0, 1)
    if (this.keybinds.upPressed) this.spots.moveCursor(0, -1)
    if (this.keybinds.leftPressed) this.spots.moveCursor(-1)
    if (this.keybinds.rightPressed) this.spots.moveCursor(1)
    if (this.keybinds.enterPressed) {
      let card = this.tmp.selectedCard;

      if (card.type == CardType.EFFECT) {
        // use effect card
        let target = this.spots.getCardAtCursor();
        if (!target) {
          console.log('need to select card');
        } else {
          // apply skill effect
          if (card.skill == CardSkillType.ADD_HP_CREATURE) {
            this.modifyCoreLink(this.board.player, this.player, -card.link)
            this.modifyCardHP(target, card.benefit);
          } else if (card.skill == CardSkillType.ADD_ATTACK_CREATURE) {
            this.modifyCoreLink(this.board.player, this.player, -card.link)
            this.modifyCardAtk(target, card.benefit);
          } else {
            throw ('unknow card skill type');
          }
          // remove used card
          this.spots.setCursorHidden(true);
          this.spots.setNextPhaseHidden(true);
          this.removeCardFromHand(card, this.board.player.hand);
          this.tmp.selectedCard = null;
        }
      }
      else if (card.type == CardType.CREATURE) {
        // place creature on board
        if (this.spots.getCursorRow() == 0) {
          this.terminal.setScreen(TerminalScreenID.UNABLE_TO_INSTALL);
          this.events.emit(BattleControllerEvent.ERROR);
        } else {
          if (card.link <= this.board.player.link) {
            this.modifyCoreLink(this.board.player, this.player, -card.link)

            this.putCardToBoard(card, this.spots.getCursorCol(), this.board.player);
            this.spots.setCursorHidden(true);
            this.spots.setNextPhaseHidden(true);

            this.removeCardFromHand(card, this.board.player.hand);
            this.tmp.selectedCard = null;
          } else {
            this.terminal.setScreen(TerminalScreenID.UNSIFFICIENT_LINK);
            this.events.emit(BattleControllerEvent.ERROR);
          }
        }
      } else {
        throw ('unknown card type');
      }
    }
    if (this.keybinds.escPressed) {
      this.tmp.selectedCard = null;
      this.spots.setCursorHidden(true);
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


  private onPlayerAttack(i: number): Phaser.Types.Time.TimerEventConfig {
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
              this.modifyCardHP(opponentCard, -card.attack);
            } else {
              this.modifyCoreHP(this.board.opponent, this.opponent, -card.attack);
            }
            if (opponentCard.hp <= 0) {
              this.removeCardFromBoard(opponentCard);
            }
          } else {
            this.modifyCoreHP(this.board.opponent, this.opponent, -card.attack);
          }
        }

        if (this.board.opponent.hp <= 0) {
          this.events.emit(BattleControllerEvent.BATTLE_END, 'win');
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
      this.events.emit(BattleControllerEvent.LINK_UP);

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
          let idxes = variants[Math.floor(Math.random() * variants.length)];

          for (let idx of idxes) {
            if (this.board.opponent.board[idx] == null) {
              this.putCardToBoard(card, idx, this.board.opponent);
              this.removeCardFromHand(card, this.board.opponent.hand);
              this.modifyCoreLink(this.board.opponent, this.opponent, -card.link);
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
              this.modifyCoreHP(this.board.player, this.player, -card.attack)
            }
            if (playerCard.hp <= 0) {
              this.board.player.board[i] = null
              this.spots.putCard(1, i, null);
            }
          } else {
            this.modifyCoreHP(this.board.player, this.player, -card.attack)
          }
        }
        
        if (this.board.player.hp <= 0) {
          this.events.emit(BattleControllerEvent.BATTLE_END, 'lose');
        }
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