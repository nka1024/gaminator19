/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  nomads
* @license      Apache 2.0
*/


import { WindowManager } from "../windows/WindowManager";
import { AssetsLoader } from "../AssetsLoader";
import { TileGrid } from "../TileGrid";
import { UnitsPanel } from "../windows/UnitsPanel";

import { HeroUnit } from "../actors/HeroUnit";
import { SquadUnit } from "../actors/SquadUnit";

import { CameraDragModule } from "../modules/scene/CameraDragModule";
import { SceneCursorModule } from "../modules/scene/SceneCursorModule";
import { MapImporterModule } from "../modules/scene/MapImporterModule";
import { ContextMenuModule } from "../modules/scene/ContextMenuModule";
import { GameobjectClicksModule } from "../modules/scene/GameobjectClicksModule";
import { BaseUnit } from "../actors/BaseUnit";
import { Hero, UnitData } from "../Hero";
import { GameObjects } from "phaser";
import { ResourcesPanel } from "../windows/ResourcesPanel";
import { K10Unit } from "../actors/K10Unit";
import { DialogWindow } from "../windows/DialogWindow";
import { DebugPanel } from "../windows/DebugPanel";
import { Point } from "../types/Position";
import { MenuWindow } from "../windows/MenuWindow";
import { CONST } from "../const/const";


export class GameplayRootScene extends Phaser.Scene {

  private grid: TileGrid;

  // objects
  public player: HeroUnit;
  public hero: Hero;
  private unitsGrp: Phaser.GameObjects.Group;
  private deployedSquads: Array<SquadUnit> = [];
  private selectedUnit: BaseUnit;

  // windows
  private unitsPanel: UnitsPanel;
  private resourcesPanel: ResourcesPanel;
  private debugPanel: DebugPanel;

  // modules
  private cameraDragModule: CameraDragModule;
  private mapImporterModule: MapImporterModule;
  private contextMenuModule: ContextMenuModule;
  private cursorModule: SceneCursorModule;
  private clicksTracker: GameobjectClicksModule;

  private menuWindow: MenuWindow;

  private escapeKey: Phaser.Input.Keyboard.Key;

  constructor() {
    super({
      key: "GameplayRootScene"
    });
    
  }

  preload() {
    AssetsLoader.preload(this);
  }

  injectDependencies() {
    this.hero = new Hero();
    this.grid = new TileGrid(this);
    this.cameraDragModule = new CameraDragModule(this);
    this.clicksTracker = new GameobjectClicksModule(this);
    this.contextMenuModule = new ContextMenuModule(this, this.hero, this.clicksTracker);
    this.cursorModule = new SceneCursorModule(this, this.grid);
    this.mapImporterModule = new MapImporterModule(this, this.grid);
  }

  private onWindowResize(w: number, h: number) {
    this.cameras.main.setSize(w, h);
    if (w < 500) {
      this.cameras.main.zoom = 1;
    } else if (w <= 1280) {
      this.cameras.main.zoom = 2;
    } else  {
      this.cameras.main.zoom = 3;
    }
    // this.unitsPanel.zoom = this.cameras.main.zoom;
    this.resourcesPanel.zoom = w <= 1280 ? 1 : 2;
  }

