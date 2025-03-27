/**
 * Utility functions for serializing complex objects for Redux
 */

import { Monster, MonsterAttack } from '../models/Monster';
import { Character, Ability } from '../models/Character';

/**
 * Converts a Monster instance to a plain serializable object
 * by removing methods and converting non-serializable properties
 */
export const serializeMonster = (monster: Monster): any => {
  if (!monster) return null;

  // Create a plain object with only the data properties
  return {
    id: monster.id,
    name: monster.name,
    type: monster.type,
    difficulty: monster.difficulty,
    level: monster.level,
    stats: { ...monster.stats },
    attacks: monster.attacks.map((attack) => ({ ...attack })),
    lootTable: { ...monster.lootTable },
    experienceValue: monster.experienceValue,
    // Store image as a number (React Native asset reference) or null
    image: typeof monster.image === 'number' ? monster.image : null,
  };
};

/**
 * Recreates a Monster-like object with necessary methods for combat
 * This doesn't create a full Monster instance but provides the methods needed
 */
export const deserializeMonster = (monsterData: any): any => {
  if (!monsterData) return null;

  // Create a new object with the data and add the necessary methods
  return {
    ...monsterData,
    // Add only the methods needed for combat
    chooseAttack: () => {
      // Simplified implementation of chooseAttack
      const availableAttacks = monsterData.attacks.filter(
        (attack: MonsterAttack) => attack.currentCooldown === 0
      );

      if (availableAttacks.length === 0) {
        return {
          name: 'Basic Attack',
          description: 'attacks with a basic strike',
          damage: Math.floor(monsterData.stats.strength * 0.8),
          cooldown: 0,
          currentCooldown: 0,
        };
      }

      // Choose a random attack
      const randomIndex = Math.floor(Math.random() * availableAttacks.length);
      return { ...availableAttacks[randomIndex] };
    },

    updateCooldowns: () => {
      // This would normally modify the monster object directly
      // Since we're working with a copy, we need to return the updated attacks
      return {
        ...monsterData,
        attacks: monsterData.attacks.map((attack: MonsterAttack) => ({
          ...attack,
          currentCooldown:
            attack.currentCooldown > 0 ? attack.currentCooldown - 1 : 0,
        })),
      };
    },
  };
};

/**
 * Converts a Character instance to a plain serializable object
 * by removing methods and converting non-serializable properties
 */
export const serializeCharacter = (character: Character): any => {
  if (!character) return null;

  // Create a plain object with only the data properties
  return {
    name: character.name,
    profession: character.profession,
    race: character.race,
    level: character.level,
    experience: character.experience,
    experienceToNextLevel: character.experienceToNextLevel,
    stats: { ...character.stats },
    // Serialize abilities without the execute function
    abilities: character.abilities.map((ability) => ({
      name: ability.name,
      description: ability.description,
      cooldown: ability.cooldown,
      currentCooldown: ability.currentCooldown,
      // Omit the execute function as it's not serializable
    })),
  };
};

/**
 * Recreates a Character-like object with necessary methods for gameplay
 * This doesn't create a full Character instance but provides the methods needed
 */
