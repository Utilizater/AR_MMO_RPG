import OpenAI from 'openai';
import { Character } from '../models/Character';
import { Monster } from '../models/Monster';
import { Item } from '../models/Item';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Get API key from Expo Constants or environment variables
const getApiKey = () => {
  // For Expo, try to get from Constants.manifest.extra
  if (Constants.expoConfig?.extra?.openAiApiKey) {
    return Constants.expoConfig.extra.openAiApiKey;
  }

  throw Error('No API key provide');
};

// Initialize OpenAI with API key
const openai = new OpenAI({
  apiKey: getApiKey(),
});

// Define the response structure from OpenAI
interface CombatActionResponse {
  valid: boolean;
  action?: string;
  damage?: number;
  abilityIndex?: number;
  message?: string;
  reasoning?: string;
}

/**
 * Evaluates a combat action using OpenAI's API
 * @param input User's text input describing their action
 * @param character Player's character data
 * @param monster Current monster being fought
 * @param inventory Player's inventory items
 * @returns Evaluation result with validity, damage, and messages
 */
export const evaluateCombatAction = async (
  input: string,
  character: any,
  monster: any,
  inventory: Item[]
): Promise<CombatActionResponse> => {
  try {
    // Create a prompt that includes all relevant information
    const prompt = createPrompt(input, character, monster, inventory);

    console.log('prompt', prompt);

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Using a capable but cost-effective model
      messages: [
        {
          role: 'system',
          content: `You are a combat evaluator for an AR RPG game. Your job is to determine if a player's combat action is realistic based on their character's abilities and inventory. Respond ONLY with a JSON object following this structure:
{
  "valid": boolean, // Whether the action is valid/realistic
  "action": string, // Type of action (attack, ability, item)
  "damage": number, // Calculated damage if valid
  "abilityIndex": number, // Index of ability used (if applicable)
  "message": string, // Explanation message for the player
  "reasoning": string // Your reasoning for the decision
}`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3, // Lower temperature for more consistent responses
      response_format: { type: 'json_object' }, // Ensure JSON response
    });

    // Extract and parse the response
    const content = response.choices[0]?.message?.content;
    console.log('content!', content);
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response
    const parsedResponse = JSON.parse(content) as CombatActionResponse;

    // Validate the response structure
    if (typeof parsedResponse.valid !== 'boolean') {
      throw new Error('Invalid response format: missing valid field');
    }

    return parsedResponse;
  } catch (error) {
    console.error('Error evaluating combat action:', error);

    // Fallback to a simple keyword-based evaluation if API fails
    return fallbackEvaluation(input, character, monster);
  }
};

/**
 * Creates a detailed prompt for the OpenAI API
 */
const createPrompt = (
  input: string,
  character: any,
  monster: any,
  inventory: Item[]
): string => {
  // Format character abilities
  const abilitiesText = character.abilities
    .map(
      (ability: any, index: number) =>
        `${index}: ${ability.name} - ${ability.description} (Cooldown: ${ability.currentCooldown}/${ability.cooldown})`
    )
    .join('\n');

  // Format inventory items
  const inventoryText = inventory
    .map((item: Item) => `- ${item.name}: ${item.description}`)
    .join('\n');

  // Format equipped items
  const equippedWeapon = inventory.find(
    (item) => item.equipmentSlot === 'MainHand'
  );
  const equippedItems = inventory
    .filter((item) => item.equipmentSlot)
    .map((item) => `- ${item.equipmentSlot}: ${item.name}`)
    .join('\n');

  return `
PLAYER CHARACTER:
Race: ${character.race}
Profession: ${character.profession}
Level: ${character.level}
Stats: Strength ${character.stats.strength}, Dexterity ${
    character.stats.dexterity
  }, Intelligence ${character.stats.intelligence}, Vitality ${
    character.stats.vitality
  }

ABILITIES:
${abilitiesText}

EQUIPPED ITEMS:
${equippedItems || 'No items equipped'}

INVENTORY:
${inventoryText || 'Empty inventory'}

OPPONENT:
Name: ${monster.name}
Type: ${monster.type}
Level: ${monster.level}

PLAYER ACTION:
"${input}"

Evaluate if this action is realistic given the player's character details, abilities, equipped items, and inventory.
**Important:** Basic physical attacks (e.g., punching, kicking, or any unarmed strikes) should always be considered valid—even if no weapon is equipped. However, if the player attempts to use a weapon or item they do not possess, or uses an ability that is on cooldown, the action should be marked as invalid. For valid actions, calculate appropriate damage based on the character's stats and any relevant equipment or abilities.
`;
};

/**
 * Fallback evaluation function that uses simple keyword matching
 * This is used if the OpenAI API call fails
 */
const fallbackEvaluation = (
  input: string,
  character: any,
  monster: any
): CombatActionResponse => {
  const inputLower = input.toLowerCase();

  // Check for ability usage
  for (let i = 0; i < character.abilities.length; i++) {
    const ability = character.abilities[i];
    if (inputLower.includes(ability.name.toLowerCase())) {
      if (ability.currentCooldown > 0) {
        return {
          valid: false,
          message: `${ability.name} is on cooldown for ${ability.currentCooldown} more turns.`,
          reasoning: 'Ability is currently on cooldown',
        };
      }

      return {
        valid: true,
        action: 'ability',
        abilityIndex: i,
        damage: Math.floor(character.stats.strength * 1.2),
        message: `You used ${ability.name}!`,
        reasoning: 'Player used an available ability',
      };
    }
  }

  // Check for basic attacks
  if (
    inputLower.includes('attack') ||
    inputLower.includes('hit') ||
    inputLower.includes('strike') ||
    inputLower.includes('slash') ||
    inputLower.includes('stab') ||
    inputLower.includes('punch') ||
    inputLower.includes('kick')
  ) {
    // Calculate damage based on character's strength
    const damage = Math.floor(
      character.stats.strength * (0.8 + Math.random() * 0.4)
    );

    return {
      valid: true,
      action: 'attack',
      damage,
      message: `You attacked for ${damage} damage!`,
      reasoning: 'Basic attack is always available',
    };
  }

  // If no valid action found
  return {
    valid: false,
    message:
      "I don't understand that action. Try attacking or using an ability.",
    reasoning: 'Could not identify a valid combat action',
  };
};
