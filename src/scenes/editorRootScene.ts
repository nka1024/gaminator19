/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  gaminator 19
* @license      Apache 2.0
*/

import { MenuPanel } from "../windows/MenuPanel";
import { ObjectsListPanel } from "../windows/ObjectsListPanel";
import { ExportWindow } from "../windows/ExportWindow";

import { WindowManager } from "../windows/WindowManager";
import { ASSETS, AssetsLoader } from "../AssetsLoader";
import { ToolsPanel } from "../windows/ToolsPanel";
import { TileGrid } from "../TileGrid";
import { UI_DEPTH } from "../const/const";
import { GameObjects } from "phaser";
import { Point } from "../types/Types";

export class EditorRootScene extends Phaser.Scene {

  private MAP_SCALE: number = 1;

  private grid: TileGrid;
  private objectsListPanel: ObjectsListPanel;
  private toolsPanel: ToolsPanel;
  private cursor: Phaser.GameObjects.Sprite;

  private tool: string = 'brush';
  private cachedCanvas: HTMLElement;

  constructor() {
    super({
      key: "EditorRootScene"
    });
  }

  preload() {
    AssetsLoader.preload(this);
  }

  create(data): void {
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      // Dmitry Radkovsky: querySelector по классу тяжеловесный, закешируй
      if (!this.cachedCanvas) this.cachedCanvas = document.querySelector(".canvas_main")
      // todo: check if gets fixed in >3.16.1
      if (pointer.event.target == this.cachedCanvas) {
        this.cursorTouchHandler();
        console.log('pointerdown');
      }
    });

    this.cameras.main.setBackgroundColor(0x1f1f1f);
    WindowManager.initialize();

    this.grid = new TileGrid(this);
    this.cursor = this.add.sprite(150, 150, "cursor");
    this.cursor.depth = UI_DEPTH.CURSOR;
    this.cursor.originX = 0.5;
    this.cursor.originY = 1;
    this.cursor.setInteractive();

    this.importMap(this.cache.json.get('map'));

    this.toolsPanel = new ToolsPanel();
    this.toolsPanel.show()

    let idx = 0;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        idx++;
        let texture = 'terrain_' + (idx < 10 ? '0' : '') + idx;
        console.log('texture');
        let ter = new Phaser.GameObjects.Image(this, 0, 0, texture);
        ter.setOrigin(0, 0);
        ter.x = j * 1024;
        ter.y = i * 1024;
        ter.depth = -Number.MAX_VALUE;
        this.add.existing(ter);
      }
    }

    var menu = new MenuPanel();
    menu.show();

    this.toolsPanel.eraseButton.addEventListener('click', () => {
      console.log('swtich tool to erase');
      this.tool = 'erase';
    });
    this.toolsPanel.brushButton.addEventListener('click', () => {
      this.tool = 'brush';
      console.log('swtich tool to brush');
    });
    this.toolsPanel.fillButton.addEventListener('click', () => {
      this.tool = 'fill';
      console.log('swtich tool to fill');
    });
    this.toolsPanel.lineButton.addEventListener('click', () => {
      this.tool = 'line';
      console.log('swtich tool to line');
    });
    // objects button
    menu.objectsButton.addEventListener('click', () => {
      if (this.objectsListPanel) {
        this.objectsListPanel.destroy();
        this.cursor.setTexture("cursor");
        // close if pressed again
        if (this.objectsListPanel.filenamePrefix.startsWith("tree")) {
          this.objectsListPanel = null;
          return;
        }
      }
      this.objectsListPanel = new ObjectsListPanel("grass", ASSETS.GRASS_MAX, 32, 32);
      this.objectsListPanel.onObjectClick = (idx: number) => {
        this.cursor.setTexture(this.objectsListPanel.filenamePrefix + "_" + idx);
      }
      this.objectsListPanel.show();
    })

    // grid button
    menu.gridButton.addEventListener('click', () => {
      this.grid.toggleGrid();
    });

    // terrain button
    menu.terrainButton.addEventListener('click', () => {
      if (this.objectsListPanel) {
        this.objectsListPanel.destroy()
        this.cursor.setTexture("cursor");
        // close if pressed again
        if (this.objectsListPanel.filenamePrefix.startsWith("terrain")) {
          this.objectsListPanel = null
          return
        }
      }
      this.objectsListPanel = new ObjectsListPanel("terrain", ASSETS.TERRAIN_MAX, 256, 256);
      this.objectsListPanel.onObjectClick = (idx: number) => {
        this.cursor.setTexture("terrain_" + idx);
      }
      this.objectsListPanel.show()
    });

    // export button
    menu.exportButton.addEventListener('click', () => {
      this.showExportWindow();
    });
  }

  private importMap(map: any) {
    // cleanup
    for (let child of this.children.getAll()) {
      // exclude cursor
      if ((child as Phaser.GameObjects.Image).depth != UI_DEPTH.CURSOR)
        child.destroy()
    }

    // create grid from config
    this.grid.import(map.grid);
    // create objects from config      
    for (let item of map.objects) {
      this.createObjectFromConfig(item);
    }
  }

  showExportWindow() {
    var w = new ExportWindow("EXPORT MAP DATA");
    w.show();
    w.populate(this.children.getAll(), this.grid.export());
    w.importButton.addEventListener('click', () => {
      let map = JSON.parse(w.getInputText());
      this.importMap(map);
    });
  }

  update(): void {
    this.cursorFollow();
    this.cameraDrag();

    if (this.grid) this.grid.update();
  }

  private cursorTouchHandler() {

    if (!this.grid.visible) {
      // object placement

      if (this.tool == 'brush') {
        if (this.objectsListPanel != null) {
          this.createObject();
          // randomize after object placed
          // this.cursor.setTexture("tree_" + this.getRandomInt(1, 9))
        }
      } else if (this.tool == 'erase') {
        console.log('erase');
        let objs = this.input.hitTestPointer(this.input.activePointer);
        console.log(objs);
        for (let obj of objs) {
          if (!(obj as GameObjects.Image).texture.key.startsWith('terrain'))
            obj.destroy();
        }
      }
    } else {
      // tile placement
      let points: Point[] = [];
      let cursor: Point = { x: this.cursor.x, y: this.cursor.y };
      let walkable = this.grid.isWalkable(this.grid.worldToGrid(this.cursor));
      if (this.tool == 'brush') {
        points.push(cursor);
      } else if (this.tool == 'fill') {
        points.push(cursor);
        // fill area of same color tiles
        let step = this.grid.tileSize; // move cursor by this value every step
        let c = { x: cursor.x, y: cursor.y }; // fill cursor
        let dX = 1; // horizontal direction
        let dY = 1; // vertical direction
        for (let i = 0; i < 100; i++) {
          c.x += step * dX
          if (this.grid.isWalkable(this.grid.worldToGrid(c)) == walkable) {
            points.push({ x: c.x, y: c.y });
          } else {
            c.x -= step * dX
            dX *= -1
            c.y += step * dY
            if (this.grid.isWalkable(this.grid.worldToGrid(c)) == walkable) {
              points.push({ x: c.x, y: c.y });
            } else {
              break;
            }
          }
        }
      }
      for (let point of points) {
        this.grid.editTile(point, walkable ? 'red' : 'green');
      }

      // for (let i = -2; i <= 2; i++)
      // for (let j = -2; j <= 2; j++)
      // this.grid.editTile({x: this.cursor.x + 32 * i, y: this.cursor.y + 32 * j}, walkable ? 'red' : 'green');
    }

  }

  private cursorFollow() {
    let worldPosX = Math.round(this.input.activePointer.x / 2) * 2;
    let worldPosY = Math.round(this.input.activePointer.y / 2) * 2;

    // snap cursor to grid or pixel perfect follow
    if (this.grid.visible) {
      this.grid.cursorFollow(this.cursor);
    } else {
      this.cursor.x = Math.round(worldPosX + this.cameras.main.scrollX);
      this.cursor.y = Math.round(worldPosY + this.cameras.main.scrollY);
    }
    this.cursor.scaleX = this.MAP_SCALE;
    this.cursor.scaleY = this.MAP_SCALE;
    this.toolsPanel.positionText.innerHTML = this.cursor.x + ':' + this.cursor.y;
    let tile = this.grid.getTileIJ(this.cursor);
    if (tile) {
      let walkable = tile.walkable ? 'free' : 'blocked';
      this.toolsPanel.statusText.innerHTML = tile.i + ':' + tile.j + ' ' + walkable;
    } else {
      this.toolsPanel.statusText.innerHTML = 'OFF GRID';
    }
  }

  private prevPointerX: number;
  private prevPointerY: number;
  private cameraDrag() {
    let ptr = this.input.activePointer;
    if (ptr.isDown) {
      if (!ptr.justDown) {
        this.cameras.main.scrollX -= (ptr.x - this.prevPointerX)
        this.cameras.main.scrollY -= (ptr.y - this.prevPointerY)
      }
      this.prevPointerX = ptr.x;
      this.prevPointerY = ptr.y
    }

    if (ptr.justUp) {
      this.prevPointerX = 0;
      this.prevPointerY = 0;
    }
  }

  private createObjectFromConfig(data: any) {
    let obj = new Phaser.GameObjects.Image(this, 0, 0, null);
    obj.scaleX = this.MAP_SCALE;
    obj.scaleY = this.MAP_SCALE;

    if (data.texture.startsWith('terrain')) {
      obj.originX = 0;
      obj.originY = 0;

    } else {
      obj.originX = 0.5;
      obj.originY = 1;
    }
    obj.setTexture(data.texture);
    obj.setInteractive();
    obj.x = data.x;
    obj.y = data.y;
    obj.depth = data.depth;
    this.add.existing(obj);
  }

  private createObject() {
    let obj = new Phaser.GameObjects.Image(this, 0, 0, null);
    obj.scaleX = this.cursor.scaleX;
    obj.scaleY = this.cursor.scaleY;
    obj.originX = 0.5;
    obj.originY = 1;
    obj.setTexture(this.cursor.texture.key);
    obj.x = this.cursor.x;
    obj.y = this.cursor.y;
    obj.setInteractive();

    // put terrain underneath everything
    if (this.objectsListPanel.filenamePrefix.startsWith("terrain")) {
      obj.depth = -Number.MAX_VALUE;
    } else {
      obj.depth = obj.y;
    }
    this.add.existing(obj);
  }

  addBackground() {
    var bgX = this.sys.canvas.width / 2;
    var bgY = this.sys.canvas.height / 2;
    var placeholder = new Phaser.GameObjects.Sprite(this, bgX, bgY, "placeholder");
    placeholder.scaleX = placeholder.scaleY = 2;
    this.add.existing(placeholder);
  }

  private getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}
