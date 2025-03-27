import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { startCombat } from '../redux/slices/combatSlice';
import {
  Monster,
  createMonster,
  MonsterType,
  MonsterDifficulty,
} from '../models/Monster';
import { generateLoot } from '../models/Item';

// Mock location data for AR integration
interface LocationPoint {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: 'monster' | 'treasure' | 'quest';
  data: any;
}

const GameMapScreen: React.FC = () => {
  const dispatch = useDispatch();
  const character = useSelector(
    (state: RootState) => state.character.character
  );
  const [nearbyPoints, setNearbyPoints] = useState<LocationPoint[]>([]);
  const [userLocation, setUserLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

  // Mock function to get user's location
  const getUserLocation = () => {
    // In a real app, this would use Expo Location or similar
    // For now, we'll just generate random coordinates
    return {
      latitude: 37.7749 + (Math.random() * 0.01 - 0.005),
      longitude: -122.4194 + (Math.random() * 0.01 - 0.005),
    };
  };

  // Mock function to generate nearby points of interest
  const generateNearbyPoints = (location: {
    latitude: number;
    longitude: number;
  }): LocationPoint[] => {
    // In a real app, these would be fetched from a server or generated based on real location
    const points: LocationPoint[] = [];

    // Generate 1-3 random monsters
    const monsterCount = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < monsterCount; i++) {
      const monsterTypes = Object.values(MonsterType);
      const randomType =
        monsterTypes[Math.floor(Math.random() * monsterTypes.length)];

      const difficulties = [MonsterDifficulty.EASY, MonsterDifficulty.NORMAL];
      const randomDifficulty =
        difficulties[Math.floor(Math.random() * difficulties.length)];

      // Create a basic monster
      const monster = createMonster(
        `monster_${i}`,
        `${randomType} ${i + 1}`,
        randomType,
        randomDifficulty,
        character ? character.level : 1,
        {
          strength: 10 + Math.floor(Math.random() * 5),
          dexterity: 10 + Math.floor(Math.random() * 5),
          intelligence: 10 + Math.floor(Math.random() * 5),
          vitality: 10 + Math.floor(Math.random() * 5),
          health: 100 + Math.floor(Math.random() * 50),
          mana: 50 + Math.floor(Math.random() * 20),
        },
        [
          {
            name: 'Slash',
            description: 'slashes with its claws',
            damage: 10 + Math.floor(Math.random() * 5),
            cooldown: 0,
            currentCooldown: 0,
          },
          {
            name: 'Bite',
            description: 'bites with sharp teeth',
            damage: 15 + Math.floor(Math.random() * 8),
            cooldown: 2,
            currentCooldown: 0,
          },
        ],
        {
          monsterId: `monster_${i}`,
          possibleItems: [],
          goldRange: { min: 5, max: 20 },
        },
        50 + Math.floor(Math.random() * 30)
      );

      points.push({
        id: `monster_${i}`,
        name: monster.name,
        latitude: location.latitude + (Math.random() * 0.002 - 0.001),
        longitude: location.longitude + (Math.random() * 0.002 - 0.001),
        type: 'monster',
        data: monster,
      });
    }

    // Add a treasure point
    points.push({
      id: 'treasure_1',
      name: 'Hidden Treasure',
      latitude: location.latitude + (Math.random() * 0.002 - 0.001),
      longitude: location.longitude + (Math.random() * 0.002 - 0.001),
      type: 'treasure',
      data: {
        gold: Math.floor(Math.random() * 50) + 10,
      },
    });

    return points;
  };

  // Update location and nearby points periodically
  useEffect(() => {
    const locationInterval = setInterval(() => {
      const newLocation = getUserLocation();
      setUserLocation(newLocation);
      setNearbyPoints(generateNearbyPoints(newLocation));
    }, 10000); // Update every 10 seconds

    // Initial update
    const initialLocation = getUserLocation();
    setUserLocation(initialLocation);
    setNearbyPoints(generateNearbyPoints(initialLocation));

    return () => clearInterval(locationInterval);
  }, []);

  // Handle interaction with a point on the map
  const handlePointInteraction = (point: LocationPoint) => {
    if (!character) return;

    switch (point.type) {
      case 'monster':
        // Start combat with the monster
        dispatch(
          startCombat({
            monster: point.data,
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

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Game Map</Text>

      <View style={styles.mapContainer}>
        {/* This would be replaced with an actual AR map view */}
        <Text style={styles.mapPlaceholder}>AR Map View</Text>
        <Text style={styles.locationText}>
          Your Location: {userLocation.latitude.toFixed(4)},{' '}
          {userLocation.longitude.toFixed(4)}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Nearby Points of Interest</Text>
      <View style={styles.pointsContainer}>
        {nearbyPoints.map((point) => (
          <TouchableOpacity
            key={point.id}
            style={[
              styles.pointCard,
              point.type === 'monster'
                ? styles.monsterCard
                : point.type === 'treasure'
                ? styles.treasureCard
                : styles.questCard,
            ]}
            onPress={() => handlePointInteraction(point)}>
            <Text style={styles.pointName}>{point.name}</Text>
            <Text style={styles.pointType}>{point.type.toUpperCase()}</Text>
            <Text style={styles.pointDistance}>
              Distance:{' '}
              {Math.sqrt(
                Math.pow((point.latitude - userLocation.latitude) * 111000, 2) +
                  Math.pow(
                    (point.longitude - userLocation.longitude) * 111000,
                    2
                  )
              ).toFixed(0)}{' '}
              meters
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.refreshButton}
        onPress={() => {
          const newLocation = getUserLocation();
          setUserLocation(newLocation);
          setNearbyPoints(generateNearbyPoints(newLocation));
        }}>
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
  mapContainer: {
    height: 200,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  mapPlaceholder: {
    fontSize: 18,
    color: '#666',
  },
  locationText: {
    fontSize: 12,
    color: '#666',
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  pointsContainer: {
    flex: 1,
  },
  pointCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  monsterCard: {
    backgroundColor: '#ffebee',
    borderLeftWidth: 5,
    borderLeftColor: '#f44336',
  },
  treasureCard: {
    backgroundColor: '#fff9c4',
    borderLeftWidth: 5,
    borderLeftColor: '#ffc107',
  },
  questCard: {
    backgroundColor: '#e3f2fd',
    borderLeftWidth: 5,
    borderLeftColor: '#2196f3',
  },
  pointName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  pointType: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  pointDistance: {
    fontSize: 12,
    color: '#666',
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
