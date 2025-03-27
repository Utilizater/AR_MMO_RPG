import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Monster } from '../../models/Monster';
import { LootTable, generateLoot } from '../../models/Item';
// We're using serialized monster objects in the state
type SerializedMonster = Omit<Monster, 'chooseAttack' | 'updateCooldowns'>;

interface CombatState {
  inCombat: boolean;
  currentMonster: SerializedMonster | null;
  playerHealth: number;
  playerMana: number;
  monsterHealth: number;
  turnCount: number;
  combatLog: string[];
  playerEffects: {
    type: string;
    value: number;
    duration: number;
  }[];
  monsterEffects: {
    type: string;
    value: number;
    duration: number;
  }[];
}

const initialState: CombatState = {
  inCombat: false,
  currentMonster: null,
  playerHealth: 0,
  playerMana: 0,
  monsterHealth: 0,
  turnCount: 0,
  combatLog: [],
  playerEffects: [],
  monsterEffects: [],
};

export const combatSlice = createSlice({
  name: 'combat',
  initialState,
  reducers: {
    startCombat: (
      state,
      action: PayloadAction<{
        monster: SerializedMonster;
        playerHealth: number;
        playerMana: number;
      }>
    ) => {
      const { monster, playerHealth, playerMana } = action.payload;

      state.inCombat = true;
      state.currentMonster = monster;
      state.playerHealth = playerHealth;
      state.playerMana = playerMana;
      state.monsterHealth = monster.stats.health;
      state.turnCount = 0;
      state.combatLog = [`Combat started with ${monster.name}!`];
      state.playerEffects = [];
      state.monsterEffects = [];
    },

    endCombat: (state) => {
      state.inCombat = false;
      state.currentMonster = null;
      state.combatLog.push('Combat ended.');
    },

    playerAttack: (
      state,
      action: PayloadAction<{ damage: number; description: string }>
    ) => {
      const { damage, description } = action.payload;

      // Apply damage to monster
      state.monsterHealth = Math.max(0, state.monsterHealth - damage);

      // Add to combat log
      state.combatLog.push(`Player ${description} for ${damage} damage.`);

      // Check if monster is defeated
      if (state.monsterHealth <= 0) {
        state.combatLog.push(`${state.currentMonster?.name} was defeated!`);
      }
    },

    monsterAttack: (
      state,
      action: PayloadAction<{ damage: number; description: string }>
    ) => {
      const { damage, description } = action.payload;

      // Apply damage to player
      state.playerHealth = Math.max(0, state.playerHealth - damage);

      // Add to combat log
      state.combatLog.push(
        `${state.currentMonster?.name} ${description} for ${damage} damage.`
      );

      // Check if player is defeated
      if (state.playerHealth <= 0) {
        state.combatLog.push('Player was defeated!');
      }
    },

    useAbility: (
      state,
      action: PayloadAction<{
        manaCost: number;
        effect: any;
        description: string;
      }>
    ) => {
      const { manaCost, effect, description } = action.payload;

      // Reduce player mana
      state.playerMana = Math.max(0, state.playerMana - manaCost);

      // Add to combat log
      state.combatLog.push(`Player used ${description}.`);

      // Handle different effect types
      if (effect.type === 'damage') {
        state.monsterHealth = Math.max(0, state.monsterHealth - effect.value);
        state.combatLog.push(
          `Dealt ${effect.value} damage to ${state.currentMonster?.name}.`
        );
      } else if (effect.type === 'heal') {
        state.playerHealth += effect.value;
        state.combatLog.push(`Healed for ${effect.value} health.`);
      } else if (effect.type === 'buff') {
        state.playerEffects.push({
          type: effect.effect.type,
          value: effect.effect.value,
          duration: effect.effect.duration,
        });
        state.combatLog.push(
          `Gained ${effect.effect.type} buff for ${effect.effect.duration} turns.`
        );
      } else if (effect.type === 'damage_and_effect') {
        // Apply damage
        state.monsterHealth = Math.max(0, state.monsterHealth - effect.damage);
        state.combatLog.push(
          `Dealt ${effect.damage} damage to ${state.currentMonster?.name}.`
        );

        // Apply effect
        state.monsterEffects.push({
          type: effect.effect.type,
          value: effect.effect.value || 0,
          duration: effect.effect.duration,
        });
        state.combatLog.push(
          `Applied ${effect.effect.type} effect to ${state.currentMonster?.name} for ${effect.effect.duration} turns.`
        );
      }

      // Check if monster is defeated
      if (state.monsterHealth <= 0) {
        state.combatLog.push(`${state.currentMonster?.name} was defeated!`);
      }
    },

    nextTurn: (state) => {
      state.turnCount += 1;
      state.combatLog.push(`--- Turn ${state.turnCount} ---`);

      // Update player effects
      state.playerEffects = state.playerEffects
        .map((effect) => ({ ...effect, duration: effect.duration - 1 }))
        .filter((effect) => effect.duration > 0);

      // Update monster effects
      state.monsterEffects = state.monsterEffects
        .map((effect) => ({ ...effect, duration: effect.duration - 1 }))
        .filter((effect) => effect.duration > 0);
    },

    applyEffects: (state) => {
      // Apply damage over time effects to monster
      for (const effect of state.monsterEffects) {
        if (effect.type === 'poison') {
          const damage = effect.value;
          state.monsterHealth = Math.max(0, state.monsterHealth - damage);
          state.combatLog.push(
            `${state.currentMonster?.name} took ${damage} poison damage.`
          );
        }
      }

      // Apply damage over time effects to player
      for (const effect of state.playerEffects) {
        if (effect.type === 'poison') {
          const damage = effect.value;
          state.playerHealth = Math.max(0, state.playerHealth - damage);
          state.combatLog.push(`Player took ${damage} poison damage.`);
        }
      }

      // Check if monster is defeated
      if (state.monsterHealth <= 0) {
        state.combatLog.push(`${state.currentMonster?.name} was defeated!`);
      }

      // Check if player is defeated
      if (state.playerHealth <= 0) {
        state.combatLog.push('Player was defeated!');
      }
    },

    addToCombatLog: (state, action: PayloadAction<string>) => {
      state.combatLog.push(action.payload);
    },
  },
});

export const {
  startCombat,
  endCombat,
  playerAttack,
  monsterAttack,
  useAbility,
  nextTurn,
  applyEffects,
  addToCombatLog,
} = combatSlice.actions;

export default combatSlice.reducer;
