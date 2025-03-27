import { Stats } from './Character';
import { LootTable } from './Item';
import { ImageSourcePropType } from 'react-native';

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
  image: ImageSourcePropType; // Monster's image

  constructor(
    id: string,
    name: string,
    type: MonsterType,
    difficulty: MonsterDifficulty,
    level: number,
    stats: Stats,
    attacks: MonsterAttack[],
    lootTable: LootTable,
    experienceValue: number,
    image?: ImageSourcePropType // Optional parameter with default value
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

    // Set default image based on monster type if not provided
    if (image) {
      this.image = image;
    } else {
      // Default images based on monster type
      switch (type) {
        case MonsterType.BEAST:
          this.image = require('../../assets/beast.png');
          break;
        case MonsterType.DRAGON:
          this.image = require('../../assets/dragon.png');
          break;
        case MonsterType.UNDEAD:
          this.image = require('../../assets/undead.png');
          break;
        case MonsterType.ELEMENTAL:
          this.image = require('../../assets/elemental.png');
          break;
        case MonsterType.HUMANOID:
        default:
          // Default to beast if no specific image
          this.image = require('../../assets/beast.png');
          break;
      }
    }
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
  experienceValue: number,
  image?: ImageSourcePropType
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
    experienceValue,
    image
  );
}

// Predefined monsters
export const PREDEFINED_MONSTERS = {
  // Example predefined monsters with images
  GOBLIN: (level: number): Monster =>
    createMonster(
      'goblin',
      'Goblin',
      MonsterType.HUMANOID,
      MonsterDifficulty.EASY,
      level,
      {
        strength: 8 + Math.floor(level * 0.5),
        dexterity: 12 + Math.floor(level * 0.7),
        intelligence: 6 + Math.floor(level * 0.3),
        vitality: 7 + Math.floor(level * 0.4),
        health: 50 + Math.floor(level * 5),
        mana: 20 + Math.floor(level * 2),
      },
      [
        {
          name: 'Dagger Stab',
          description: 'stabs with a rusty dagger',
          damage: 5 + Math.floor(level * 1.2),
          cooldown: 0,
          currentCooldown: 0,
        },
        {
          name: 'Sneak Attack',
          description: 'performs a sneaky backstab',
          damage: 8 + Math.floor(level * 1.5),
          cooldown: 3,
          currentCooldown: 0,
        },
      ],
      {
        monsterId: 'goblin',
        possibleItems: [],
        goldRange: { min: 5, max: 15 + level * 2 },
      },
      30 + level * 5
    ),

  WOLF: (level: number): Monster =>
    createMonster(
      'wolf',
      'Dire Wolf',
      MonsterType.BEAST,
      MonsterDifficulty.NORMAL,
      level,
      {
        strength: 12 + Math.floor(level * 0.8),
        dexterity: 14 + Math.floor(level * 0.9),
        intelligence: 5 + Math.floor(level * 0.2),
        vitality: 10 + Math.floor(level * 0.6),
        health: 70 + Math.floor(level * 7),
        mana: 10 + Math.floor(level * 1),
      },
      [
        {
          name: 'Bite',
          description: 'bites with sharp fangs',
          damage: 8 + Math.floor(level * 1.4),
          cooldown: 0,
          currentCooldown: 0,
        },
        {
          name: 'Howl',
          description: 'lets out a terrifying howl',
          damage: 4 + Math.floor(level * 0.8),
          cooldown: 2,
          currentCooldown: 0,
          effects: [
            {
              type: 'fear',
              value: 2,
              duration: 2,
            },
          ],
        },
      ],
      {
        monsterId: 'wolf',
        possibleItems: [],
        goldRange: { min: 2, max: 8 + level },
      },
      40 + level * 6
    ),
};
