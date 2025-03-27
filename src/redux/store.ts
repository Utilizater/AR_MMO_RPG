import { configureStore } from '@reduxjs/toolkit';
import characterReducer from './slices/characterSlice';
import inventoryReducer from './slices/inventorySlice';
import combatReducer from './slices/combatSlice';
import mapReducer from './slices/mapSlice';

export const store = configureStore({
  reducer: {
    character: characterReducer,
    inventory: inventoryReducer,
    combat: combatReducer,
    map: mapReducer,
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
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
