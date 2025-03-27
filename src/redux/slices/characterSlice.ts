import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Profession, Race, Character } from '../../models/Character';
import {
  serializeCharacter,
  deserializeCharacter,
} from '../../utils/serializationUtils';

// Define a type for serialized character
type SerializedCharacter = Omit<
  Character,
  'gainExperience' | 'levelUp' | 'useAbility' | 'updateCooldowns'
>;

interface CharacterState {
  character: SerializedCharacter | null;
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
      // Create a character instance, then serialize it for Redux
      const character = new Character(name, profession, race);
      state.character = serializeCharacter(character);
      state.isCreating = false;
    },
    levelUp: (state) => {
      if (state.character) {
        // Deserialize, update, then serialize back
        const character = deserializeCharacter(state.character);
        character.levelUp();
        state.character = serializeCharacter(character);
      }
    },
    gainExperience: (state, action: PayloadAction<number>) => {
      if (state.character) {
        // Deserialize, update, then serialize back
        const character = deserializeCharacter(state.character);
        character.gainExperience(action.payload);
        state.character = serializeCharacter(character);
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
