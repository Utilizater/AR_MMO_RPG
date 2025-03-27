import * as Location from 'expo-location';
import { Coordinates, MapRegion } from '../types';

// Default location (San Francisco)
const DEFAULT_LOCATION: Coordinates = {
  latitude: 37.7749,
  longitude: -122.4194,
};

// Default zoom level
const DEFAULT_ZOOM = 0.005; // Closer zoom than original 0.01

/**
 * Request location permission from the user
 * @returns Promise resolving to whether permission was granted
 */
export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  } catch (err) {
    console.warn('Error requesting location permission:', err);
    return false;
  }
};

/**
 * Get the user's current location
 * @param hasPermission Whether location permission has been granted
 * @returns Promise resolving to the user's coordinates
 */
export const getUserLocation = async (
  hasPermission: boolean
): Promise<Coordinates> => {
  if (hasPermission) {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      console.log('Error getting location:', error);
      // Fallback to default location with slight randomization
      return getMockLocation();
    }
  } else {
    // Use mock location if permission not granted
    return getMockLocation();
  }
};

/**
 * Get a mock location (with slight randomization) for testing or when permission is denied
 * @returns Randomized coordinates
 */
export const getMockLocation = (): Coordinates => {
  return {
    latitude: DEFAULT_LOCATION.latitude + (Math.random() * 0.01 - 0.005),
    longitude: DEFAULT_LOCATION.longitude + (Math.random() * 0.01 - 0.005),
  };
};

/**
 * Create a map region object from coordinates with specified zoom level
 * @param coordinates The center coordinates
 * @param zoomLevel Optional zoom level (delta value)
 * @returns MapRegion object
 */
export const createMapRegion = (
  coordinates: Coordinates,
  zoomLevel: number = DEFAULT_ZOOM
): MapRegion => {
  return {
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
    latitudeDelta: zoomLevel,
    longitudeDelta: zoomLevel,
  };
};
