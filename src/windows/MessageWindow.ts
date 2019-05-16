/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  nomads
* @license      Apache 2.0
*/

import { BaseWindow } from "./BaseWindow";

export class MessageWindow extends BaseWindow {
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

  public buttons: HTMLInputElement[] = [];

  constructor(title: string, message: string, shadow: boolean = false, image: string = null) {
    super();

    this.titleText = this.element.querySelector(".text_title");
    this.messageText = this.element.querySelector(".text_message");
    this.container = this.element.querySelector(".empty_container");
    this.container2 = this.element.querySelector(".empty_container2");
    this.imageElement = this.element.querySelector(".message_image");
    this.objList = this.element.querySelector(".obj_list");

    this.image = null;
    // this.top = 150;
    this.left = -1;
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

  public addButton(value: string, callback: () => void) {
    let buttonClass = 'submit_button' + this.buttons.length;
    let html = '<input class="btn btn-blue ' + buttonClass + '" id="submitButton" type="button" value="' + value + '" style="padding: 5px;"/>';
    let element = document.createElement('div');
    element.className = 'submit';
    element.innerHTML = html;
    let button: HTMLInputElement = element.querySelector("." + buttonClass);
    button.addEventListener('click', callback);
    this.buttons.push(button);
    this.objList.appendChild(element);
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
  protected getWindowName(): string { return "message_window" }
  protected getInnerHTML(): string { return MessageWindow.innerHtml }
  static initialize() {
    MessageWindow.innerHtml = BaseWindow.getPrefab(".message_window_prefab").innerHTML;
  }

}