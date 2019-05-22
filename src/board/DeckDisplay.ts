/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  gaminator 19
*/

import { Scene } from "phaser";
import { CardDisplay } from "./CardDisplay";
import { CardData } from "../types/Types";

export class DeckDisplay extends Phaser.GameObjects.Container {

  private cards: CardDisplay[] = []
  private cursor: Phaser.GameObjects.Sprite;
  // private nextPhase: Phaser.GameObjects.Image;
  public cursorPos: number = 0;
  public events: Phaser.Events.EventEmitter;

  public inputEnabled: boolean = false;
  constructor(scene: Scene) {
    super(scene);

    this.events = new Phaser.Events.EventEmitter();

    this.cursor = new Phaser.GameObjects.Sprite(scene, 0, 0, '');
    this.cursor.setOrigin(0,0)
    this.cursor.play('cursor_hand_anim')
    this.cursor.y = -18;
    scene.add.existing(this.cursor);
    this.add(this.cursor);

    // this.nextPhase = new Phaser.GameObjects.Image(scene, 0, 0, 'next_phase');
    // this.nextPhase.setOrigin(0,0)
    // this.nextPhase.y = 32;
    // this.add(this.nextPhase);

    this.setCursorHidden(true);
  }

  public cleanup() {
    while(this.cards.length > 0) {
      let card = this.cards.shift();
      this.remove(card);
      card.destroy();
    }
    this.cursorPos = 0
    this.setCursorHidden(true);
  }

  public addCard(card: CardDisplay) {
    card.x = this.cards.length * 20;
    this.cards.push(card);
    this.add(card);
    this.bringToTop(this.cursor)

    // this.shiftNextPhase();
  }

  public removeCardAtCursor() {
    let card = this.cards[this.cursorPos];
    this.cards.splice(this.cards.indexOf(card), 1);
    this.remove(card);
    card.destroy();
    this.putCursor(0);

    if (this.cards.length == 0) {
      this.setCursorHidden(true);
      this.events.emit('card_select', null);
    }
    this.shiftRemainingCards();
  }

  public getCardAtCursor() {
    return this.cards[this.cursorPos];
  }

  private shiftRemainingCards() {
    let i = 0
    for (let card of this.cards) {
      card.x = i * 20;
      i++
    }
    // this.shiftNextPhase();
  }

  public getFreeView():CardDisplay {
    for (let card of this.cards) {
      if (!card.card) {
        return card
      }
    }
    return null;
  }

  // private shiftNextPhase() {
  //   this.nextPhase.x = this.cards.length * 22 - 2;
  // }

  public setCursorHidden(hidden: boolean) {
    this.cursor.visible = !hidden;
    // this.cursor.x = 0;
    // this.cursorPos = 0;

    // this.nextPhase.visible = !hidden;
  }

  public putCursor(pos: number) {
    this.cursorPos = pos;
    this.cursor.x = pos * 20;

    let selected = null
    if (pos < this.cards.length) {
      selected = this.cards[this.cursorPos]
    }
    this.events.emit('card_select', selected);
  }

  public moveCursor(x: number) {
    if (this.cursorPos == 0 && x == -1) {
      return
    }
    if (this.cursorPos >= this.cards.length - 1 && x == 1) {
      return
    }
    this.putCursor(this.cursorPos + x);
  }

  public getAllCardData(): CardData[] {
    let result: CardData[] = []
    for (let view of this.cards) {
      if (view.card) result.push(view.card);
    }
    return result;
  }
  update() {
    for (let card of this.cards) {
      card.update();
    }
  }
}