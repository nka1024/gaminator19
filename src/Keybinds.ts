/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  Tecnho Nomads: gameplay prototype
*/

import { Scene } from "phaser";

export enum KeybindType {
  UI, Cursor
}

export class Keybinds {

  private escapeKey: Phaser.Input.Keyboard.Key;
  private enter: Phaser.Input.Keyboard.Key;
  private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  public events: Phaser.Events.EventEmitter;

  constructor (scene: Scene) {
    this.events = new Phaser.Events.EventEmitter();

    this.cursorKeys = scene.input.keyboard.createCursorKeys();
    this.escapeKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.enter = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    
    scene.events.addListener('update', this.update.bind(this))
  }

  private update() {
    if (this.escapeKey.isDown) { this.escapeKey.isDown = false; this.dispatchKeypress('esc', KeybindType.UI) }
    if (this.enter.isDown) { this.enter.isDown = false; this.dispatchKeypress('enter', KeybindType.UI) }
    if (this.cursorKeys.down.isDown) { this.cursorKeys.down.isDown = false; this.dispatchKeypress('down', KeybindType.Cursor) }
    if (this.cursorKeys.up.isDown) { this.cursorKeys.up.isDown = false; this.dispatchKeypress('up', KeybindType.Cursor) }
    if (this.cursorKeys.left.isDown) { this.cursorKeys.left.isDown = false; this.dispatchKeypress('left', KeybindType.Cursor) }
    if (this.cursorKeys.right.isDown) { this.cursorKeys.right.isDown = false; this.dispatchKeypress('right', KeybindType.Cursor) }
  }

  private dispatchKeypress(keypress: string, type: KeybindType) {
    this.events.emit('keypress', keypress, type);
  }


}