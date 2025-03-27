import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView from 'react-native-maps';
import { MapRegion, LocationPoint, Coordinates } from '../types';
import MapMarkers from './MapMarkers';

interface GameMapProps {
  mapRegion: MapRegion;
  userLocation: Coordinates;
  points: LocationPoint[];
  onMarkerPress: (point: LocationPoint) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

/**
 * Component for rendering the game map with zoom controls
 */
const GameMap: React.FC<GameMapProps> = ({
  mapRegion,
  userLocation,
  points,
  onMarkerPress,
  onZoomIn,
  onZoomOut,
}) => {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={mapRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}>
        <MapMarkers
          userLocation={userLocation}
          points={points}
          onMarkerPress={onMarkerPress}
        />
      </MapView>

      {/* Zoom controls */}
      <View style={styles.zoomControls}>
        <TouchableOpacity style={styles.zoomButton} onPress={onZoomIn}>
          <Text style={styles.zoomButtonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.zoomButton} onPress={onZoomOut}>
          <Text style={styles.zoomButtonText}>-</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.locationText}>
        Your Location: {userLocation.latitude.toFixed(4)},{' '}
        {userLocation.longitude.toFixed(4)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  zoomControls: {
    position: 'absolute',
    right: 16,
    top: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 8,
    overflow: 'hidden',
  },
  zoomButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  zoomButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  locationText: {
    fontSize: 12,
    color: '#666',
    marginTop: 10,
  },
});

export default GameMap;
