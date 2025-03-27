import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import {
  endCombat,
  playerAttack,
  monsterAttack,
  useAbility,
  nextTurn,
  applyEffects,
  addToCombatLog,
} from '../redux/slices/combatSlice';
import { gainExperience } from '../redux/slices/characterSlice';
import { addItem, addGold } from '../redux/slices/inventorySlice';
import { generateLoot } from '../models/Item';
import {
  deserializeMonster,
  deserializeCharacter,
} from '../utils/serializationUtils';

// Mock LLM parsing function
const parseCombatAction = (
  input: string,
  character: any,
  monster: any
): {
  valid: boolean;
  action?: string;
  damage?: number;
  abilityIndex?: number;
  message?: string;
} => {
  // In a real app, this would call an LLM API
  // For now, we'll use simple keyword matching

  const inputLower = input.toLowerCase();

  // Check for ability usage
  for (let i = 0; i < character.abilities.length; i++) {
    const ability = character.abilities[i];
    if (inputLower.includes(ability.name.toLowerCase())) {
      if (ability.currentCooldown > 0) {
        return {
          valid: false,
          message: `${ability.name} is on cooldown for ${ability.currentCooldown} more turns.`,
        };
      }

      return {
        valid: true,
        action: 'ability',
        abilityIndex: i,
      };
    }
  }

  // Check for basic attacks
  if (
    inputLower.includes('attack') ||
    inputLower.includes('hit') ||
    inputLower.includes('strike') ||
    inputLower.includes('slash') ||
    inputLower.includes('stab')
  ) {
    // Calculate damage based on character's strength
    const damage = Math.floor(
      character.stats.strength * (0.8 + Math.random() * 0.4)
    );

    return {
      valid: true,
      action: 'attack',
      damage,
    };
  }

  // If no valid action found
  return {
    valid: false,
    message:
      "I don't understand that action. Try attacking or using an ability.",
  };
};

