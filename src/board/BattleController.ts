/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  gaminator 19
*/

import { Keybinds } from "../Keybinds";
import { BoardSpotsContainer } from "./BoardSpotsContainer";
import { HandDisplay } from "./HandDisplay";
import { BoardData, 
  BoardPhase, PhaseType, CardData, CardType, CardSkillType, PlayerBoardData } from "../types/Types";
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

export enum BattleControllerEvent {
  BATTLE_END = 'BATTLE_END',
  LINK_UP = 'LINK_UP',
  CORE_DAMAGE = 'CORE_DAMAGE',
  CORE_HEAL = 'CORE_HEAL',
  MODULE_DAMAGE = 'MODULE_DAMAGE',
  MODULE_HEAL = 'MODULE_HEAL',
  MODULE_BUFF = 'MODULE_BUFF',
  MODULE_DEATH = 'MODULE_DEATH',
  MODULE_DRAW = 'MODULE_DRAW',
  ERROR = 'ERROR',
  PLAYER_LOST = 'PLAYER_LOST',
  PLAYER_WON = 'PLAYER_WON'
}

export class BattleController {
  private phase: BoardPhase = BoardPhase.UNDEFINED;
  private initialHandSize: number = 4;
  private tmp: TMPData = {};
  private result: string = '';
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
      case BoardPhase.BATTLE_END: this.phaseBattleEnd(); return
    }
  }

  private isCardTurned(card: CardData) {
    return card.turned || card.hybernate > 0;
  }

  private unturn(board: CardData[]) {
    for (let card of board) {
      if (card && card.turned) {
        card.turned = false;
      }
      this.spots.refresh();
    }
  }

  private unhybernate(board: CardData[]) {
    // reduce hybernate
    for (let card of board) {
      if (card && card.hybernate) {
        card.hybernate--;
      }
      this.spots.refresh();
    }
  }

  private applySubtlety(damage: number, data: PlayerBoardData): number {
    if (damage >= 0) return damage;
    let board = data == this.board.player ? this.board.player.board : this.board.opponent.board

    for (let card of board) {
      if (card && card.protected) {
        if (card.skill == CardSkillType.SUBTLETY) {
          let result = -Math.floor(Math.abs(damage / 2));
          return result;
        }
      }
    }
    return damage;
  }

  //
  // PREPARE
  //
  private phasePrepare() {
    if (this.phaseStarted()) {
      // this.terminal.setScreen(TerminalScreenID.PRESS_ENTER_TO_START);
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
          // this.nextPhase();
        },
        callbackScope: this,
        loop: false,
        paused: false
      });
    }
    if (this.tmp.prepareFinished) {
      this.terminal.setScreen(TerminalScreenID.PRESS_ENTER_TO_START);
      if (this.keybinds.enterPressed) {
        console.log('hand is confirmed');
        if (CONST.INSTANT_WIN) this.endBattle(true);
        else if (CONST.INSTANT_LOSE) this.endBattle(false);
        else this.nextPhase();
      }
      // this.nextPhase();
    }
  }

  //
  // PLAYER DRAW
  //
  private phasePlayerDraw() {
    if (this.phaseStarted()) {
      console.log('вrawing player cards');

      this.hand.visible = true;
      this.board.turn++;
      this.turn.setPhase(PhaseType.LOAD);

      // draw card
      for (let i = 0; i < (this.board.turn == 1 ? this.initialHandSize : 1); i++) {
        let card = this.board.player.deck.shift();
        if (card) {
          this.board.player.hand.push(card);
          this.hand.addCard(new CardDisplay(this.scene).populate(card), i * 300);
          if (this.board.turn == 1) {
            this.scene.time.addEvent({
              delay: i * 300,
              callback: () => {
                this.events.emit(BattleControllerEvent.MODULE_DRAW);
              },
              callbackScope: this,
              loop: false,
              paused: false
            });
          }
        }
      }

      // opponent draw
      if (this.board.turn == 1) {
        for (let i = 0; i < this.initialHandSize; i++) {
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

      for (let card of this.board.opponent.board) {
        if (card && card.hybernate) {
          card.hybernate--;
        }
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
    value = this.applySubtlety(value, data);
    data.hp += value;
    if (data.hp < 0) data.hp = 0;
    view.populate(data.hp, data.link, data.linkMax);
    view.deltaHPAnim(value);

    if (value < 0) this.events.emit(BattleControllerEvent.CORE_DAMAGE);
    else if (value > 0) this.events.emit(BattleControllerEvent.CORE_HEAL);
  }

  private modifyCoreLink(data: PlayerBoardData, view: PlayerDisplay, value: number) {
    data.link += value;
    view.populate(data.hp, data.link, data.linkMax);
    view.deltaLinkAnim(value);
  }

  private modifyCardHP(card: CardData, value: number) {
    card.hp += value;
    if (card.hp < 0) card.hp = 0;

    let spot = this.spots.getSpotForCard(card);
    spot.deltaHPAnim(value);
    spot.repopulate();
    if (value < 0) this.events.emit(BattleControllerEvent.MODULE_DAMAGE);
    else if (value > 0) this.events.emit(BattleControllerEvent.MODULE_HEAL);
  }

  private modifyCardAtk(card: CardData, value: number) {
    card.attack += value;
    let spot = this.spots.getSpotForCard(card);
    spot.deltaAtkAnim(value);
    spot.repopulate();
    if (value > 0) this.events.emit(BattleControllerEvent.MODULE_BUFF);
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
    let oldCard = playerData.board[col];
    playerData.board[col] = card;
    this.spots.putCard(row, col, card);
    if (card.skill == CardSkillType.HYBRID) {
      if (oldCard) {
        card.turned = false;
        this.modifyCardHP(card, oldCard.hp);
        this.modifyCardAtk(card, oldCard.attack);
      }
    } else if (card.skill == CardSkillType.INJECTION) {
      let targetBoard = row == 1 ? this.board.opponent.board : this.board.player.board;
      let target = targetBoard[col];
      if (target) {
        targetBoard[col] = card;
        playerData.board[col] = target;
        this.spots.swapCards(card, target)
      } else {
        this.spots.putCard(row == 0 ? 1 : 0, col, card);
      }
    }
  }

  private removeCardFromBoard(card: CardData) {
    this.spots.getSpotForCard(card).playDeathAnim();
    this.events.emit(BattleControllerEvent.MODULE_DEATH);

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
    }
    else if (card.skill == CardSkillType.DAMAGE_CORE) {
      this.modifyCoreHP(this.board.opponent, this.opponent, -card.benefit);
      this.modifyCoreLink(this.board.player, this.player, -card.link);
      this.removeCardFromHand(card, this.board.player.hand);
      this.tmp.selectedCard = null;
      if (this.board.opponent.hp <= 0) {
        this.endBattle(true);
      }
    }
    else {
      throw ('unknown instant card skill type')
    }
  }

  private onCardSpawn(card: CardData, playerData: PlayerBoardData) {
    let row = playerData == this.board.player ? 1 : 0;
    if (card.skill) {
      // buff all cards except this one
      if (card.skill == CardSkillType.BUFF_ALLIES_1_1) {
        for (let target of playerData.board) {
          if (target != card && target != null) {
            this.modifyCardHP(target, 1);
            this.modifyCardAtk(target, 1);
          }
        }
      } else if (card.skill == CardSkillType.BUFF_ATK_WHILE_ALIVE) {
        // buff all cards except this one
        for (let target of playerData.board) {
          if (target != card && target != null) {
            this.modifyCardAtk(target, 2);
          }
        }
      } else if (card.skill == CardSkillType.ZERO_TURN) {
        card.turned = false;
        this.spots.getSpotForCard(card).repopulate();
      }
    }

    let i = 0;
    for (let c of playerData.board) {
      console.log('i: ' + i + ' = ' + c)
      i++
      if (c && c.skill == CardSkillType.BUFF_ATK_WHILE_ALIVE) {
        this.modifyCardAtk(card, 2);
      }
    }
  }

  private onCardDeath(card: CardData, playerData: PlayerBoardData) {
    if (card.skill == CardSkillType.BUFF_ATK_WHILE_ALIVE) {
      for (let c of playerData.board) {
        if (c) {
          this.modifyCardAtk(c, -2);
        }
      }
      this.spots.refresh();
    } else if (card.skill == CardSkillType.BOMB) {
      let data = this.board.player == playerData ? this.board.opponent : playerData;
      for (let target of data.board) {
        if (target) {
          this.doDamageToCard(target, 3, card)
        }
      }
      this.spots.refresh();
    }
  }

  private getBoardCardOwner(card: CardData): PlayerBoardData {
    for (let c of this.board.opponent.board) {
      if (c == card) {
        return this.board.opponent;
      }
    }
    for (let c of this.board.player.board) {
      if (c == card) {
        return this.board.player;
      }
    }
    return null;
  }

  private hybernateCard(card: CardData, cycles: number) {
    card.hybernate = cycles;
    let spot = this.spots.getSpotForCard(card);
    spot.repopulate();
  }

  private doDamageToCard(card: CardData, dmg: number, source: CardData) {
    let owner = this.getBoardCardOwner(card);
    if (!owner) return;
    if (!card.protected) {
      this.modifyCardHP(card, -dmg);
      if (card.hp <= 0) {
        this.removeCardFromBoard(card);
        this.onCardDeath(card, owner);
      } else {
        if (card.skill == CardSkillType.SLEEPER_HOLD) {
          this.hybernateCard(source, 2)
        }
      }
    } else {
      let view = owner == this.board.player ? this.player : this.opponent;
      this.modifyCoreHP(owner, view, dmg);
      if (owner.hp <= 0) {
        this.endBattle(owner == this.board.opponent);
      }
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
          } else if (card.skill == CardSkillType.DAMAGE_CREATURE) {
            this.modifyCoreLink(this.board.player, this.player, -card.link)
            this.doDamageToCard(target, card.benefit, card);
          } else if (card.skill == CardSkillType.HYBERNATION) {
            this.modifyCoreLink(this.board.player, this.player, -card.link)
            this.hybernateCard(target, 1);
          } else if (card.skill == CardSkillType.ENRAGE) {
            this.modifyCoreLink(this.board.player, this.player, -card.link)
            this.modifyCardAtk(target, 2);
            this.doDamageToCard(target, 1, card);
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

            this.onCardSpawn(card, this.board.player);
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
      this.details.visible = false;
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
        if (this.isBattleEnded())
          return;

        let card = this.board.player.board[i];
        if (card && !this.isCardTurned(card)) {
          let opponentCard = this.board.opponent.board[i];
          let short = opponentCard != null
          this.spots.attack(1, i, -1, short);
          // deal damage
          if (opponentCard) {
            this.doDamageToCard(opponentCard, card.attack, card);
          } else {
            this.modifyCoreHP(this.board.opponent, this.opponent, -card.attack);
            if (this.board.opponent.hp <= 0) {
              this.endBattle(true);
            }
          }
        }


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

      this.unturn(this.board.opponent.board);
      this.unhybernate(this.board.player.board);

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
              this.onCardSpawn(card, this.board.opponent);
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
          if (!this.isBattleEnded())
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
        if (this.isBattleEnded())
          return;

        let card = this.board.opponent.board[i];
        if (card && !this.isCardTurned(card)) {
          let playerCard = this.board.player.board[i];
          let short = playerCard != null
          this.spots.attack(0, i, 1, short);
          // deal damage
          if (playerCard) {
            this.doDamageToCard(playerCard, card.attack, card);
          } else {
            this.modifyCoreHP(this.board.player, this.player, -card.attack)
            if (this.board.player.hp <= 0) {
              this.endBattle(false);
            }
          }
        }
      },
      callbackScope: this,
      loop: false,
      paused: false
    }
  }

  private phaseBattleEnd() {
    if (!this['ended']) {
      this['ended'] = true;
      this.terminal.setScreen(this.result == 'win' ? TerminalScreenID.BATTLE_WON : TerminalScreenID.BATTLE_LOST);
    }
    else if (this.keybinds.enterPressed) {
      this.events.emit(BattleControllerEvent.BATTLE_END, this.result);
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
    if (this.board.phase >= BoardPhase.BATTLE_END) {
      this.board.phase = BoardPhase.BATTLE_END;
    }
    this.tmp = {};
  }

  private isBattleEnded() {
    return this.board.phase == BoardPhase.BATTLE_END
  }

  private endBattle(won: boolean) {
    this.events.emit(this.result = won ? BattleControllerEvent.PLAYER_WON : BattleControllerEvent.PLAYER_LOST);
    this.result = won ? 'win' : 'lose';
    this.board.phase = BoardPhase.BATTLE_END
    this.tmp = {};

    let loserView = won ? this.opponent : this.player;
    let loserData = won ? this.board.opponent : this.board.player;
    let loserBoard = won ? this.board.opponent.board : this.board.player.board;
    loserView.playDeathAnim();
    for (let i = 0; i < 3; i++) {
      let card = loserBoard[i];
      if (card) {
        this.scene.time.addEvent({
          delay: i * 400,
          callback: () => {
            this.removeCardFromBoard(card);
            this.onCardDeath(card, loserData);
          },
          callbackScope: this,
          loop: false,
          paused: false
        });
      }
    }

    let idx = 0;
    for (let card of this.board.player.hand) {
      idx++
      this.scene.time.addEvent({
        delay: idx * 200,
        callback: () => {
          this.removeCardFromHand(card, this.board.player.hand);
        },
        callbackScope: this,
        loop: false,
        paused: false
      });
    }
    idx++
    this.scene.time.addEvent({
      delay: idx * 200,
      callback: () => {
        this.hand.visible = false;
        this.details.visible = false;
      },
      callbackScope: this,
      loop: false,
      paused: false
    });
  }
}