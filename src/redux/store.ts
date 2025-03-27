import { configureStore } from '@reduxjs/toolkit';
import characterReducer from './slices/characterSlice';
import inventoryReducer from './slices/inventorySlice';
import combatReducer from './slices/combatSlice';

export const store = configureStore({
  reducer: {
    character: characterReducer,
    inventory: inventoryReducer,
    combat: combatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
