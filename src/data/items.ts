import { Item, ItemType, EquipmentSlot, ItemRarity } from '../models/Item';

export const initialItems: Item[] = [
  {
    id: 'iron_helmet',
    name: 'Iron Helmet',
    description:
      'A sturdy iron helmet that provides basic protection for your head.',
    type: ItemType.EQUIPMENT,
    value: 50,
    equipmentSlot: EquipmentSlot.HEAD,
    stats: {
      defense: 5,
      vitality: 2,
    },
    rarity: ItemRarity.COMMON,
    levelRequirement: 1,
  },
  {
    id: 'leather_armor',
    name: 'Leather Armor',
    description:
      'Lightweight leather armor that offers decent protection while maintaining mobility.',
    type: ItemType.EQUIPMENT,
    value: 75,
    equipmentSlot: EquipmentSlot.CHEST,
    stats: {
      defense: 8,
      dexterity: 3,
    },
    rarity: ItemRarity.COMMON,
    levelRequirement: 1,
  },
  {
    id: 'steel_sword',
    name: 'Steel Sword',
    description: 'A well-crafted steel sword, balanced and sharp.',
    type: ItemType.EQUIPMENT,
    value: 100,
    equipmentSlot: EquipmentSlot.MAIN_HAND,
    stats: {
      attack: 12,
      strength: 5,
    },
    rarity: ItemRarity.UNCOMMON,
    levelRequirement: 2,
  },
  {
    id: 'health_potion',
    name: 'Health Potion',
    description: 'A magical potion that restores health when consumed.',
    type: ItemType.CONSUMABLE,
    value: 25,
    stats: {
      vitality: 20,
    },
    rarity: ItemRarity.COMMON,
    levelRequirement: 1,
  },
  {
    id: 'magic_ring',
    name: 'Ring of Wisdom',
    description: 'A mystical ring that enhances magical abilities.',
    type: ItemType.EQUIPMENT,
    value: 150,
    equipmentSlot: EquipmentSlot.RING,
    stats: {
      intelligence: 8,
      magic: 5,
    },
    rarity: ItemRarity.RARE,
    levelRequirement: 3,
  },
];
