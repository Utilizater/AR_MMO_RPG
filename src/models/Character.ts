// Define the available professions
export enum Profession {
  WARRIOR = 'Warrior',
  ASSASSIN = 'Assassin',
  WIZARD = 'Wizard',
}

// Define the available races
export enum Race {
  HUMAN = 'Human',
  DWARF = 'Dwarf',
  ORC = 'Orc',
  ELF = 'Elf',
}

// Base stats interface
export interface Stats {
  strength: number;
  dexterity: number;
  intelligence: number;
  vitality: number;
  health: number;
  mana: number;
}

// Ability interface
export interface Ability {
  name: string;
  description: string;
  cooldown: number;
  currentCooldown: number;
  execute: (target: any) => any;
}

// Base Character class
export class Character {
  name: string;
  profession: Profession;
  race: Race;
  level: number;
  experience: number;
  experienceToNextLevel: number;
  stats: Stats;
  abilities: Ability[];

  constructor(name: string, profession: Profession, race: Race) {
    this.name = name;
    this.profession = profession;
    this.race = race;
    this.level = 1;
    this.experience = 0;
    this.experienceToNextLevel = 100;

    // Initialize base stats based on profession and race
    this.stats = this.getInitialStats();

    // Initialize abilities based on profession and race
    this.abilities = this.getInitialAbilities();
  }

  private getInitialStats(): Stats {
    // Base stats for all characters
    let stats: Stats = {
      strength: 10,
      dexterity: 10,
      intelligence: 10,
      vitality: 10,
      health: 100,
      mana: 50,
    };

    // Modify stats based on profession
    switch (this.profession) {
      case Profession.WARRIOR:
        stats.strength += 5;
        stats.vitality += 3;
        stats.health += 50;
        break;
      case Profession.ASSASSIN:
        stats.dexterity += 5;
        stats.strength += 2;
        stats.health += 25;
        break;
      case Profession.WIZARD:
        stats.intelligence += 5;
        stats.mana += 50;
        break;
    }

    // Modify stats based on race
    switch (this.race) {
      case Race.HUMAN:
        // Humans are balanced
        stats.strength += 1;
        stats.dexterity += 1;
        stats.intelligence += 1;
        stats.vitality += 1;
        break;
      case Race.DWARF:
        // Dwarves are strong and tough
        stats.strength += 2;
        stats.vitality += 3;
        stats.health += 25;
        break;
      case Race.ORC:
        // Orcs are very strong but less intelligent
        stats.strength += 4;
        stats.vitality += 2;
        stats.intelligence -= 2;
        stats.health += 30;
        break;
      case Race.ELF:
        // Elves are agile and intelligent
        stats.dexterity += 3;
        stats.intelligence += 2;
        stats.mana += 25;
        break;
    }

    return stats;
  }

