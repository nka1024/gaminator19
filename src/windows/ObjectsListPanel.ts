import { BaseWindow } from "./BaseWindow";
import { ASSETS } from "../AssetsLoader";

/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  nomads
* @license      Apache 2.0
*/

export class ObjectsListPanel extends BaseWindow {
    // static
    static innerHtml:string;

    // public
    public onObjectClick:Function;
    public filenamePrefix:string;

    public ambientButton:HTMLInputElement;
    public floraButton:HTMLInputElement;
    public devicesButton:HTMLInputElement;

    // private 

    private objContainer:HTMLElement;

    private itemWidth:number;
    private itemHeight:number;
    private maxIdx:number
    private objects:Array<HTMLElement> = [];
    
    constructor(filenamePrefix:string, maxIdx:number, itemWidth:number, itemHeight:number) {
        super();

        this.filenamePrefix = filenamePrefix;
        this.itemWidth = itemWidth;
        this.itemHeight = itemHeight;
        this.maxIdx = maxIdx;

        this.objContainer = this.element.querySelector(".obj_list");
        this.ambientButton = this.element.querySelector(".ambient_button");
        this.floraButton = this.element.querySelector(".flora_button");
        this.devicesButton = this.element.querySelector(".devices_button");
        this.populate()
        // this.removeAll();
    
        this.ambientButton.addEventListener('click', () => {
            this.filenamePrefix = 'ambient';
            this.maxIdx = ASSETS.AMBIENT_MAX;
            this.repopulate();
        });
        this.devicesButton.addEventListener('click', () => {
            this.filenamePrefix = 'device';
            this.maxIdx = ASSETS.DEVICES_MAX;
            this.repopulate();
        });
        this.floraButton.addEventListener('click', () => {
            this.filenamePrefix = 'grass';
            this.maxIdx = ASSETS.GRASS_MAX;
            this.repopulate();
        });
    }

    private repopulate() {
        this.removeAll();
        this.populate();
    }
     
    private removeAll() {
        for (let object of this.objects) {
            this.objContainer.removeChild(object);
        }
        this.objects = []
    }

    private populate() {
        for(let idx = 1; idx <= this.maxIdx; idx++) {
            let filename = this.filenamePrefix + '_' + idx + '.png';
            let element = document.createElement('input');
            // element.className = "btn btn-blue";
            element.style.width = this.itemWidth + 'px';
            element.style.height = this.itemHeight + 'px';
            element.style.verticalAlign = "middle";
            element.type = "button";
            element.style.background = 'rgba(184,176,33,1) url(/assets/gaminator/map_objects/'+filename+') no-repeat center';
            element.style.marginRight = '5px';
            element.addEventListener('click', ()=>{
                if (this.onObjectClick) {
                    this.onObjectClick(idx)
                }
            });
            
            this.objContainer.appendChild(element);
            this.objects.push(element);
        }
    }

    // Window HTML properties
    protected getWindowName(): string { return "objects_list_window" }
    protected getInnerHTML(): string  { return ObjectsListPanel.innerHtml }
    static initialize() {
        ObjectsListPanel.innerHtml = BaseWindow.getPrefab(".objects_list_window_prefab").innerHTML;
    }
}