  create(data): void {
    this.injectDependencies();
    this.cameras.main.setBackgroundColor(0x1f1f1f);

    let mapsize = this.grid.gridSize * this.grid.tileSize;
    this.cameras.main.setBounds(0, 0, mapsize, mapsize);

    this.events.on('resize', (w: number, h: number) => this.onWindowResize(w, h));
    WindowManager.initialize();

    this.grid.createFog();

    let player = new HeroUnit(this, 0, 0, this.grid, Hero.makeHeroConf());

    this.resourcesPanel = new ResourcesPanel();
    this.resourcesPanel.populate(this.hero);
    this.resourcesPanel.show();

    this.debugPanel = new DebugPanel(this, this.grid, this.cursorModule);
    this.debugPanel.show();

    this.cursorModule.onClick = (cursor) => {
      if (!this.cameraDragModule.isDrag && !this.clicksTracker.objectClickedInThisFrame) {
        let squad = this.selectedUnit;
        if (squad) {
          if (this.canBeMovedByPlayer(squad)) {
            if (squad.state.isFighting) {
              squad.combat.stopFight('command');
            }
            if (squad.state.isChasing) {
              squad.chase.stop();
            }
            squad.mover.moveTo(cursor, true);
          }
        } else {
          if (player.state.isFighting) {
            player.combat.stopFight('command');
          }
          player.mover.moveTo(cursor, true);
        }
      }
    };

    // this.story.start();

    this.unitsGrp = this.add.group();
    this.unitsGrp.runChildUpdate = true;
    this.clicksTracker.addObjectsGroup(this.unitsGrp);


    this.mapImporterModule.grassHandler = (o: GameObjects.Image, item: any) => {
      let tile = this.grid.worldToGrid({ x: o.x, y: o.y - o.height / 2 });
      this.grid.addGrass(o, tile, 100);
      o.depth = o.y - 24;
    };

    this.mapImporterModule.enemyHandler = (p: Point, type: string) => {
      let tile = this.grid.worldToGrid(p)
      this.createEnemy(tile.i, tile.j, type);
    }
    this.mapImporterModule.importMap(this.cache.json.get('map'));



    this.add.existing(player);
    this.player = player;
    player.selection.showHard();
    this.selectedUnit = player;


    // player.mover.placeToTile({ i: 8, j: 12 });
    player.mover.placeToTile({i:63, j :54});
    // player.mover.placeToTile({i: 53, j: 73});
    // player.mover.placeToTile({i:21, j :10});

    this.cameras.main.centerOn(player.x, player.y);
    this.unitsGrp.add(this.player);
    this.unitsPanel = new UnitsPanel();
    this.unitsPanel.populate(this.hero.data.units);
    this.unitsPanel.show();
    this.unitsPanel.onUnitAttack = (conf: UnitData) => {
      let squad = this.findOrDeploySquad(conf);
      if (conf.type != 'harvester')
        squad.chase.deployDefender(player);
      
      this.add.existing(squad);
      this.unitsGrp.add(squad);
      this.deployedSquads.push(squad);
    }
    this.unitsPanel.onUnitRecall = (conf: UnitData) => {
      for (let squad of this.deployedSquads) {
        if (squad.conf.id == conf.id) {
          this.recallSquad(squad);
        }
      }
    }


    this.clicksTracker.on('click', (object: BaseUnit) => {
      // deselect old
      let squad: SquadUnit = (object as SquadUnit)
      if (squad) {
        if (this.selectedUnit && this.selectedUnit.active) {
          this.selectedUnit.selection.hideHard();
        }
        this.selectedUnit = squad
        squad.selection.showHard();
      }

      if (object.conf.id.indexOf('enemy') == -1) {
        return;
      }
    });

    this.contextMenuModule.onSummonClicked = (source: BaseUnit, conf: UnitData) => {
      
      this.hero.data.units.push(conf);
      this.unitsPanel.populate(this.hero.data.units);
      this.unitsPanel.selectDeployed(this.unitsGrp.getChildren() as BaseUnit[]);
      this.findOrDeploySquad(conf);
    };

    this.contextMenuModule.onReturnClicked = (object: BaseUnit) => {
      this.recallSquad(object as SquadUnit);
    };
    this.contextMenuModule.onMoveClicked = (object: BaseUnit) => {
      this.selectedUnit = object as SquadUnit;
    };

    this.onWindowResize(window.innerWidth, window.innerHeight);

    this.escapeKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
  }

  private recallSquad(squad: SquadUnit) {
    // stop fighting
    if (squad.state.isFighting) {
      squad.combat.stopFight('return');
    }
    // deselect tile
    if (this.selectedUnit == squad) {
      squad.selection.hideHard();
      this.selectedUnit = this.player;
      this.player.selection.showHard();
    }
    // deselect unit item
    this.unitsPanel.deselect(squad);


    // squad.chase.start(this.player, () => {
    console.log('returned');
    this.unitsGrp.remove(squad, true);
    this.deployedSquads = this.deployedSquads.filter((o, i, arr) => { return o != squad });
    squad.destroy();
    // });
  }

  private createEnemy(i: number, j: number, opt: string = null) {
    let worldPos = this.grid.gridToWorld({ i: i, j: j });
    let enemyUnit: BaseUnit;
    if (opt == 'k11'){
      enemyUnit = new K10Unit(this, worldPos.x + 16, worldPos.y + 16, this.grid, Hero.makeK11SquadConf());
    } else {
      enemyUnit = new K10Unit(this, worldPos.x + 16, worldPos.y + 16, this.grid, Hero.makeK10SquadConf());
    }
    enemyUnit.mover.placeToTile(enemyUnit.tile);
    this.add.existing(enemyUnit);
    this.unitsGrp.add(enemyUnit);
    enemyUnit.events.addListener('death', () => { enemyUnit.death(); this.handleUnitDeath(enemyUnit); });
  }

