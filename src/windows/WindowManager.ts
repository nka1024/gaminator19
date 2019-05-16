/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  nomads
* @license      Apache 2.0
*/

import { OkPopup } from "../windows/OkPopup";
import { MenuPanel } from "./MenuPanel";
import { ObjectsListPanel } from "./ObjectsListPanel";
import { ExportWindow } from "../windows/ExportWindow";
import { ToolsPanel } from "./ToolsPanel";
import { UnitsPanel } from "./UnitsPanel";
import { ContextMenuWindow } from "./ContextMenuWindow";
import { ZoomPanel } from "./ZoomPanel";
import { TargetListPanel } from "./TargetsListPanel";
import { ResourcesPanel } from "./ResourcesPanel";
import { MessageWindow } from "./MessageWindow";
import { DialogWindow } from "./DialogWindow";
import { DebugPanel } from "./DebugPanel";
import { MenuWindow } from "./MenuWindow";

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
    try {
      UnitsPanel.initialize();
      ContextMenuWindow.initialize();
      ZoomPanel.initialize();
      MessageWindow.initialize();
      DialogWindow.initialize();
      TargetListPanel.initialize();
      ResourcesPanel.initialize();
      DebugPanel.initialize();
      MenuWindow.initialize();
    } catch (e) {
      console.log('missing window')
    }
  }
}