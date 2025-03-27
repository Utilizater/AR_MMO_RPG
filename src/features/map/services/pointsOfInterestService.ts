import { Coordinates, LocationPoint } from '../types';
import {
  Monster,
  createMonster,
  MonsterType,
  MonsterDifficulty,
} from '../../../models/Monster';

/**
 * Generate nearby points of interest around a given location
 * @param location The center coordinates
 * @param characterLevel The player's character level
 * @returns Array of location points (monsters, treasures, etc.)
 */
export const generateNearbyPoints = (
  location: Coordinates,
  characterLevel: number = 1
): LocationPoint[] => {
  // In a real app, these would be fetched from a server or generated based on real location
  const points: LocationPoint[] = [];

  // Generate 1-3 random monsters
  const monsterCount = Math.floor(Math.random() * 3) + 1;
  for (let i = 0; i < monsterCount; i++) {
    const monster = generateRandomMonster(i, characterLevel);

    points.push({
      id: `monster_${i}`,
      name: monster.name,
      latitude: location.latitude + (Math.random() * 0.002 - 0.001),
      longitude: location.longitude + (Math.random() * 0.002 - 0.001),
      type: 'monster',
      data: monster,
    });
  }

  // Add a treasure point
  points.push({
    id: 'treasure_1',
    name: 'Hidden Treasure',
    latitude: location.latitude + (Math.random() * 0.002 - 0.001),
    longitude: location.longitude + (Math.random() * 0.002 - 0.001),
    type: 'treasure',
    data: {
      gold: Math.floor(Math.random() * 50) + 10,
      image: require('../../../../assets/treasure.png'),
    },
  });

  return points;
};

/**
 * Generate a random monster
 * @param index Monster index for ID generation
 * @param characterLevel Player's character level
 * @returns Monster object
 */
const generateRandomMonster = (
  index: number,
  characterLevel: number
): Monster => {
  const monsterTypes = Object.values(MonsterType);
  const randomType =
    monsterTypes[Math.floor(Math.random() * monsterTypes.length)];

  const difficulties = [MonsterDifficulty.EASY, MonsterDifficulty.NORMAL];
  const randomDifficulty =
    difficulties[Math.floor(Math.random() * difficulties.length)];

  // Create a basic monster
  return createMonster(
    `monster_${index}`,
    `${randomType} ${index + 1}`,
    randomType,
    randomDifficulty,
    characterLevel,
    {
      strength: 10 + Math.floor(Math.random() * 5),
      dexterity: 10 + Math.floor(Math.random() * 5),
      intelligence: 10 + Math.floor(Math.random() * 5),
      vitality: 10 + Math.floor(Math.random() * 5),
      health: 100 + Math.floor(Math.random() * 50),
      mana: 50 + Math.floor(Math.random() * 20),
    },
    [
      {
        name: 'Slash',
        description: 'slashes with its claws',
        damage: 10 + Math.floor(Math.random() * 5),
        cooldown: 0,
        currentCooldown: 0,
      },
      {
        name: 'Bite',
        description: 'bites with sharp teeth',
        damage: 15 + Math.floor(Math.random() * 8),
        cooldown: 2,
        currentCooldown: 0,
      },
    ],
    {
      monsterId: `monster_${index}`,
      possibleItems: [],
      goldRange: { min: 5, max: 20 },
    },
    50 + Math.floor(Math.random() * 30)
  );
};

/**
 * Calculate distance between two coordinates in meters
 * @param coord1 First coordinate
 * @param coord2 Second coordinate
 * @returns Distance in meters
 */
export const calculateDistance = (
  coord1: Coordinates,
  coord2: Coordinates
): number => {
  return Math.sqrt(
    Math.pow((coord1.latitude - coord2.latitude) * 111000, 2) +
      Math.pow((coord1.longitude - coord2.longitude) * 111000, 2)
  );
};