const CombatScreen: React.FC = () => {
  const dispatch = useDispatch();
  const combat = useSelector((state: RootState) => state.combat);
  const character = useSelector(
    (state: RootState) => state.character.character
  );

  const [actionInput, setActionInput] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);

  // Check if combat is over
  useEffect(() => {
    if (combat.inCombat) {
      if (combat.monsterHealth <= 0) {
        // Monster defeated
        handleMonsterDefeated();
      } else if (combat.playerHealth <= 0) {
        // Player defeated
        handlePlayerDefeated();
      }
    }
  }, [combat.monsterHealth, combat.playerHealth, combat.inCombat]);

  const handleMonsterDefeated = () => {
    if (!character || !combat.currentMonster) return;

    // Add experience
    dispatch(gainExperience(combat.currentMonster.experienceValue));

    // Generate loot
    const loot = generateLoot(combat.currentMonster.lootTable);

    // Add gold
    dispatch(addGold(loot.gold));

    // Add items to inventory
    loot.items.forEach((item) => {
      dispatch(addItem(item));
    });

    // Add victory message to combat log
    dispatch(
      addToCombatLog(
        `You defeated ${combat.currentMonster.name} and gained ${combat.currentMonster.experienceValue} experience!`
      )
    );
    dispatch(addToCombatLog(`You found ${loot.gold} gold!`));
    if (loot.items.length > 0) {
      dispatch(addToCombatLog(`You found ${loot.items.length} item(s)!`));
    }

    // End combat
    setTimeout(() => {
      dispatch(endCombat());
    }, 2000);
  };

  const handlePlayerDefeated = () => {
    dispatch(addToCombatLog('You have been defeated!'));

    // End combat
    setTimeout(() => {
      dispatch(endCombat());
    }, 2000);
  };

  const handleActionSubmit = () => {
    if (!character || !combat.currentMonster || !combat.inCombat) return;

    // Reset error
    setActionError(null);

    // Deserialize the character to access methods
    const deserializedCharacter = deserializeCharacter(character);

    // Parse the action
    const result = parseCombatAction(
      actionInput,
      deserializedCharacter,
      combat.currentMonster
    );

    if (!result.valid) {
      setActionError(result.message || 'Invalid action');
      return;
    }

    // Handle the action
    if (result.action === 'attack') {
      dispatch(
        playerAttack({
          damage: result.damage || 0,
          description: actionInput,
        })
      );
    } else if (
      result.action === 'ability' &&
      result.abilityIndex !== undefined
    ) {
      const ability = deserializedCharacter.abilities[result.abilityIndex];
      const abilityResult = deserializedCharacter.useAbility(
        result.abilityIndex,
        combat.currentMonster
      );

      if (abilityResult.success) {
        dispatch(
          useAbility({
            manaCost: 10, // This would be defined in the ability
            effect: abilityResult.result,
            description: ability.name,
          })
        );
      } else {
        setActionError(abilityResult.message);
        return;
      }
    }

    // Clear input
    setActionInput('');

    // Monster's turn
    setTimeout(() => {
      if (combat.monsterHealth > 0) {
        const monsterData = combat.currentMonster;
        if (!monsterData) return;

        // Create a monster-like object with methods
        const monster = deserializeMonster(monsterData);

        // Choose an attack
        const attack = monster.chooseAttack();

        // Apply attack
        dispatch(
          monsterAttack({
            damage: attack.damage,
            description: attack.description,
          })
        );

        // Update cooldowns and apply effects
        dispatch(applyEffects());
        dispatch(nextTurn());
      }
    }, 1000);
  };

  if (!combat.inCombat || !combat.currentMonster || !character) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Combat</Text>
        <Text style={styles.emptyText}>No active combat</Text>
      </View>
    );
  }

  // Calculate health percentages
  const playerHealthPercent =
    (combat.playerHealth / character.stats.health) * 100;
  const monsterHealthPercent =
    (combat.monsterHealth / combat.currentMonster.stats.health) * 100;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Combat</Text>

      <View style={styles.combatantsContainer}>
        <View style={styles.combatantCard}>
          <Text style={styles.combatantName}>{character.name}</Text>
          <View style={styles.healthBarContainer}>
            <View
              style={[
                styles.healthBar,
                styles.playerHealthBar,
                { width: `${playerHealthPercent}%` },
              ]}
            />
          </View>
          <Text style={styles.healthText}>
            HP: {combat.playerHealth}/{character.stats.health}
          </Text>
          <Text style={styles.manaText}>
            MP: {combat.playerMana}/{character.stats.mana}
          </Text>
        </View>

        <Text style={styles.vsText}>VS</Text>

        <View style={styles.combatantCard}>
          <Text style={styles.combatantName}>{combat.currentMonster.name}</Text>
          <View style={styles.monsterImageContainer}>
            <Image
              source={combat.currentMonster.image}
              style={styles.monsterImage}
              resizeMode='contain'
            />
          </View>
          <View style={styles.healthBarContainer}>
            <View
              style={[
                styles.healthBar,
                styles.monsterHealthBar,
                { width: `${monsterHealthPercent}%` },
              ]}
            />
          </View>
          <Text style={styles.healthText}>
            HP: {combat.monsterHealth}/{combat.currentMonster.stats.health}
          </Text>
          <Text style={styles.monsterType}>
            {combat.currentMonster.type} (Level {combat.currentMonster.level})
          </Text>
        </View>
      </View>

      <View style={styles.abilitiesContainer}>
        <Text style={styles.sectionTitle}>Abilities:</Text>
        <ScrollView horizontal style={styles.abilitiesScroll}>
          {character.abilities.map((ability, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.abilityButton,
                ability.currentCooldown > 0 ? styles.abilityCooldown : null,
              ]}
              onPress={() => {
                setActionInput(`Use ${ability.name}`);
              }}
              disabled={ability.currentCooldown > 0}>
              <Text style={styles.abilityName}>{ability.name}</Text>
              {ability.currentCooldown > 0 && (
                <Text style={styles.cooldownText}>
                  {ability.currentCooldown}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.combatLogContainer}>
        <Text style={styles.sectionTitle}>Combat Log:</Text>
        <ScrollView style={styles.combatLog}>
          {combat.combatLog.map((log, index) => (
            <Text key={index} style={styles.logEntry}>
              {log}
            </Text>
          ))}
        </ScrollView>
      </View>

      <View style={styles.actionContainer}>
        <TextInput
          style={styles.actionInput}
          value={actionInput}
          onChangeText={setActionInput}
          placeholder='Describe your action...'
          placeholderTextColor='#999'
        />
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleActionSubmit}
          disabled={!actionInput.trim()}>
          <Text style={styles.actionButtonText}>Act</Text>
        </TouchableOpacity>
      </View>

      {actionError && <Text style={styles.errorText}>{actionError}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  combatantsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  combatantCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    width: '40%',
  },
  combatantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  monsterImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    height: 80,
  },
  monsterImage: {
    width: '100%',
    height: '100%',
  },
  healthBarContainer: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 5,
  },
  healthBar: {
    height: '100%',
  },
  playerHealthBar: {
    backgroundColor: '#4caf50',
  },
  monsterHealthBar: {
    backgroundColor: '#f44336',
  },
  healthText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  manaText: {
    fontSize: 12,
    color: '#2196f3',
  },
  monsterType: {
    fontSize: 12,
    color: '#ff9800',
  },
  vsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  abilitiesContainer: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  abilitiesScroll: {
    flexDirection: 'row',
  },
  abilityButton: {
    backgroundColor: '#4a80f5',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    minWidth: 100,
    alignItems: 'center',
  },
  abilityCooldown: {
    backgroundColor: '#9e9e9e',
  },
  abilityName: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cooldownText: {
    color: '#fff',
    fontSize: 12,
  },
  combatLogContainer: {
    flex: 1,
    marginBottom: 15,
  },
  combatLog: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
  },
  logEntry: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  actionContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  actionInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  actionButton: {
    backgroundColor: '#4a80f5',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#f44336',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default CombatScreen;
