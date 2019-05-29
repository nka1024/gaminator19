/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    Kirill Nepomnyaschiy
* @description  gaminator 19
*/

import { CardData, CardSkillType, CardType } from "../types/Types";
import { CardName } from "./BattleService";

export class CardDetailsDisplay extends Phaser.GameObjects.Container {
  private card: CardData;
  private hp: Phaser.GameObjects.Image;
  private atk: Phaser.GameObjects.Image;
  private nameTxt: Phaser.GameObjects.BitmapText;
  private atkTxt: Phaser.GameObjects.BitmapText;
  private hpTxt: Phaser.GameObjects.BitmapText;
  private benefitTxt: Phaser.GameObjects.BitmapText;
  private creature: Phaser.GameObjects.Image;
  private skill: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene) {
    super(scene);
    this.atk = new Phaser.GameObjects.Image(scene, 0, 19, "icon_attack");
    this.atk.setOrigin(0, 0);
    this.add(this.atk);
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

    this.benefitTxt = new Phaser.GameObjects.BitmapText(scene, 5, 22, 'coco-8-white');
    this.benefitTxt.letterSpacing = -1
    this.add(this.benefitTxt);

    this.creature = new Phaser.GameObjects.Image(scene, 0, 0, 'creature_doogie')
    this.creature.x = 35
    this.creature.y = 31
    this.add(this.creature)
  }

  public populate(card: CardData) {
    this.card = card;

    this.nameTxt.text = card.name
    if (this.card.type == CardType.CREATURE) {
      this.hp.visible = true;
      this.atk.visible = true;
      this.hpTxt.text = card.hp.toString();
      this.atkTxt.text = card.attack.toString();
      this.benefitTxt.text = '';
    } else if (this.card.type == CardType.EFFECT) {
      this.atk.visible = false;
      this.hp.visible = false;
      if (this.card.benefit)
        this.benefitTxt.text = '+' + this.card.benefit.toString();
      this.hpTxt.text = ''
      this.atkTxt.text = ''
    } else {
      throw 'unknown card type';
    }

    this.creature.setTexture(CardDetailsDisplay.creatureTextureByName(card.name));
    this.skill.setTexture(this.skillTextureByType(card.skill));
  }

  public static creatureTextureByName(name: string):string {
    console.log
    switch (name) {
      case CardName.Snukchak: return 'creature_doogie';
      case CardName.Doogie: return 'creature_snakey';
      case CardName.x11F0C4: return 'creature_1';
      case CardName.x0B4211: return 'creature_2';
      case CardName.x1D4531: return 'creature_3';
      case CardName.x3A8C30: return 'creature_4';
      case CardName.xA90013: return 'creature_5';
      case CardName.xAF2D10: return 'creature_6';
      case CardName.xCF3081: return 'creature_7';
      case CardName.xF93A72: return 'creature_8';
      case CardName.ADD_ATK_MODULE: return 'creature_atk';
      case CardName.ADD_HP_MODULE: return 'creature_hp_module';
      case CardName.ADD_HP_CORE: return 'creature_hp_core';
      case CardName.HYBERNATION: return 'spell_hybernation';
      case CardName.HYBRID: return 'creature_hybrid';
      case CardName.SUBTLETY: return 'creature_subtlety';
      case CardName.INJECTION: return 'creature_injection';
      case CardName.DAMAGE_CORE: return 'spell_dmg_core';
      case CardName.DAMAGE_MODULE: return 'spell_dmg_module';
      case CardName.ENRAGE: return 'spell_enrage';
      
      default: return '';
    }
  }

  private skillTextureByType(skill: CardSkillType): string {
    switch (skill) {
      case CardSkillType.BUFF_ALLIES_1_1: return 'skill_boost_atk_hp';
      case CardSkillType.ZERO_TURN: return 'skill_zero_turn';
      case CardSkillType.ADD_ATTACK_CREATURE: return 'skill_add_attack';
      case CardSkillType.HYBERNATION: return 'skill_put_to_sleep';
      case CardSkillType.ADD_HP_CORE: return 'skill_add_hp_core';
      case CardSkillType.ADD_HP_CREATURE: return 'skill_add_hp_creature';
      case CardSkillType.HYBRID: return 'skill_hybrid';
      case CardSkillType.SUBTLETY: return 'skill_subtlety';
      case CardSkillType.INJECTION: return 'skill_injection';
      case CardSkillType.DAMAGE_CORE: return 'skill_dmg_core';
      case CardSkillType.DAMAGE_CREATURE: return 'skill_dmg_creature';
      case CardSkillType.BUFF_ATK_WHILE_ALIVE: return 'skill_buff_atk_while_alive';
      case CardSkillType.ENRAGE: return 'skill_enrage';
      case CardSkillType.BOMB: return 'skill_bomb';
      
      default: return 
    }
  }
}