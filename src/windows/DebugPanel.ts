/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  gaminator 19
* @license      Apache 2.0
*/

import { BaseWindow } from "./BaseWindow";
import { Scene } from "phaser";
import { CONST } from "../const/const";

export class DebugPanel extends BaseWindow {
  // static
  static innerHtml: string;

  // public
  public titleText: HTMLElement;
  public volumeText: HTMLElement;

  private time: number = 0; // sec
  private maxTime: number = 1140; // sec

  constructor(private scene: Scene) {
    super();

    this.titleText = this.element.querySelector(".text_title");
    this.volumeText = this.element.querySelector(".text_volume");
    
    this.startDataSyncLoop();
  }

  private dataSyncIntervalHandler: any;
  private startDataSyncLoop() {
    this.dataSyncIntervalHandler = setInterval(() => {
      this.dataSync()
      this.time += 0.1
    }, 100);
  }

  private stopDataSyncLoop() {
    clearInterval(this.dataSyncIntervalHandler);
  }

  private getTimerValue(): string {
    let minutes = Math.floor(this.time/60);
    let seconds = Math.floor(this.time - minutes * 60);
    let min = minutes < 10 ? '0' + minutes : minutes.toString();
    let sec = seconds < 10 ? '0' + seconds : seconds.toString();
    return min + ':' + sec;
  }

  private dataSync() {
    if (CONST.SHOW_TIMER) {
      this.titleText.innerHTML = this.getTimerValue();
    }
    if (CONST.SHOW_FPS) {
      this.volumeText.innerHTML = (Math.round(this.scene.game.loop.actualFps * 10)/10).toString();
    }
  }

  public destroy() {
    this.stopDataSyncLoop();
    super.destroy();
  }

  // Window HTML properties
  protected getWindowName(): string { return "debug_panel" }
  protected getInnerHTML(): string { return DebugPanel.innerHtml }
  static initialize() {
    DebugPanel.innerHtml = BaseWindow.getPrefab(".debug_panel_prefab").innerHTML;
  }

}