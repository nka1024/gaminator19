/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  gaminator 19
* @license      Apache 2.0
*/

import { BaseWindow } from "./BaseWindow";

export enum TriggerPanelTool {
  Mark = 0,
  Select
}
export class TriggersPanel extends BaseWindow {
    // static
    static innerHtml:string;

    // public
    public onObjectClick:Function;
    public filenamePrefix:string;

    public markButton:HTMLInputElement;
    public selectButton:HTMLInputElement;
    public nameInput:HTMLInputElement;
    public typeInput:HTMLInputElement;

    public tool: TriggerPanelTool = TriggerPanelTool.Mark;
    // private 

    private objContainer:HTMLElement;

    
    constructor() {
        super();

        this.objContainer = this.element.querySelector(".obj_list");
        this.markButton = this.element.querySelector(".mark_button");
        this.selectButton = this.element.querySelector(".select_button");
        this.nameInput = this.element.querySelector(".name_input");
        this.typeInput = this.element.querySelector(".type_input");
        this.populate()
        // this.removeAll();
    
        this.markButton.addEventListener('click', () => {
            this.tool = TriggerPanelTool.Mark
            console.log('trigger tool: mark')
        });
        this.selectButton.addEventListener('click', () => {
          this.tool = TriggerPanelTool.Select
          console.log('trigger tool: select')
      });   
    }

     

    private populate() {
        
    }

    // Window HTML properties
    protected getWindowName(): string { return "triggers_window" }
    protected getInnerHTML(): string  { return TriggersPanel.innerHtml }
    static initialize() {
      TriggersPanel.innerHtml = BaseWindow.getPrefab(".triggers_window_prefab").innerHTML;
    }
}