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

  constructor(scene: Scene) {
    super(scene);
    this.cursor = new Phaser.GameObjects.Image(scene, 0,0, 'cursor_hand');
    this.cursor.setOrigin(0,0)
    this.cursor.y = -11;
    this.add(this.cursor);
    
    this.setCursorHidden(false)
  }

  public addCard(card: CardDisplay) {
    card.x = this.cards.length * 22;
    this.cards.push(card);
    this.add(card);
    this.bringToTop(this.cursor)
  }

  public setCursorHidden(hidden: boolean) {
    this.cursor.visible = !hidden;
    this.cursor.x = 0;
  }

  public moveCursor(x: number) {
    if (this.cursor.x == 0 && x == -1) {
      return
    }
    if (this.cursor.x == (this.cards.length - 1) * 22 && x == 1) {
      return
    }
    this.cursor.x += x * 22;
  }

  update() {
    for (let card of this.cards) {
      card.update();
    }
  }
}