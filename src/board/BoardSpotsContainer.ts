/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  gaminator 19
*/

import { Scene } from "phaser";
import { BoardSpot } from "./BoardSpot";
import { CardData, Point } from "../types/Types";

export class BoardSpotsContainer extends Phaser.GameObjects.Container {
  public events: Phaser.Events.EventEmitter;

  private spots: BoardSpot[][] = [[], []];

  private cursorRow: number = 1;
  private cursorCol: number = 0;

  private cursor: Phaser.GameObjects.Sprite;
  private nextPhase: Phaser.GameObjects.Image;
  private nextPhaseSelected: Phaser.GameObjects.Image;
  private cords: Point[][] = [
    [{ x: 117 - 50, y: 96}, { x: 125+22, y: 96 }, { x: 205+23, y: 96 }],
    [{ x: 117 - 50, y: 173}, { x: 125+24, y: 173 }, { x: 205+24, y: 173 }]
  ];

  public getCursorCol(): number {
    return this.cursorCol;
  }

  public getCursorRow(): number {
    return this.cursorRow;
  }

  constructor(scene: Scene) {
    super(scene);

    this.events = new Phaser.Events.EventEmitter();

    this.cursor = new Phaser.GameObjects.Sprite(scene, 0, 0, 'cursor_spot_anim');
    this.cursor.play('cursor_spot_anim');
    this.add(this.cursor);
    this.scene.add.existing(this.cursor);

    this.nextPhase = new Phaser.GameObjects.Image(scene, 284, 150, 'next_phase');
    this.add(this.nextPhase);
    this.nextPhaseSelected = new Phaser.GameObjects.Image(scene, 284, 150, 'next_phase_selected');
    this.add(this.nextPhaseSelected);
    this.nextPhaseSelected.visible = false;

    this.setCursorHidden(true);
    this.setNextPhaseHidden(true);

    for (let i = 0; i < this.cords.length; i++) {
      for (let j = 0; j < this.cords[i].length; j++) {
        let spot = new BoardSpot(scene, i == 0);
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

  public setNextPhaseHidden(hidden: boolean) {
    this.nextPhase.visible = !hidden;
    if (hidden)
      this.nextPhaseSelected.visible = false;
  }
  
  public getSpotForCard(card: CardData): BoardSpot {
    for (let i = 0; i < this.cords.length; i++) {
      for (let j = 0; j < this.cords[i].length; j++) {
        if (this.spots[i][j].card == card)
          return this.spots[i][j]
      }
    }
  }

  public putCursor(row: number, col: number, color: string) {
    if (color) {
      if (color == 'red') {
        this.cursor.play('cursor_spot_red_anim')
      } else {
        this.cursor.play('cursor_spot_anim')
      }
  }

    this.cursorRow = row;
    this.cursorCol = col;

    if (col < this.cords[row].length) {
      this.nextPhaseSelected.visible = false;
      this.cursor.visible = true;
      this.cursor.x = this.cords[row][col].x
      this.cursor.y = this.cords[row][col].y
    } else {
      this.cursor.visible = false;
      this.nextPhaseSelected.visible = true;
    }
    if (this.cursorCol <= this.cords[0].length) {
      this.events.emit('spot_select', this.getCardAtCursor());
    }
  }

  public moveCursor(x: number, y: number = 0) {
    if (this.cursorCol == 0 && x == -1) {
      return
    }

    if (this.cursorCol == this.cords[0].length - 1 && x == 1) {
      if (!this.nextPhase.visible)
        return;
      
    }
    if (this.cursorCol == this.cords[0].length && x == 1) {
      return
    }

    if (this.cursorRow == 0 && y == -1) {
      return
    }
    if (this.cursorRow == 1 && y == 11) {
      return
    }
    this.putCursor(this.cursorRow + y, this.cursorCol + x, null);
  }
  
  public putCardAtCursor(card: CardData) {
    this.putCard(this.cursorRow, this.cursorCol, card);
  }

  public getSpot(row: number, col: number): BoardSpot {
    return this.spots[row][col];
  }

  public isCursorNextPhase() {
    return this.cursorCol == 3;
  }
  public getCardAtCursor(): CardData {
    if (this.cursorRow < this.spots.length && this.cursorCol < this.spots[this.cursorRow].length) {
      return this.spots[this.cursorRow][this.cursorCol].card;
    } else {
      return null;
    }
  }

  public attack(row: number, col: number, directon: number, short: boolean) {
    if (row < this.spots.length && col < this.spots[row].length) {
      this.spots[row][col].attack(directon, short);
    }
  }

  public putCard(row: number, col: number, card: CardData) {
    if (row < this.spots.length && col < this.spots[row].length) {
      this.spots[row][col].populate(card);

      this.events.emit('spot_populated', card);
    }
  }

  public swapCards(cardA: CardData, cardB: CardData) {
    let spotA = this.getSpotForCard(cardA)
    let spotB = this.getSpotForCard(cardB)
    spotA.populate(cardB);
    spotB.populate(cardA);
    this.events.emit('spot_populated', cardA);
  }

  public refresh() {
    for (let i = 0; i < this.cords.length; i++) {
      for (let j = 0; j < this.cords[i].length; j++) {
        this.spots[i][j].repopulate();
      }
    }
  }

  public cleanup() {
    for (let i = 0; i < this.spots.length; i++) {
      for (let j = 0; j < this.spots[i].length; j++) {
        let spot = this.spots[i][j]
        spot.populate(null);
      }
    }
  }
}