/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  gaminator 19
*/

import { Scene } from "phaser";
import { CardDisplay } from "./CardDisplay";

export class HandDisplay extends Phaser.GameObjects.Container {

  private cards: CardDisplay[] = []
  private cursor: Phaser.GameObjects.Image;
  public cursorPos: number = 0;
  public events: Phaser.Events.EventEmitter;

  public inputEnabled: boolean = false;
  constructor(scene: Scene) {
    super(scene);

    this.events = new Phaser.Events.EventEmitter();

    this.cursor = new Phaser.GameObjects.Image(scene, 0,0, 'cursor_hand');
    this.cursor.setOrigin(0,0)
    this.cursor.y = -11;
    this.add(this.cursor);
    this.setCursorHidden(true)
  }

  public addCard(card: CardDisplay) {
    card.x = this.cards.length * 22;
    this.cards.push(card);
    this.add(card);
    this.bringToTop(this.cursor)
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

  private shiftRemainingCards() {
    let i = 0
    for (let card of this.cards) {
      card.x = i * 22;
      i++
    }
  }

  public setCursorHidden(hidden: boolean) {
    this.cursor.visible = !hidden;
    this.cursor.x = 0;
    this.cursorPos = 0;
  }

  public putCursor(pos: number) {
    this.cursorPos = pos;
    this.cursor.x = pos * 22;

    if (this.cards.length > 0){
      this.events.emit('card_select', this.cards[this.cursorPos]);
    }
  }
  public moveCursor(x: number) {
    if (this.cursorPos == 0 && x == -1) {
      return
    }
    if (this.cursorPos == this.cards.length - 1 && x == 1) {
      return
    }
    this.putCursor(this.cursorPos + x);
  }

  update() {
    for (let card of this.cards) {
      card.update();
    }
  }
}