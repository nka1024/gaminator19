/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  gaminator 19
*/

import { CardData, CardSkillType } from "../types/Types";

export class CardDetailsDisplay extends Phaser.GameObjects.Container {
  private card: CardData;
  private hp: Phaser.GameObjects.Image;
  private attack: Phaser.GameObjects.Image;
  private nameTxt: Phaser.GameObjects.BitmapText;
  private atkTxt: Phaser.GameObjects.BitmapText;
  private hpTxt: Phaser.GameObjects.BitmapText;
  private creature: Phaser.GameObjects.Image;
  private skill: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene) {
    super(scene);
    this.attack = new Phaser.GameObjects.Image(scene, 0, 19, "icon_attack");
    this.attack.setOrigin(0, 0);
    this.add(this.attack);
    this.hp = new Phaser.GameObjects.Image(scene, 1, 34, "icon_hp");
    this.hp.setOrigin(0, 0);
    this.add(this.hp);
    
    this.skill = new Phaser.GameObjects.Image(scene, -4, -3, "");
    this.skill.setOrigin(0, 0);
    this.add(this.skill);

    this.nameTxt = new Phaser.GameObjects.BitmapText(scene, 0, -5, 'coco-8-yellow');
    this.nameTxt.letterSpacing = -1
    this.add(this.nameTxt);

    this.atkTxt = new Phaser.GameObjects.BitmapText(scene, 13, 17, 'coco-8-white');
    this.atkTxt.letterSpacing = -1
    this.add(this.atkTxt);

    this.hpTxt = new Phaser.GameObjects.BitmapText(scene, 13, 31, 'coco-8-hp');
    this.hpTxt.letterSpacing = -1
    this.add(this.hpTxt);

    this.creature = new Phaser.GameObjects.Image(scene, 0, 0, 'creature_doogie')
    this.creature.x = 35
    this.creature.y = 31
    this.add(this.creature)
  }

  public populate(card: CardData) {
    this.card = card;

    this.nameTxt.text = card.name
    this.hpTxt.text = card.hp.toString();
    this.atkTxt.text = card.attack.toString();

    this.creature.setTexture(CardDetailsDisplay.creatureTextureByName(card.name));
    this.skill.setTexture(this.skillTextureByType(card.skill));
  }

  public static creatureTextureByName(name: string):string {
    console.log
    switch (name) {
      case 'Doogie': return 'creature_doogie';
      case 'Snuk-chak': return 'creature_snakey';
      default: return '';
    }
  }

  private skillTextureByType(skill: CardSkillType): string {
    switch (skill) {
      case CardSkillType.BUFF_ALLIES_1_1: return 'trait_boost_atk_hp';
      case CardSkillType.ZERO_TURN: return 'trait_boost_atk_hp';
      default: return 
    }
  }
}