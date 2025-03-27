import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import CharacterCreationScreen from './CharacterCreationScreen';
import GameMapScreen from './GameMapScreen';
import InventoryScreen from './InventoryScreen';
import CombatScreen from './CombatScreen';
import CharacterInfoScreen from './CharacterInfoScreen';

// Main screen types
enum ScreenType {
  CHARACTER_CREATION = 'CHARACTER_CREATION',
  GAME_MAP = 'GAME_MAP',
  INVENTORY = 'INVENTORY',
  COMBAT = 'COMBAT',
  CHARACTER_INFO = 'CHARACTER_INFO',
}

const MainScreen: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>(
    ScreenType.CHARACTER_CREATION
  );
  const character = useSelector(
    (state: RootState) => state.character.character
  );
  const inCombat = useSelector((state: RootState) => state.combat.inCombat);

  // Automatically switch to combat screen when in combat
  React.useEffect(() => {
    if (inCombat) {
      setCurrentScreen(ScreenType.COMBAT);
    } else if (currentScreen === ScreenType.COMBAT && !inCombat) {
      setCurrentScreen(ScreenType.GAME_MAP);
    }
  }, [inCombat, currentScreen]);

  // Automatically switch to character creation if no character exists
  React.useEffect(() => {
    if (!character && currentScreen !== ScreenType.CHARACTER_CREATION) {
      setCurrentScreen(ScreenType.CHARACTER_CREATION);
    } else if (character && currentScreen === ScreenType.CHARACTER_CREATION) {
      setCurrentScreen(ScreenType.GAME_MAP);
    }
  }, [character, currentScreen]);

  // Render the appropriate screen based on the current screen state
  const renderScreen = () => {
    switch (currentScreen) {
      case ScreenType.CHARACTER_CREATION:
        return <CharacterCreationScreen />;
      case ScreenType.GAME_MAP:
        return <GameMapScreen />;
      case ScreenType.INVENTORY:
        return <InventoryScreen />;
      case ScreenType.COMBAT:
        return <CombatScreen />;
      case ScreenType.CHARACTER_INFO:
        return <CharacterInfoScreen />;
      default:
        return <Text>Error: Unknown screen</Text>;
    }
  };

  // Only show navigation when character exists and not in combat
  const showNavigation = character && !inCombat;

  return (
    <View style={styles.container}>
      {renderScreen()}

      {showNavigation && (
        <View style={styles.navigationBar}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => setCurrentScreen(ScreenType.GAME_MAP)}>
            <Text style={styles.navButtonText}>Map</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => setCurrentScreen(ScreenType.INVENTORY)}>
            <Text style={styles.navButtonText}>Inventory</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => setCurrentScreen(ScreenType.CHARACTER_INFO)}>
            <Text style={styles.navButtonText}>Character</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#333',
    height: 60,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MainScreen;
