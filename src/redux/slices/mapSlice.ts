import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import {
  LocationPoint,
  Coordinates,
  TreasureData,
} from '../../features/map/types';
import {
  generateNearbyPoints,
  calculateDistance,
} from '../../features/map/services/pointsOfInterestService';
import { serializeMonster } from '../../utils/serializationUtils';
import { Monster } from '../../models/Monster';
import { RootState } from '../store';
import { endCombat } from './combatSlice';

// Thunk to handle monster defeat in combat
export const handleMonsterDefeat = createAsyncThunk(
  'map/handleMonsterDefeat',
  async (monsterId: string, { dispatch }) => {
    // End combat with monsterDefeated flag
    dispatch(endCombat({ monsterDefeated: true }));

    // Remove the monster from the map
    dispatch(defeatMonster(monsterId));

    return monsterId;
  }
);

// Thunk to handle treasure collection
export const handleTreasureCollection = createAsyncThunk(
  'map/handleTreasureCollection',
  async (treasureId: string, { dispatch, getState }) => {
    // Get the treasure data
    const state = getState() as RootState;
    const treasure = state.map.pointsOfInterest.find(
      (point) => point.id === treasureId && point.type === 'treasure'
    );

    if (treasure) {
      // Remove the treasure from the map
      dispatch(collectTreasure(treasureId));

      // Return the treasure data for further processing (e.g., adding gold to inventory)
      return treasure.data as TreasureData;
    }

    return null;
  }
);

interface MapState {
  userLocation: Coordinates | null;
  pointsOfInterest: LocationPoint[];
  interactionRadius: number; // Distance in meters within which a user can interact with a point
}

const initialState: MapState = {
  userLocation: null,
  pointsOfInterest: [],
  interactionRadius: 50, // Default interaction radius in meters
};

export const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setUserLocation: (state, action: PayloadAction<Coordinates>) => {
      state.userLocation = action.payload;
    },

    generatePoints: (
      state,
      action: PayloadAction<{ location: Coordinates; characterLevel: number }>
    ) => {
      const { location, characterLevel } = action.payload;
      // Generate new points of interest
      const newPoints = generateNearbyPoints(location, characterLevel);

      // Serialize monster objects to make them Redux-compatible
      const serializedPoints = newPoints.map((point) => {
        if (point.type === 'monster') {
          return {
            ...point,
            data: serializeMonster(point.data),
          };
        }
        return point;
      });

      state.pointsOfInterest = serializedPoints;
    },

    removePoint: (state, action: PayloadAction<string>) => {
      // Remove a point by ID (when collected or killed)
      state.pointsOfInterest = state.pointsOfInterest.filter(
        (point) => point.id !== action.payload
      );
    },

    collectTreasure: (state, action: PayloadAction<string>) => {
      // Find the treasure point
      const treasurePoint = state.pointsOfInterest.find(
        (point) => point.id === action.payload && point.type === 'treasure'
      );

      // If found, remove it from the map
      if (treasurePoint) {
        state.pointsOfInterest = state.pointsOfInterest.filter(
          (point) => point.id !== action.payload
        );
      }
    },

    defeatMonster: (state, action: PayloadAction<string>) => {
      // Find the monster point
      const monsterPoint = state.pointsOfInterest.find(
        (point) => point.id === action.payload && point.type === 'monster'
      );

      // If found, remove it from the map
      if (monsterPoint) {
        state.pointsOfInterest = state.pointsOfInterest.filter(
          (point) => point.id !== action.payload
        );
      }
    },

    // Add a new point of interest (for testing or special events)
    addPoint: (state, action: PayloadAction<LocationPoint>) => {
      const point = action.payload;

      // Serialize monster objects if needed
      if (point.type === 'monster') {
        state.pointsOfInterest.push({
          ...point,
          data: serializeMonster(point.data),
        });
      } else {
        state.pointsOfInterest.push(point);
      }
    },
  },
});

export const {
  setUserLocation,
  generatePoints,
  removePoint,
  collectTreasure,
  defeatMonster,
  addPoint,
} = mapSlice.actions;

export default mapSlice.reducer;
