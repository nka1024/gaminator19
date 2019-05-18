/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  gaminator 19
*/

import { Scene } from "phaser";
import { BoardSpot } from "./BoardSpot";
import { CardData, Point } from "../types/Types";

export class BoardSpotsContainer extends Phaser.GameObjects.Container {
  private spots: BoardSpot[][] = [[], []];

  private cursorRow: number = 1;
  private cursorCol: number = 0;

  private cursor: Phaser.GameObjects.Image;
  private cords: Point[][] = [
    [{ x: 113, y: 110 }, { x: 171, y: 112 }, { x: 228, y: 110 }],
    [{ x: 117, y: 168 }, { x: 176, y: 168 }, { x: 233, y: 168 }]
  ];

  public getCursorCol(): number {
    return this.cursorCol;
  }

  constructor(scene: Scene) {
    super(scene);

    this.cursor = new Phaser.GameObjects.Image(scene, 0, 0, 'cursor_spot');
    this.add(this.cursor);
    this.setCursorHidden(true);

    for (let i = 0; i < this.cords.length; i++) {
      for (let j = 0; j < this.cords[i].length; j++) {
        let spot = new BoardSpot(scene);
        spot.x = this.cords[i][j].x;
        spot.y = this.cords[i][j].y + 10;
        this.add(spot);
        this.spots[i].push(spot);
      }
    }
  }

  public setCursorHidden(hidden: boolean) {
    this.cursor.visible = !hidden;
  }

  public putCursor(row: number, col: number) {
    this.cursorRow = row;
    this.cursorCol = col;
    this.cursor.visible = true;
    this.cursor.x = this.cords[row][col].x
    this.cursor.y = this.cords[row][col].y
  }

  public moveCursor(x: number, y: number = 0) {
    if (this.cursorCol == 0 && x == -1) {
      return
    }
    if (this.cursorCol == this.cords[0].length - 1 && x == 1) {
      return
    }
    this.putCursor(this.cursorRow, this.cursorCol + x);
  }
  
  public putCardAtCursor(card: CardData) {
    this.spots[this.cursorRow][this.cursorCol].populate(card);
  }

  public getCardAtCursor(): CardData {
    return this.spots[this.cursorRow][this.cursorCol].card;
  }

  public putCard(row: number, col: number, card: CardData) {
    this.spots[row][col].populate(card);
  }

  public refresh() {
    for (let i = 0; i < this.cords.length; i++) {
      for (let j = 0; j < this.cords[i].length; j++) {
        this.spots[i][j].repopulate();
      }
    }
  }
}