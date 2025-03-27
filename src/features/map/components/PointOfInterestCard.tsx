import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LocationPoint, Coordinates } from '../types';
import { calculateDistance } from '../services/pointsOfInterestService';

interface PointOfInterestCardProps {
  point: LocationPoint;
  userLocation: Coordinates;
  onPress: (point: LocationPoint) => void;
}

/**
 * Component for rendering a point of interest card
 */
const PointOfInterestCard: React.FC<PointOfInterestCardProps> = ({
  point,
  userLocation,
  onPress,
}) => {
  // Calculate distance to point
  const distance = calculateDistance(userLocation, point);

  return (
    <TouchableOpacity
      style={[
        styles.pointCard,
        point.type === 'monster'
          ? styles.monsterCard
          : point.type === 'treasure'
          ? styles.treasureCard
          : styles.questCard,
      ]}
      onPress={() => onPress(point)}>
      {(point.type === 'monster' || point.type === 'treasure') && (
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
        Distance: {distance.toFixed(0)} meters
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
});

export default PointOfInterestCard;
