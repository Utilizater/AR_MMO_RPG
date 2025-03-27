import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import { LocationPoint, Coordinates } from '../types';

interface MapMarkersProps {
  userLocation: Coordinates;
  points: LocationPoint[];
  onMarkerPress: (point: LocationPoint) => void;
}

/**
 * Component for rendering different types of markers on the map
 */
const MapMarkers: React.FC<MapMarkersProps> = ({
  userLocation,
  points,
  onMarkerPress,
}) => {
  return (
    <>
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
      {points
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
            onPress={() => onMarkerPress(point)}>
            <Image
              source={point.data.image}
              style={styles.markerImage}
              resizeMode='contain'
            />
          </Marker>
        ))}

      {/* Treasure markers */}
      {points
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
            onPress={() => onMarkerPress(point)}>
            <Image
              source={point.data.image}
              style={styles.markerImage}
              resizeMode='contain'
            />
          </Marker>
        ))}

      {/* Quest markers - can be expanded in the future */}
      {points
        .filter((point) => point.type === 'quest')
        .map((point) => (
          <Marker
            key={point.id}
            coordinate={{
              latitude: point.latitude,
              longitude: point.longitude,
            }}
            title={point.name}
            description='Quest'
            pinColor='green'
            onPress={() => onMarkerPress(point)}
          />
        ))}
    </>
  );
};

const styles = StyleSheet.create({
  markerImage: {
    width: 40,
    height: 40,
  },
});

export default MapMarkers;
