/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  nomads
* @license      Apache 2.0
*/

import { BaseWindow } from "./BaseWindow";

export class MenuWindow extends BaseWindow {
  // static
  static innerHtml: string;

  // public

  public container: HTMLElement;
  public container2: HTMLElement;

  public fullscreenButton: HTMLInputElement;
  public windowButton: HTMLInputElement;
  public exitButton: HTMLInputElement;
  public restartButton: HTMLInputElement;
  public cameraButton: HTMLInputElement;

  constructor() {
    super();

    this.container = this.element.querySelector(".empty_container");
    this.container2 = this.element.querySelector(".empty_container2");

    this.fullscreenButton = this.element.querySelector(".fullscreen_button");
    this.windowButton = this.element.querySelector(".window_button");
    this.exitButton = this.element.querySelector(".exit_button");
    this.restartButton = this.element.querySelector(".restart_button");
    this.cameraButton = this.element.querySelector(".camera_button");
    
    // this.top = 150;
    this.left = -1;

    this.element.style.position = 'absolute';
    this.element.style.width = '100%';
    this.element.style.height = '100%';
    this.element.style.margin = 'auto';
  }
  
  public set top(value: number) {
    if (value != -1) {
      this.container2.style.top = value + 'px';
      this.container2.style.bottom = 'auto';
      this.element.style.position = '';
      this.element.style.width = '';
      this.element.style.height = '';
      this.element.style.margin = '';
    } else {
      this.container2.style.top = '0px';
      this.container2.style.bottom = '0px';
    }
  }

  public set left(value: number) {
    if (value != -1) {
      this.container.style.left = value + 'px';
      this.container.style.right = 'auto';
    } else {
      this.container.style.left = '0px';
      this.container.style.right = '0px';
    }
  }
  // Window HTML properties
  protected getWindowName(): string { return "menu_window" }
  protected getInnerHTML(): string { return MenuWindow.innerHtml }
  static initialize() {
    MenuWindow.innerHtml = BaseWindow.getPrefab(".menu_window_prefab").innerHTML;
  }

}