  private getInitialAbilities(): Ability[] {
    const abilities: Ability[] = [];

    // Add profession-specific abilities
    switch (this.profession) {
      case Profession.WARRIOR:
        abilities.push({
          name: 'Slash',
          description: 'A powerful slash with your weapon',
          cooldown: 0,
          currentCooldown: 0,
          execute: (target) => {
            // Implementation will be handled by the combat system
            return { type: 'damage', value: this.stats.strength * 1.5 };
          },
        });
        abilities.push({
          name: 'Shield Bash',
          description: 'Bash your enemy with your shield, stunning them',
          cooldown: 10,
          currentCooldown: 0,
          execute: (target) => {
            return {
              type: 'damage_and_effect',
              damage: this.stats.strength,
              effect: { type: 'stun', duration: 2 },
            };
          },
        });
        break;

      case Profession.ASSASSIN:
        abilities.push({
          name: 'Backstab',
          description: 'Attack from behind for critical damage',
          cooldown: 5,
          currentCooldown: 0,
          execute: (target) => {
            return { type: 'damage', value: this.stats.dexterity * 2 };
          },
        });
        abilities.push({
          name: 'Poison Strike',
          description: 'Poison your enemy, dealing damage over time',
          cooldown: 8,
          currentCooldown: 0,
          execute: (target) => {
            return {
              type: 'damage_and_effect',
              damage: this.stats.dexterity * 0.5,
              effect: {
                type: 'poison',
                duration: 3,
                damagePerTurn: this.stats.dexterity * 0.3,
              },
            };
          },
        });
        break;

      case Profession.WIZARD:
        abilities.push({
          name: 'Fireball',
          description: 'Launch a ball of fire at your enemy',
          cooldown: 3,
          currentCooldown: 0,
          execute: (target) => {
            return { type: 'damage', value: this.stats.intelligence * 1.8 };
          },
        });
        abilities.push({
          name: 'Frost Nova',
          description: 'Freeze enemies around you',
          cooldown: 12,
          currentCooldown: 0,
          execute: (target) => {
            return {
              type: 'damage_and_effect',
              damage: this.stats.intelligence,
              effect: { type: 'freeze', duration: 2 },
            };
          },
        });
        break;
    }

    // Add race-specific ability
    switch (this.race) {
      case Race.HUMAN:
        abilities.push({
          name: 'Adaptability',
          description: 'Humans adapt quickly to situations',
          cooldown: 20,
          currentCooldown: 0,
          execute: (target) => {
            return {
              type: 'buff',
              effect: { type: 'all_stats', value: 2, duration: 3 },
            };
          },
        });
        break;

      case Race.DWARF:
        abilities.push({
          name: 'Stone Skin',
          description: 'Harden your skin to reduce damage',
          cooldown: 15,
          currentCooldown: 0,
          execute: (target) => {
            return {
              type: 'buff',
              effect: { type: 'defense', value: 5, duration: 3 },
            };
          },
        });
        break;

      case Race.ORC:
        abilities.push({
          name: 'Berserker Rage',
          description: 'Enter a rage, increasing damage but reducing defense',
          cooldown: 25,
          currentCooldown: 0,
          execute: (target) => {
            return {
              type: 'buff_and_debuff',
              buffs: [{ type: 'strength', value: 5, duration: 3 }],
              debuffs: [{ type: 'defense', value: -2, duration: 3 }],
            };
          },
        });
        break;

      case Race.ELF:
        abilities.push({
          name: "Nature's Blessing",
          description: 'Call upon nature to heal your wounds',
          cooldown: 18,
          currentCooldown: 0,
          execute: (target) => {
            return {
              type: 'heal',
              value: this.stats.intelligence * 1.2,
            };
          },
        });
        break;
    }

    return abilities;
  }

  // Method to gain experience
  gainExperience(amount: number): void {
    this.experience += amount;

    // Check if character should level up
    while (this.experience >= this.experienceToNextLevel) {
      this.levelUp();
    }
  }

  // Method to level up
  levelUp(): void {
    this.level += 1;
    this.experience -= this.experienceToNextLevel;
    this.experienceToNextLevel = Math.floor(this.experienceToNextLevel * 1.5);

    // Increase stats based on profession
    switch (this.profession) {
      case Profession.WARRIOR:
        this.stats.strength += 2;
        this.stats.vitality += 2;
        this.stats.dexterity += 1;
        this.stats.intelligence += 0.5;
        break;
      case Profession.ASSASSIN:
        this.stats.dexterity += 2;
        this.stats.strength += 1;
        this.stats.vitality += 1;
        this.stats.intelligence += 1;
        break;
      case Profession.WIZARD:
        this.stats.intelligence += 2;
        this.stats.vitality += 1;
        this.stats.dexterity += 1;
        this.stats.strength += 0.5;
        break;
    }

    // Update health and mana based on new stats
    this.stats.health = 100 + this.stats.vitality * 10;
    this.stats.mana = 50 + this.stats.intelligence * 5;
  }

  // Method to use an ability
  useAbility(abilityIndex: number, target: any): any {
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
  }

  // Method to update cooldowns (should be called each turn)
  updateCooldowns(): void {
    for (const ability of this.abilities) {
      if (ability.currentCooldown > 0) {
        ability.currentCooldown -= 1;
      }
    }
  }
}
