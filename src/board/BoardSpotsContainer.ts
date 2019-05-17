/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  gaminator 19
*/

import { Scene } from "phaser";
import { BoardSpot } from "./BoardSpot";
import { CardData, Point } from "../types/Types";

export class BoardSpotsContainer extends Phaser.GameObjects.Container {
  private topRow: BoardSpot[] = [];
  private bottomRow: BoardSpot[] = [];

  private cursorRow: number = 1;
  private cursorCol: number = 0;

  private cursor: Phaser.GameObjects.Image;
  private cords: Point[][] = [
    [{ x: 112, y: 112 }, { x: 172, y: 112 }, { x: 227, y: 112 }],
    [{ x: 115, y: 170 }, { x: 173, y: 170 }, { x: 231, y: 170 }]
  ];

  constructor(scene: Scene) {
    super(scene);

    this.cursor = new Phaser.GameObjects.Image(scene, 0, 0, 'cursor_spot');
    this.add(this.cursor);
    this.deselect();
  }

  public deselect() {
    this.cursor.visible = false;
  }
  public select(row: number, col: number) {
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
    this.select(this.cursorRow, this.cursorCol + x);
  }

  public putCard(row: number, col: number, card: CardData) {

  }
}