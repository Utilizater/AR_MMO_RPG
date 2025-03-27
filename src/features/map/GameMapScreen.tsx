import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { startCombat } from '../../redux/slices/combatSlice';
import { LocationPoint } from './types';
import { useLocation } from './hooks/useLocation';
import { usePointsOfInterest } from './hooks/usePointsOfInterest';
import GameMap from './components/GameMap';
import PointsOfInterestList from './components/PointsOfInterestList';
import { serializeMonster } from '../../utils/serializationUtils';

/**
 * Main screen component for the game map
 */
const GameMapScreen: React.FC = () => {
  const dispatch = useDispatch();
  const character = useSelector(
    (state: RootState) => state.character.character
  );

  // Use custom hooks for location and points of interest
  const { userLocation, mapRegion, updateLocation, zoomIn, zoomOut } =
    useLocation();

  const { points, updatePoints } = usePointsOfInterest(
    userLocation,
    character ? character.level : 1
  );

  // Handle interaction with a point on the map
  const handlePointInteraction = (point: LocationPoint) => {
    if (!character) return;

    switch (point.type) {
      case 'monster':
        // Start combat with the monster - serialize the monster object first
        dispatch(
          startCombat({
            monster: serializeMonster(point.data),
            playerHealth: character.stats.health,
            playerMana: character.stats.mana,
          })
        );
        break;

      case 'treasure':
        // Show treasure found alert
        Alert.alert('Treasure Found!', `You found ${point.data.gold} gold!`, [
          { text: 'Collect', onPress: () => console.log('Treasure collected') },
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
    updatePoints();
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
