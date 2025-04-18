// Define item types
export enum ItemType {
  EQUIPMENT = 'EQUIPMENT',
  CONSUMABLE = 'CONSUMABLE',
  QUEST = 'QUEST',
  MATERIAL = 'MATERIAL',
}

// Define equipment slots
export enum EquipmentSlot {
  HEAD = 'HEAD',
  CHEST = 'CHEST',
  LEGS = 'LEGS',
  FEET = 'FEET',
  MAIN_HAND = 'MAIN_HAND',
  OFF_HAND = 'OFF_HAND',
  NECK = 'NECK',
  RING = 'RING',
}

// Define item rarity
export enum ItemRarity {
  COMMON = 'COMMON',
  UNCOMMON = 'UNCOMMON',
  RARE = 'RARE',
  EPIC = 'EPIC',
  LEGENDARY = 'LEGENDARY',
}

// Define stat bonuses for equipment
export interface StatBonus {
  strength?: number;
  dexterity?: number;
  intelligence?: number;
  vitality?: number;
  health?: number;
  mana?: number;
}

// Define consumable effects
export interface ConsumableEffect {
  type: 'heal' | 'mana' | 'buff' | 'damage';
  value: number;
  duration?: number; // For buffs
}

// Base Item interface
export interface Item {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  value: number;
  imageUrl?: string;
  equipmentSlot?: EquipmentSlot;
  stats?: ItemStats;
  rarity: ItemRarity;
  levelRequirement: number;

  // Equipment specific properties
  statBonuses?: StatBonus;

  // Consumable specific properties
  consumableEffect?: ConsumableEffect;

  // Quest specific properties
  questId?: string;

  // Material specific properties
  craftingUses?: string[];
}

// Factory function to create equipment items
export function createEquipment(
  id: string,
  name: string,
  description: string,
  rarity: ItemRarity,
  value: number,
  slot: EquipmentSlot,
  statBonuses: StatBonus
): Item {
  return {
    id,
    name,
    description,
    type: ItemType.EQUIPMENT,
    rarity,
    value,
    equipmentSlot: slot,
    statBonuses,
    levelRequirement: 1,
  };
}

// Factory function to create consumable items
export function createConsumable(
  id: string,
  name: string,
  description: string,
  rarity: ItemRarity,
  value: number,
  effect: ConsumableEffect
): Item {
  return {
    id,
    name,
    description,
    type: ItemType.CONSUMABLE,
    rarity,
    value,
    consumableEffect: effect,
    levelRequirement: 1,
  };
}

// Factory function to create quest items
export function createQuestItem(
  id: string,
  name: string,
  description: string,
  questId: string
): Item {
  return {
    id,
    name,
    description,
    type: ItemType.QUEST,
    rarity: ItemRarity.COMMON,
    value: 0,
    questId,
    levelRequirement: 1,
  };
}

// Factory function to create material items
export function createMaterial(
  id: string,
  name: string,
  description: string,
  rarity: ItemRarity,
  value: number,
  craftingUses: string[]
): Item {
  return {
    id,
    name,
    description,
    type: ItemType.MATERIAL,
    rarity,
    value,
    craftingUses,
    levelRequirement: 1,
  };
}

// Loot table interface for monster drops
export interface LootTable {
  monsterId: string;
  possibleItems: {
    item: Item;
    dropRate: number; // 0-1 probability
  }[];
  goldRange: {
    min: number;
    max: number;
  };
}

// Function to generate loot from a loot table
export function generateLoot(lootTable: LootTable): {
  items: Item[];
  gold: number;
} {
  const items: Item[] = [];

  // Roll for each possible item
  for (const possibleItem of lootTable.possibleItems) {
    const roll = Math.random();
    if (roll <= possibleItem.dropRate) {
      items.push(possibleItem.item);
    }
  }

  // Generate random gold amount
  const gold = Math.floor(
    Math.random() * (lootTable.goldRange.max - lootTable.goldRange.min + 1) +
      lootTable.goldRange.min
  );

  return { items, gold };
}

// Predefined equipment items
export const PREDEFINED_ITEMS = {
  // Weapons
  rustySword: createEquipment(
    'weapon_rusty_sword',
    'Rusty Sword',
    'An old, rusty sword. Better than nothing.',
    ItemRarity.COMMON,
    5,
    EquipmentSlot.MAIN_HAND,
    { strength: 2 }
  ),

  ironSword: createEquipment(
    'weapon_iron_sword',
    'Iron Sword',
    'A standard iron sword.',
    ItemRarity.COMMON,
    25,
    EquipmentSlot.MAIN_HAND,
    { strength: 5 }
  ),

  steelSword: createEquipment(
    'weapon_steel_sword',
    'Steel Sword',
    'A well-crafted steel sword.',
    ItemRarity.UNCOMMON,
    100,
    EquipmentSlot.MAIN_HAND,
    { strength: 8, dexterity: 2 }
  ),

  woodenStaff: createEquipment(
    'weapon_wooden_staff',
    'Wooden Staff',
    'A simple wooden staff.',
    ItemRarity.COMMON,
    15,
    EquipmentSlot.MAIN_HAND,
    { intelligence: 3 }
  ),

  // Armor
  leatherHelmet: createEquipment(
    'armor_leather_helmet',
    'Leather Helmet',
    'A basic leather helmet.',
    ItemRarity.COMMON,
    10,
    EquipmentSlot.HEAD,
    { vitality: 1 }
  ),

  leatherChest: createEquipment(
    'armor_leather_chest',
    'Leather Chest',
    'A basic leather chest piece.',
    ItemRarity.COMMON,
    20,
    EquipmentSlot.CHEST,
    { vitality: 2 }
  ),

  ironHelmet: createEquipment(
    'armor_iron_helmet',
    'Iron Helmet',
    'A sturdy iron helmet.',
    ItemRarity.UNCOMMON,
    50,
    EquipmentSlot.HEAD,
    { vitality: 3 }
  ),

  // Consumables
  healthPotion: createConsumable(
    'consumable_health_potion',
    'Health Potion',
    'Restores 50 health points.',
    ItemRarity.COMMON,
    15,
    { type: 'heal', value: 50 }
  ),

  manaPotion: createConsumable(
    'consumable_mana_potion',
    'Mana Potion',
    'Restores 30 mana points.',
    ItemRarity.COMMON,
    15,
    { type: 'mana', value: 30 }
  ),

  strengthPotion: createConsumable(
    'consumable_strength_potion',
    'Strength Potion',
    'Increases strength by 5 for 3 turns.',
    ItemRarity.UNCOMMON,
    30,
    { type: 'buff', value: 5, duration: 3 }
  ),
};

export interface ItemStats {
  strength?: number;
  dexterity?: number;
  intelligence?: number;
  vitality?: number;
  defense?: number;
  attack?: number;
  magic?: number;
}
