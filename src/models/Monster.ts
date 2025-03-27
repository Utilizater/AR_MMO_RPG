import { Stats } from './Character';
import { LootTable } from './Item';

// Define monster types
export enum MonsterType {
  HUMANOID = 'Humanoid',
  BEAST = 'Beast',
  UNDEAD = 'Undead',
  ELEMENTAL = 'Elemental',
  DRAGON = 'Dragon',
}

// Define monster difficulty levels
export enum MonsterDifficulty {
  EASY = 'Easy',
  NORMAL = 'Normal',
  HARD = 'Hard',
  BOSS = 'Boss',
}

// Monster attack interface
export interface MonsterAttack {
  name: string;
  description: string;
  damage: number;
  cooldown: number;
  currentCooldown: number;
  effects?: {
    type: string;
    value: number;
    duration: number;
  }[];
}

// Monster class
export class Monster {
  id: string;
  name: string;
  type: MonsterType;
  difficulty: MonsterDifficulty;
  level: number;
  stats: Stats;
  attacks: MonsterAttack[];
  lootTable: LootTable;
  experienceValue: number;

  constructor(
    id: string,
    name: string,
    type: MonsterType,
    difficulty: MonsterDifficulty,
    level: number,
    stats: Stats,
    attacks: MonsterAttack[],
    lootTable: LootTable,
    experienceValue: number
  ) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.difficulty = difficulty;
    this.level = level;
    this.stats = stats;
    this.attacks = attacks;
    this.lootTable = lootTable;
    this.experienceValue = experienceValue;
  }

  // Method to choose an attack
  chooseAttack(): MonsterAttack {
    // Filter out attacks on cooldown
    const availableAttacks = this.attacks.filter(
      (attack) => attack.currentCooldown === 0
    );

    if (availableAttacks.length === 0) {
      // If all attacks are on cooldown, use a basic attack
      return {
        name: 'Basic Attack',
        description: 'attacks with a basic strike',
        damage: Math.floor(this.stats.strength * 0.8),
        cooldown: 0,
        currentCooldown: 0,
      };
    }

    // Choose a random attack from available attacks
    const randomIndex = Math.floor(Math.random() * availableAttacks.length);
    const chosenAttack = availableAttacks[randomIndex];

    // Set the cooldown
    const attackIndex = this.attacks.findIndex(
      (attack) => attack.name === chosenAttack.name
    );
    if (attackIndex !== -1) {
      this.attacks[attackIndex].currentCooldown =
        this.attacks[attackIndex].cooldown;
    }

    return chosenAttack;
  }

  // Method to update cooldowns (should be called each turn)
  updateCooldowns(): void {
    for (let i = 0; i < this.attacks.length; i++) {
      if (this.attacks[i].currentCooldown > 0) {
        this.attacks[i].currentCooldown -= 1;
      }
    }
  }
}

// Factory function to create a monster
export function createMonster(
  id: string,
  name: string,
  type: MonsterType,
  difficulty: MonsterDifficulty,
  level: number,
  stats: Stats,
  attacks: MonsterAttack[],
  lootTable: LootTable,
  experienceValue: number
): Monster {
  return new Monster(
    id,
    name,
    type,
    difficulty,
    level,
    stats,
    attacks,
    lootTable,
    experienceValue
  );
}

// Predefined monsters
export const PREDEFINED_MONSTERS = {
  // Example monsters will be defined here
  // These will be populated with actual data when we have the loot tables
};
