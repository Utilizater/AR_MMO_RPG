import { useState, useEffect, useCallback } from 'react';
import { LocationPoint, Coordinates } from '../types';
import { generateNearbyPoints } from '../services/pointsOfInterestService';

/**
 * Custom hook for managing points of interest
 * @param userLocation The user's current location
 * @param characterLevel The player's character level
 * @returns Points of interest state and functions
 */
export const usePointsOfInterest = (
  userLocation: Coordinates,
  characterLevel: number = 1
) => {
  const [points, setPoints] = useState<LocationPoint[]>([]);

  // Generate points when user location changes
  useEffect(() => {
    if (userLocation) {
      updatePoints();
    }
  }, [userLocation]);

  // Function to update points of interest
  const updatePoints = useCallback(() => {
    const newPoints = generateNearbyPoints(userLocation, characterLevel);
    setPoints(newPoints);
    return newPoints;
  }, [userLocation, characterLevel]);

  return {
    points,
    updatePoints,
  };
};
