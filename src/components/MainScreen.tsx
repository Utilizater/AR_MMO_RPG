import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { AppDispatch } from '../redux/store';
import CharacterCreationScreen from './CharacterCreationScreen';
import GameMapScreen from './GameMapScreen';
import InventoryScreen from './InventoryScreen';
import CombatScreen from './CombatScreen';
import CharacterInfoScreen from './CharacterInfoScreen';
import { ScreenType, setCurrentScreen } from '../redux/slices/navigationSlice';

const MainScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentScreen = useSelector(
    (state: RootState) => state.navigation.currentScreen
  );
  const character = useSelector(
    (state: RootState) => state.character.character
  );
  const inCombat = useSelector((state: RootState) => state.combat.inCombat);

  // Automatically switch to combat screen when in combat
  React.useEffect(() => {
    if (inCombat) {
      dispatch(setCurrentScreen(ScreenType.COMBAT));
    } else if (currentScreen === ScreenType.COMBAT && !inCombat) {
      dispatch(setCurrentScreen(ScreenType.GAME_MAP));
    }
  }, [inCombat, currentScreen, dispatch]);

  // Automatically switch to character creation if no character exists
  React.useEffect(() => {
    if (!character && currentScreen !== ScreenType.CHARACTER_CREATION) {
      dispatch(setCurrentScreen(ScreenType.CHARACTER_CREATION));
    } else if (character && currentScreen === ScreenType.CHARACTER_CREATION) {
      dispatch(setCurrentScreen(ScreenType.GAME_MAP));
    }
  }, [character, currentScreen, dispatch]);

  // Handle navigation button press
  const handleNavigationPress = (screen: ScreenType) => {
    if (currentScreen === screen) return;
    dispatch(setCurrentScreen(screen));
  };

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
      <View style={styles.screenContainer}>{renderScreen()}</View>

      {showNavigation && (
        <View style={styles.navigationBar}>
          <TouchableOpacity
            style={[
              styles.navButton,
              currentScreen === ScreenType.GAME_MAP && styles.activeNavButton,
            ]}
            onPress={() => handleNavigationPress(ScreenType.GAME_MAP)}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <View style={styles.buttonContent}>
              <Text
                style={[
                  styles.navButtonText,
                  currentScreen === ScreenType.GAME_MAP &&
                    styles.activeNavButtonText,
                ]}>
                Map
              </Text>
              {currentScreen === ScreenType.GAME_MAP && (
                <View style={styles.activeIndicator} />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.navButton,
              currentScreen === ScreenType.INVENTORY && styles.activeNavButton,
            ]}
            onPress={() => handleNavigationPress(ScreenType.INVENTORY)}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <View style={styles.buttonContent}>
              <Text
                style={[
                  styles.navButtonText,
                  currentScreen === ScreenType.INVENTORY &&
                    styles.activeNavButtonText,
                ]}>
                Inventory
              </Text>
              {currentScreen === ScreenType.INVENTORY && (
                <View style={styles.activeIndicator} />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.navButton,
              currentScreen === ScreenType.CHARACTER_INFO &&
                styles.activeNavButton,
            ]}
            onPress={() => handleNavigationPress(ScreenType.CHARACTER_INFO)}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <View style={styles.buttonContent}>
              <Text
                style={[
                  styles.navButtonText,
                  currentScreen === ScreenType.CHARACTER_INFO &&
                    styles.activeNavButtonText,
                ]}>
                Character
              </Text>
              {currentScreen === ScreenType.CHARACTER_INFO && (
                <View style={styles.activeIndicator} />
              )}
            </View>
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
  screenContainer: {
    flex: 1,
    paddingBottom: 60,
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
    borderTopWidth: 1,
    borderTopColor: '#444',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  navButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    paddingHorizontal: 10,
  },
  buttonContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeNavButton: {
    backgroundColor: '#444',
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeNavButtonText: {
    color: '#4a80f5',
  },
  activeIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#4a80f5',
    marginTop: 4,
  },
});

export default MainScreen;
