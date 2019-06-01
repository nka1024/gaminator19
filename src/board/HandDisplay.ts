/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  gaminator 19
*/

import { Scene } from "phaser";
import { CardDisplay } from "./CardDisplay";

export class HandDisplay extends Phaser.GameObjects.Container {

  private cards: CardDisplay[] = []
  // need to keep deleted cards here for update() to handle mask correctly
  private tweenedCards: CardDisplay[] = []; 

  private cursor: Phaser.GameObjects.Sprite;
  private nextPhase: Phaser.GameObjects.Image;
  public cursorPos: number = 0;
  public events: Phaser.Events.EventEmitter;

  public inputEnabled: boolean = false;
  constructor(scene: Scene) {
    super(scene);

    this.events = new Phaser.Events.EventEmitter();

    this.cursor = new Phaser.GameObjects.Sprite(scene, 0, 0, '');
    this.cursor.setOrigin(0, 0)
    this.cursor.play('cursor_hand_anim')
    this.cursor.y = -18;
    scene.add.existing(this.cursor);
    this.add(this.cursor);

    this.nextPhase = new Phaser.GameObjects.Image(scene, 0, 0, 'next_phase');
    this.nextPhase.setOrigin(0, 0)
    this.nextPhase.y = 32;
    this.add(this.nextPhase);

    this.setCursorHidden(true);
  }

  public cleanup() {
    while (this.cards.length > 0) {
      let card = this.cards.shift();
      this.remove(card);
      card.destroy();
    }
    this.cursorPos = 0
    this.setCursorHidden(true);
  }

  public addCard(card: CardDisplay, delay: number) {
    let finalX = this.cards.length * 22;
    card.x = this.cards.length * 22;
    // card.x = finalX + 200;
    card.y = 200
    card.alpha = 0;
    this.cards.push(card);
    this.add(card);
    this.bringToTop(this.cursor)

    this.shiftNextPhase();

    this.scene.tweens.add({
      targets: card,
      y: 0,
      alpha: 1,
      duration: 1000,
      ease: 'Elastic',
      easeParams: [0.5, 0.5],
      delay: delay
    });
  }

  public cardAtCursor(): CardDisplay {
    return this.cards[this.cursorPos];
  }

  public removeCardAtCursor() {
    let card = this.cards[this.cursorPos];
    this.cards.splice(this.cards.indexOf(card), 1);

    this.tweenedCards.push(card);
    this.putCursor(0);

    this.scene.tweens.add({
      targets: card,
      x: -30,
      duration: 1000,
      ease: 'Elastic',
      easeParams: [0.5, 0.5],
      delay: 0
    });

    this.scene.tweens.add({
      targets: card,
      y: -100,
      alpha: 0,
      duration: 1000,
      ease: 'Power3',
      easeParams: [0.5, 0.5],
      delay: 700,
      onComplete: () => {
        this.tweenedCards.splice(this.tweenedCards.indexOf(card), 1);
        this.remove(card);
        card.destroy();
      }
    });


    if (this.cards.length == 0) {
      // this.setCursorHidden(true);
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
    this.shiftNextPhase();
  }

  private shiftNextPhase() {
    this.nextPhase.x = this.cards.length * 22 - 2;
  }

  public setCursorHidden(hidden: boolean) {
    this.cursor.visible = !hidden;
    this.cursor.x = 0;
    this.cursorPos = 0;

    this.nextPhase.visible = !hidden;
  }

  public putCursor(pos: number) {
    this.cursorPos = pos;
    this.cursor.x = pos * 22;

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
    if (this.cursorPos >= this.cards.length && x == 1) {
      return
    }
    this.putCursor(this.cursorPos + x);
  }

  update() {
    for (let card of this.cards) {
      card.update();
    }

    for (let tweenedCard of this.tweenedCards) {
      tweenedCard.update();
    }
  }
}