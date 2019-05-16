/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  nomads
* @license      Apache 2.0
*/

import { ContextMenuWindow } from "../../windows/ContextMenuWindow";
import { GameobjectClicksModule } from "./GameobjectClicksModule";
import { TargetListPanel } from "../../windows/TargetsListPanel";
import { BaseUnit } from "../../actors/BaseUnit";
import { Point } from "../../types/Position";
import { OkPopup } from "../../windows/OkPopup";
import { MessageWindow } from "../../windows/MessageWindow";
import { UnitData, Hero } from "../../Hero";
import { CONST } from "../../const/const";

export class ContextMenuModule {

  // Public
  public onSummonClicked: (source: BaseUnit, conf: UnitData) => void;
  public onReconClicked: (object: BaseUnit) => void;
  public onReturnClicked: (object: BaseUnit) => void;
  public onMoveClicked: (object: BaseUnit) => void;

  public repairWindow: MessageWindow;
  public reactorWindow: MessageWindow;

  // Private
  private contextWindow: ContextMenuWindow;

  // Dependencies 
  private scene: Phaser.Scene;
  private hero: Hero;
  private clicksTracker: GameobjectClicksModule;

  constructor(scene: Phaser.Scene, hero: Hero, clicksTracker: GameobjectClicksModule) {
    this.scene = scene;
    this.hero = hero;
    this.clicksTracker = clicksTracker;
    this.clicksTracker.on('click', (object: BaseUnit) => {
      this.handleClick(object);
    });
  }


  // Public

  public update() {
    if (!this.scene) {
      return;
    }
    // close context window if clicked outside of it
    if (this.scene.input.activePointer.justDown && !this.clicksTracker.objectClickedInThisFrame) {
      this.destroyContextWindow();
    }
  }

  public get isContextWindowActive(): boolean {
    return this.contextWindow != null;
  }

  // Private

  private handleClick(object: BaseUnit) {
    // if (!this.targetList.isTargeted(object)) {
    let currentObj = null;
    if (this.contextWindow) {
      currentObj = this.contextWindow.object;
      this.destroyContextWindow();
    }

    if (object.selection.isHard && object != currentObj) {
      this.showContextWindowForObject(object);
    }
  }

  private worldToScreen(p: Point): Point {
    let camera = this.scene.cameras.main;
    let x = (p.x - camera.midPoint.x) * camera.zoom;
    let y = (p.y - camera.midPoint.y) * camera.zoom;
    let halfW = camera.width / 2;
    let halfH = camera.height / 2;

    return { x: halfW + x, y: halfH + y };
  }

  private showContextWindowForObject(object: BaseUnit) {
    this.destroyContextWindow();
    
    if (this.contextWindow) {
      this.contextWindow.object = object;

      this.contextWindow.onDestroy = (w) => {
        this.contextWindow = null
      };
      this.contextWindow.show();
    }
    this.scene.input.activePointer.isDown = false;
  }

  private makeEnemySquadWindow(object: BaseUnit): ContextMenuWindow {
    let buttons = ["Scout"];
    let p = this.worldToScreen(object);
    let window = new ContextMenuWindow(p.x - ContextMenuWindow.defaultWidth / 2, p.y + 16, buttons);
    window.buttons[0].addEventListener('click', () => {
      if (this.onReconClicked) {
        this.onReconClicked(object);
      }
    });
    return window;
  }

  
  private destroyContextWindow() {
    if (this.contextWindow != null) {
      this.contextWindow.show();
      this.contextWindow.destroy();
      this.contextWindow = null;
    }
  }

  public destroy() {
    this.destroyContextWindow();
    this.scene = null;
    this.hero = null;
    this.clicksTracker = null;

    this.onMoveClicked = null;
    this.onReconClicked = null;
    this.onReturnClicked = null;
    this.onSummonClicked = null;
  }

}