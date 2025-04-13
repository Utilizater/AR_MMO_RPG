import { useState, useEffect, useCallback } from 'react';
import { Coordinates, MapRegion } from '../types';
import {
  requestLocationPermission,
  getUserLocation,
  createMapRegion,
} from '../services/locationService';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

/**
 * Custom hook for managing location-related state and logic
 * @returns Location-related state and functions
 */
export const useLocation = () => {
  const [locationPermission, setLocationPermission] = useState(false);
  const [userLocation, setUserLocation] = useState<Coordinates>({
    latitude: 37.7749, // Default to San Francisco
    longitude: -122.4194,
  });
  const [mapRegion, setMapRegion] = useState<MapRegion>({
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.005, // Default zoom level (closer than original)
    longitudeDelta: 0.005,
  });
  const [zoomLevel, setZoomLevel] = useState(0.005);

  // Get current screen from Redux store
  const currentScreen = useSelector(
    (state: RootState) => state.navigation.currentScreen
  );

  // Request location permission on mount
  useEffect(() => {
    const getPermission = async () => {
      const hasPermission = await requestLocationPermission();
      setLocationPermission(hasPermission);
    };

    getPermission();
  }, []);

  // Update location when permission changes
  useEffect(() => {
    updateLocation();

    // Set up interval for periodic updates
    const locationInterval = setInterval(updateLocation, 60000); // Update every 60 seconds

    return () => clearInterval(locationInterval);
  }, [locationPermission]);

  // Function to update user location
  const updateLocation = useCallback(async () => {
    const newLocation = await getUserLocation(locationPermission);
    setUserLocation(newLocation);

    // Only update map region if we're on the map screen
    if (currentScreen === 'GAME_MAP') {
      setMapRegion(createMapRegion(newLocation, zoomLevel));
    }

    return newLocation;
  }, [locationPermission, zoomLevel, currentScreen]);

  // Zoom in function
  const zoomIn = useCallback(() => {
    const newZoomLevel = Math.max(zoomLevel / 1.5, 0.001);
    setZoomLevel(newZoomLevel);
    setMapRegion(createMapRegion(userLocation, newZoomLevel));
  }, [zoomLevel, userLocation]);

  // Zoom out function
  const zoomOut = useCallback(() => {
    const newZoomLevel = Math.min(zoomLevel * 1.5, 0.05);
    setZoomLevel(newZoomLevel);
    setMapRegion(createMapRegion(userLocation, newZoomLevel));
  }, [zoomLevel, userLocation]);

  return {
    locationPermission,
    userLocation,
    mapRegion,
    zoomLevel,
    updateLocation,
    zoomIn,
    zoomOut,
  };
};
