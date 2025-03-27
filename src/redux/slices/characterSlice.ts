import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Profession, Race, Character } from '../../models/Character';

interface CharacterState {
  character: Character | null;
  isCreating: boolean;
}

const initialState: CharacterState = {
  character: null,
  isCreating: false,
};

export const characterSlice = createSlice({
  name: 'character',
  initialState,
  reducers: {
    startCharacterCreation: (state) => {
      state.isCreating = true;
    },
    createCharacter: (
      state,
      action: PayloadAction<{
        profession: Profession;
        race: Race;
        name: string;
      }>
    ) => {
      const { profession, race, name } = action.payload;
      state.character = new Character(name, profession, race);
      state.isCreating = false;
    },
    levelUp: (state) => {
      if (state.character) {
        state.character.levelUp();
      }
    },
    gainExperience: (state, action: PayloadAction<number>) => {
      if (state.character) {
        state.character.gainExperience(action.payload);
      }
    },
  },
});

export const {
  startCharacterCreation,
  createCharacter,
  levelUp,
  gainExperience,
} = characterSlice.actions;

export default characterSlice.reducer;
