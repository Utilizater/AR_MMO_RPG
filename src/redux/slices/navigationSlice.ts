import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum ScreenType {
  CHARACTER_CREATION = 'CHARACTER_CREATION',
  GAME_MAP = 'GAME_MAP',
  INVENTORY = 'INVENTORY',
  COMBAT = 'COMBAT',
  CHARACTER_INFO = 'CHARACTER_INFO',
}

interface NavigationState {
  currentScreen: ScreenType;
}

const initialState: NavigationState = {
  currentScreen: ScreenType.CHARACTER_CREATION,
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setCurrentScreen: (state, action: PayloadAction<ScreenType>) => {
      state.currentScreen = action.payload;
    },
  },
});

export const { setCurrentScreen } = navigationSlice.actions;
export default navigationSlice.reducer;
