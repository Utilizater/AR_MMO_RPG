import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  Platform,
} from 'react-native';
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
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

// Location data for AR integration
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
    latitude: 37.7749, // Default to San Francisco
    longitude: -122.4194,
  });
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [locationPermission, setLocationPermission] = useState(false);

  // Request location permission
  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === 'granted');
      if (status !== 'granted') {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  // Get user's location
  const getUserLocation = async (): Promise<{
    latitude: number;
    longitude: number;
  }> => {
    if (locationPermission) {
      try {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const { latitude, longitude } = location.coords;

        // Update map region
        setMapRegion({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });

        return { latitude, longitude };
      } catch (error) {
        console.log('Error getting location:', error);
        // Fallback to default location
        return {
          latitude: 37.7749 + (Math.random() * 0.01 - 0.005),
          longitude: -122.4194 + (Math.random() * 0.01 - 0.005),
        };
      }
    } else {
      // Use mock location if permission not granted
      return {
        latitude: 37.7749 + (Math.random() * 0.01 - 0.005),
        longitude: -122.4194 + (Math.random() * 0.01 - 0.005),
      };
    }
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
        // The image will be automatically set based on monster type in the constructor
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

  // Request location permission on component mount
  useEffect(() => {
    requestLocationPermission();
  }, []);

  // Update location and nearby points periodically
  useEffect(() => {
    const updateLocationAndPoints = async () => {
      const newLocation = await getUserLocation();
      setUserLocation(newLocation);
      setNearbyPoints(generateNearbyPoints(newLocation));
    };

    // Initial update
    updateLocationAndPoints();

    // Set up interval for periodic updates
    const locationInterval = setInterval(updateLocationAndPoints, 10000); // Update every 10 seconds

    return () => clearInterval(locationInterval);
  }, [locationPermission]);

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
        <MapView
          style={styles.map}
          region={mapRegion}
          showsUserLocation={true}
          showsMyLocationButton={true}>
          {/* User's current location marker */}
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title='You'
            description='Your current location'
            pinColor='blue'
          />

          {/* Monster markers */}
          {nearbyPoints
            .filter((point) => point.type === 'monster')
            .map((point) => (
              <Marker
                key={point.id}
                coordinate={{
                  latitude: point.latitude,
                  longitude: point.longitude,
                }}
                title={point.name}
                description={`${point.data.difficulty} ${point.data.type}`}
                onPress={() => handlePointInteraction(point)}>
                <Image
                  source={point.data.image}
                  style={styles.markerImage}
                  resizeMode='contain'
                />
              </Marker>
            ))}

          {/* Treasure markers */}
          {nearbyPoints
            .filter((point) => point.type === 'treasure')
            .map((point) => (
              <Marker
                key={point.id}
                coordinate={{
                  latitude: point.latitude,
                  longitude: point.longitude,
                }}
                title={point.name}
                description='Collect gold and items'
                pinColor='gold'
                onPress={() => handlePointInteraction(point)}
              />
            ))}
        </MapView>

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
            {point.type === 'monster' && (
              <View style={styles.monsterImageContainer}>
                <Image
                  source={point.data.image}
                  style={styles.monsterImage}
                  resizeMode='contain'
                />
              </View>
            )}
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
        onPress={async () => {
          const newLocation = await getUserLocation();
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
    height: 300,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  markerImage: {
    width: 40,
    height: 40,
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
  monsterImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    height: 60,
  },
  monsterImage: {
    width: 60,
    height: 60,
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
