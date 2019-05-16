/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  nomads
* @license      Apache 2.0
*/

import { BaseWindow } from "./BaseWindow";

export class DialogWindow extends BaseWindow {
  // static
  static innerHtml: string;

  // public
  public owner: any;

  public okButton: HTMLElement;
  public titleText: HTMLElement;
  public messageText: HTMLElement;
  public container: HTMLElement;
  public container2: HTMLElement;
  public imageElement: HTMLElement;
  private objList: HTMLElement;
  public button: HTMLInputElement;

  public buttons: HTMLInputElement[] = [];

  public onComplete: () => void;
  constructor(title: string, message: string, shadow: boolean = false, image: string = null) {
    super();

    this.titleText = this.element.querySelector(".text_title");
    this.messageText = this.element.querySelector(".text_message");
    this.container = this.element.querySelector(".empty_container");
    this.container2 = this.element.querySelector(".empty_container2");
    this.imageElement = this.element.querySelector(".message_image");
    this.objList = this.element.querySelector(".obj_list");

    this.button = this.element.querySelector(".submit_button0");

    this.button.addEventListener('click', () => { 
      if (this.onComplete) {
        this.onComplete();
      }

      this.destroy();
    });
    this.image = image;
    this.titleText.innerHTML = title;
    this.messageText.innerHTML = message;

    this.element.style.position = 'absolute';
    this.element.style.width = '100%';
    this.element.style.height = '100%';
    this.element.style.margin = 'auto';

    if (!shadow) {
      this.container.style.backgroundColor = "";
    }
  }

  public set image(value: string) {
    if (value == null) {
      this.imageElement.style.background = "";
      this.imageElement.style.display = "none";
    } else {
      this.imageElement.style.background = "url('/assets/"+ value +".png') center center no-repeat rgb(49, 51, 53)"
      this.imageElement.style.display = "block";
    }
  }

  // Window HTML properties
  protected getWindowName(): string { return "dialog_window" }
  protected getInnerHTML(): string { return DialogWindow.innerHtml }
  static initialize() {
    DialogWindow.innerHtml = BaseWindow.getPrefab(".dialog_window_prefab").innerHTML;
  }

}