import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { RootState } from '../../redux/store';
import { startCombat } from '../../redux/slices/combatSlice';
import { LocationPoint } from './types';
import { useLocation } from './hooks/useLocation';
import GameMap from './components/GameMap';
import PointsOfInterestList from './components/PointsOfInterestList';
import { serializeMonster } from '../../utils/serializationUtils';
import {
  setUserLocation,
  generatePoints,
  handleTreasureCollection,
  handleMonsterDefeat,
} from '../../redux/slices/mapSlice';

/**
 * Main screen component for the game map
 */
const GameMapScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const character = useSelector(
    (state: RootState) => state.character.character
  );

  // Use custom hooks for location
  const { userLocation, mapRegion, updateLocation, zoomIn, zoomOut } =
    useLocation();

  // Get points of interest from Redux store
  const points = useSelector((state: RootState) => state.map.pointsOfInterest);

  // Initialize points of interest when location changes
  useEffect(() => {
    if (userLocation && character) {
      dispatch(setUserLocation(userLocation));
      dispatch(
        generatePoints({
          location: userLocation,
          characterLevel: character.level,
        })
      );
    }
  }, [userLocation, character, dispatch]);

  // Handle interaction with a point on the map
  const handlePointInteraction = (point: LocationPoint) => {
    if (!character) return;

    switch (point.type) {
      case 'monster':
        // Start combat with the monster - serialize the monster object first
        dispatch(
          startCombat({
            monster: serializeMonster(point.data),
            monsterId: point.id,
            playerHealth: character.stats.health,
            playerMana: character.stats.mana,
          })
        );
        break;

      case 'treasure':
        // Show treasure found alert
        Alert.alert('Treasure Found!', `You found ${point.data.gold} gold!`, [
          {
            text: 'Collect',
            onPress: () => {
              // Dispatch the treasure collection action
              dispatch(handleTreasureCollection(point.id));
            },
          },
        ]);
        break;

      case 'quest':
        // Handle quest interaction
        Alert.alert('Quest', `Quest: ${point.name}`, [
          { text: 'Accept', onPress: () => console.log('Quest accepted') },
        ]);
        break;
    }
  };

  // Refresh map and points of interest
  const handleRefresh = async () => {
    const newLocation = await updateLocation();
    if (newLocation && character) {
      dispatch(setUserLocation(newLocation));
      dispatch(
        generatePoints({
          location: newLocation,
          characterLevel: character.level,
        })
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Game Map</Text>

      {/* Map component with zoom controls */}
      <GameMap
        mapRegion={mapRegion}
        userLocation={userLocation}
        points={points}
        onMarkerPress={handlePointInteraction}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
      />

      {/* Points of interest list */}
      <PointsOfInterestList
        points={points}
        userLocation={userLocation}
        onPointPress={handlePointInteraction}
      />

      {/* Refresh button */}
      <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
        <Text style={styles.refreshButtonText}>Refresh Map</Text>
      </TouchableOpacity>
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
  refreshButton: {
    backgroundColor: '#4a80f5',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GameMapScreen;
