import { useState, useEffect, useCallback } from 'react';
import { Coordinates, MapRegion } from '../types';
import {
  requestLocationPermission,
  getUserLocation,
  createMapRegion,
} from '../services/locationService';

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
    const locationInterval = setInterval(updateLocation, 60000); // Update every 10 seconds

    return () => clearInterval(locationInterval);
  }, [locationPermission]);

  // Function to update user location
  const updateLocation = useCallback(async () => {
    const newLocation = await getUserLocation(locationPermission);
    setUserLocation(newLocation);

    // Update map region with current zoom level
    setMapRegion(createMapRegion(newLocation, zoomLevel));

    return newLocation;
  }, [locationPermission, zoomLevel]);

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
