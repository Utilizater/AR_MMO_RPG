import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LocationPoint, Coordinates } from '../types';
import PointOfInterestCard from './PointOfInterestCard';

interface PointsOfInterestListProps {
  points: LocationPoint[];
  userLocation: Coordinates;
  onPointPress: (point: LocationPoint) => void;
}

/**
 * Component for rendering a list of points of interest
 */
const PointsOfInterestList: React.FC<PointsOfInterestListProps> = ({
  points,
  userLocation,
  onPointPress,
}) => {
  if (points.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No nearby points of interest found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Nearby Points of Interest</Text>
      <ScrollView style={styles.scrollView}>
        {points.map((point) => (
          <PointOfInterestCard
            key={point.id}
            point={point}
            userLocation={userLocation}
            onPress={onPointPress}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default PointsOfInterestList;