  public findOrDeploySquad(conf: UnitData) {
    let squad: SquadUnit = null;
    for (let s of this.deployedSquads) {
      if (s.conf.id == conf.id) {
        // found deployed squad
        squad = s;
        break;
      }
    }
    if (!squad) {
      let from = this.grid.snapToGrid(this.player);
      squad = new SquadUnit(this, from.x + 16, from.y + 16, this.grid, conf);
      squad.events.addListener('death', () => { this.handleUnitDeath(squad); });
      let tile = this.grid.findClosestFreeTile(this.player.tile, this.player.tile);
      let pt = this.grid.gridToWorld(tile);
      squad.mover.moveTo(pt, true);
    }
    return squad;
  }

  private handleUnitDeath(unit: BaseUnit) {
    // deselect tile
    if (this.selectedUnit == unit) {
      unit.selection.hideHard();
      this.selectedUnit = this.player;
      this.player.selection.showHard();
    }
    // deselect unit item
    // this.unitsPanel.deselect(unit);
    this.hero.data.units = this.hero.data.units.filter((o, i, arr) => {return o!= unit.conf})
    this.unitsPanel.populate(this.hero.data.units);
    this.unitsPanel.selectDeployed(this.unitsGrp.getChildren() as BaseUnit[]);
    

    this.unitsGrp.remove(unit, true);
    unit.destroy();
  }

  private canBeMovedByPlayer(squad: BaseUnit): boolean {
    if (squad.conf.type == 'reactor') return false;
    if (squad.conf.type == 'sentry') return false;
    if (squad.conf.side == 'attack') return false;
    return true;
  }

  private fogUpdateCnt: number = 60;
  update(): void {
    this.contextMenuModule.update();
    // dont handle touches if context window is shown
    if (!this.contextMenuModule.isContextWindowActive) {
      this.cursorModule.update();
      this.cameraDragModule.update();
    }
    this.clicksTracker.update();

    if (this.grid) {
      this.fogUpdateCnt++
      if (this.fogUpdateCnt > 60) {
        this.fogUpdateCnt = 0;
        this.grid.updateFog(this.player.tile);
      }
      this.grid.update();
    }


    if (this.escapeKey.isDown) {
      this.escapeKey.isDown = false;

      if (!this.menuWindow) {
        this.menuWindow = new MenuWindow();
        this.menuWindow.show();
        this.menuWindow.restartButton.addEventListener('click', () => {
          this.prepareForRestart();
          this.scene.start("LogoScene");
          this.menuWindow.destroy();
          this.menuWindow = null;
        });

        this.menuWindow.cameraButton.addEventListener('click', () => {
          this.cameras.main.centerOn(this.player.x, this.player.y);
        });

        this.menuWindow.exitButton.addEventListener('click', () => {
          console.log('EEXXIITT');
        });
        this.menuWindow.fullscreenButton.addEventListener('click', () => {
          console.log('FFUULLLLSSCCRREENN');
          this.time.addEvent({
            delay: 2000,
            callback: () => {this.cameras.main.centerOn(this.player.x, this.player.y);},
            callbackScope: this,
            loop: false,
            paused: false
          });
        });
        this.menuWindow.windowButton.addEventListener('click', () => {
          console.log('WWIINNDDOOWW');
          this.time.addEvent({
            delay: 2000,
            callback: () => {this.cameras.main.centerOn(this.player.x, this.player.y);},
            callbackScope: this,
            loop: false,
            paused: false
          });
        });
      } else {
        this.menuWindow.destroy();
        this.menuWindow = null;
      }

    }

    if (this.player.conf.health <= 0) {
      this.prepareForRestart();
    }
  }

  private prepareForRestart() {
    this.resourcesPanel.destroy();
    this.debugPanel.destroy();
    this.unitsPanel.destroy();

    HeroUnit.deinit();

    K10Unit.deinit();

    this.cameraDragModule.destroy();
    this.clicksTracker.destroy();
    this.contextMenuModule.destroy();
    this.cursorModule.destroy();
  }
}