export const deserializeCharacter = (characterData: any): any => {
  if (!characterData) return null;

  // Create a new object with the data and add the necessary methods
  const character = {
    ...characterData,
    // Add abilities with execute functions based on ability name
    abilities: characterData.abilities.map((ability: any) => {
      const abilityWithExecute = { ...ability };

      // Add execute function based on ability name
      switch (ability.name) {
        case 'Slash':
          abilityWithExecute.execute = (target: any) => {
            return {
              type: 'damage',
              value: characterData.stats.strength * 1.5,
            };
          };
          break;
        case 'Shield Bash':
          abilityWithExecute.execute = (target: any) => {
            return {
              type: 'damage_and_effect',
              damage: characterData.stats.strength,
              effect: { type: 'stun', duration: 2 },
            };
          };
          break;
        case 'Backstab':
          abilityWithExecute.execute = (target: any) => {
            return { type: 'damage', value: characterData.stats.dexterity * 2 };
          };
          break;
        case 'Poison Strike':
          abilityWithExecute.execute = (target: any) => {
            return {
              type: 'damage_and_effect',
              damage: characterData.stats.dexterity * 0.5,
              effect: {
                type: 'poison',
                duration: 3,
                damagePerTurn: characterData.stats.dexterity * 0.3,
              },
            };
          };
          break;
        case 'Fireball':
          abilityWithExecute.execute = (target: any) => {
            return {
              type: 'damage',
              value: characterData.stats.intelligence * 1.8,
            };
          };
          break;
        case 'Frost Nova':
          abilityWithExecute.execute = (target: any) => {
            return {
              type: 'damage_and_effect',
              damage: characterData.stats.intelligence,
              effect: { type: 'freeze', duration: 2 },
            };
          };
          break;
        case 'Adaptability':
          abilityWithExecute.execute = (target: any) => {
            return {
              type: 'buff',
              effect: { type: 'all_stats', value: 2, duration: 3 },
            };
          };
          break;
        case 'Stone Skin':
          abilityWithExecute.execute = (target: any) => {
            return {
              type: 'buff',
              effect: { type: 'defense', value: 5, duration: 3 },
            };
          };
          break;
        case 'Berserker Rage':
          abilityWithExecute.execute = (target: any) => {
            return {
              type: 'buff_and_debuff',
              buffs: [{ type: 'strength', value: 5, duration: 3 }],
              debuffs: [{ type: 'defense', value: -2, duration: 3 }],
            };
          };
          break;
        case "Nature's Blessing":
          abilityWithExecute.execute = (target: any) => {
            return {
              type: 'heal',
              value: characterData.stats.intelligence * 1.2,
            };
          };
          break;
        default:
          // Default execute function for unknown abilities
          abilityWithExecute.execute = (target: any) => {
            return { type: 'damage', value: 5 };
          };
      }

      return abilityWithExecute;
    }),

    // Add character methods
    useAbility: function (abilityIndex: number, target: any): any {
      if (abilityIndex < 0 || abilityIndex >= this.abilities.length) {
        return { success: false, message: 'Invalid ability index' };
      }

      const ability = this.abilities[abilityIndex];

      if (ability.currentCooldown > 0) {
        return { success: false, message: 'Ability is on cooldown' };
      }

      // Set the cooldown
      ability.currentCooldown = ability.cooldown;

      // Execute the ability
      return { success: true, result: ability.execute(target) };
    },

    updateCooldowns: function (): void {
      for (const ability of this.abilities) {
        if (ability.currentCooldown > 0) {
          ability.currentCooldown -= 1;
        }
      }
    },

    gainExperience: function (amount: number): void {
      this.experience += amount;

      // Check if character should level up
      while (this.experience >= this.experienceToNextLevel) {
        this.levelUp();
      }
    },

    levelUp: function (): void {
      this.level += 1;
      this.experience -= this.experienceToNextLevel;
      this.experienceToNextLevel = Math.floor(this.experienceToNextLevel * 1.5);

      // Increase stats based on profession
      switch (this.profession) {
        case 'Warrior':
          this.stats.strength += 2;
          this.stats.vitality += 2;
          this.stats.dexterity += 1;
          this.stats.intelligence += 0.5;
          break;
        case 'Assassin':
          this.stats.dexterity += 2;
          this.stats.strength += 1;
          this.stats.vitality += 1;
          this.stats.intelligence += 1;
          break;
        case 'Wizard':
          this.stats.intelligence += 2;
          this.stats.vitality += 1;
          this.stats.dexterity += 1;
          this.stats.strength += 0.5;
          break;
      }

      // Update health and mana based on new stats
      this.stats.health = 100 + this.stats.vitality * 10;
      this.stats.mana = 50 + this.stats.intelligence * 5;
    },
  };

  return character;
};
