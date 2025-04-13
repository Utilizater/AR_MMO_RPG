import { configureStore } from '@reduxjs/toolkit';
import characterReducer from './slices/characterSlice';
import inventoryReducer from './slices/inventorySlice';
import combatReducer from './slices/combatSlice';
import mapReducer from './slices/mapSlice';
import navigationReducer from './slices/navigationSlice';
import { initialItems } from '../data/items';

const preloadedState = {
  inventory: {
    items: initialItems,
    equippedItems: {
      HEAD: null,
      CHEST: null,
      LEGS: null,
      FEET: null,
      MAIN_HAND: null,
      OFF_HAND: null,
      NECK: null,
      RING: null,
    },
    gold: 100,
    maxInventorySize: 20,
  },
};

export const store = configureStore({
  reducer: {
    character: characterReducer,
    inventory: inventoryReducer,
    combat: combatReducer,
    map: mapReducer,
    navigation: navigationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['combat/startCombat', 'character/createCharacter'],
        // Ignore these field paths in all actions
        ignoredActionPaths: [
          'payload.monster',
          'meta.arg.monster',
          'payload.character',
          'meta.arg.character',
        ],
        // Ignore these paths in the state
        ignoredPaths: ['combat.currentMonster', 'character.character'],
      },
    }),
  preloadedState,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
