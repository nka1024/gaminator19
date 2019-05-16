/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  gaminator 19
*/

import { Scene } from "phaser";
import { CardDisplay } from "./CardDisplay";

export class HandDisplay extends Phaser.GameObjects.Container {

  private cards: CardDisplay[] = []

  constructor(scene: Scene) {
    super(scene);
  }

  public addCard(card: CardDisplay) {
    card.x = this.cards.length * 22;
    this.cards.push(card);
    this.add(card);
  }
}