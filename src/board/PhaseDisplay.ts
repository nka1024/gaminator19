/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  gaminator 19
*/

import { Scene, GameObjects } from "phaser";
import { PhaseType } from "../types/Types";


export class PhaseDisplay extends Phaser.GameObjects.Container {

  private static phaseOrder = [
    PhaseType.LOAD, PhaseType.COMMANDS, PhaseType.PROTECT, PhaseType.COMPILE, PhaseType.OPPONENT];

  private headerImage: Phaser.GameObjects.Image;
  private phaseNames: Phaser.GameObjects.Image[] = [];
  private phaseDone: Phaser.GameObjects.Image[] = [];
  private phaseCurrent: Phaser.GameObjects.Sprite[] = [];
  
  constructor(scene: Scene) {
    super(scene, 0, 0);

    this.headerImage = new Phaser.GameObjects.Image(scene, -3, -15, "status_header_bg");
    this.headerImage.setOrigin(0, 0);
    this.add(this.headerImage);

    this.phaseNames.push(new Phaser.GameObjects.Image(scene, 0, 0, "turn_name_load"))
    this.phaseNames.push(new Phaser.GameObjects.Image(scene, 0, 0, "turn_name_commands"))
    this.phaseNames.push(new Phaser.GameObjects.Image(scene, 0, 0, "turn_name_protect"))
    this.phaseNames.push(new Phaser.GameObjects.Image(scene, 0, 0, "turn_name_compile"))
    this.phaseNames.push(new Phaser.GameObjects.Image(scene, 0, 0, "turn_name_opponent"))

    for (let i = 0; i < this.phaseNames.length; i++) {
      let name = this.phaseNames[i];
      name.setOrigin(0,0)
      this.add(name);
      name.x = 0
      name.y = i * 10;

      let current = new Phaser.GameObjects.Sprite(scene, -1, 0, '');
      this.phaseCurrent.push(current)
      current.setOrigin(0, 0);
      current.y = i * 10 + 2 - 1
      current.play('turn_current_anim');
      scene.add.existing(current);
      this.add(current);

      let done = new Phaser.GameObjects.Image(scene, 0, 0, "turn_done");
      this.phaseDone.push(done)
      done.setOrigin(0, 0);
      done.y = i * 10 + 2
      this.add(done);
    }

    this.setPhase(PhaseType.LOAD);
  }

  public setPhase(phase: PhaseType) {
    let idx = PhaseDisplay.phaseOrder.indexOf(phase);
    for (let i = 0; i < this.phaseNames.length; i++) {
      this.phaseNames[i].alpha = i <= idx ? 1 : 0.35;
      this.phaseDone[i].visible = i < idx;
      this.phaseCurrent[i].visible = i == idx;
    }
  }
}