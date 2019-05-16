/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  nomads
* @license      Apache 2.0
*/

import { BaseWindow } from "./BaseWindow";
import { Hero } from "../Hero";

export class ResourcesPanel extends BaseWindow {
  // static
  static innerHtml: string;

  // public
  public titleText: HTMLElement;
  public volumeText: HTMLElement;

  private hero: Hero;

  constructor() {
    super();

    this.titleText = this.element.querySelector(".text_title");
    this.volumeText = this.element.querySelector(".text_volume");
    
    this.startDataSyncLoop();
  }

  public populate(hero: Hero) {
    this.hero = hero;
  }

  private dataSyncIntervalHandler: any;
  private startDataSyncLoop() {
    this.dataSyncIntervalHandler = setInterval(() => {
      this.dataSync()
    }, 500);
  }

  private stopDataSyncLoop() {
    clearInterval(this.dataSyncIntervalHandler);
  }

  private dataSync() {
    if (this.hero) {
      this.volumeText.innerHTML = this.hero.resources.toString();
    } else {
      this.volumeText.innerHTML = '0';
    }
  }

  public destroy() {
    this.stopDataSyncLoop();
    super.destroy();
  }

  // Window HTML properties
  protected getWindowName(): string { return "resources_panel" }
  protected getInnerHTML(): string { return ResourcesPanel.innerHtml }
  static initialize() {
    ResourcesPanel.innerHtml = BaseWindow.getPrefab(".resources_panel_prefab").innerHTML;
  }

}