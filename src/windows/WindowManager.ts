/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  gaminator 19
* @license      Apache 2.0
*/

import { OkPopup } from "../windows/OkPopup";
import { MenuPanel } from "./MenuPanel";
import { ObjectsListPanel } from "./ObjectsListPanel";
import { ExportWindow } from "../windows/ExportWindow";
import { ToolsPanel } from "./ToolsPanel";
import { DebugPanel } from "./DebugPanel";
import { TriggersPanel } from "./TriggersPanel";

export class WindowManager {

  private static initialized: Boolean = false;
  public static initialize() {
    if (this.initialized) {
      return;
    }
    this.initialized = true;
    
    OkPopup.initialize();
    MenuPanel.initialize();
    ObjectsListPanel.initialize();
    ExportWindow.initialize();
    ToolsPanel.initialize();
    TriggersPanel.initialize();
    try {
      DebugPanel.initialize();
    } catch (e) {
      console.log('missing window')
    }
  }
}