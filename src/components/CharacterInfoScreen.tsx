import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Profession, Race } from '../models/Character';

const CharacterInfoScreen: React.FC = () => {
  const character = useSelector(
    (state: RootState) => state.character.character
  );

  if (!character) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Character Info</Text>
        <Text style={styles.emptyText}>Create a character to view info</Text>
      </View>
    );
  }

  // Calculate experience percentage
  const experiencePercent =
    (character.experience / character.experienceToNextLevel) * 100;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Character Info</Text>

      <View style={styles.characterCard}>
        <Text style={styles.characterName}>{character.name}</Text>
        <View style={styles.characterDetails}>
          <Text style={styles.characterDetail}>
            <Text style={styles.detailLabel}>Level: </Text>
            {character.level}
          </Text>
          <Text style={styles.characterDetail}>
            <Text style={styles.detailLabel}>Profession: </Text>
            {character.profession}
          </Text>
          <Text style={styles.characterDetail}>
            <Text style={styles.detailLabel}>Race: </Text>
            {character.race}
          </Text>
        </View>
      </View>

      <View style={styles.experienceContainer}>
        <Text style={styles.sectionTitle}>Experience</Text>
        <View style={styles.experienceBarContainer}>
          <View
            style={[styles.experienceBar, { width: `${experiencePercent}%` }]}
          />
        </View>
        <Text style={styles.experienceText}>
          {character.experience} / {character.experienceToNextLevel} XP
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Stats</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{character.stats.strength}</Text>
            <Text style={styles.statLabel}>Strength</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{character.stats.dexterity}</Text>
            <Text style={styles.statLabel}>Dexterity</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{character.stats.intelligence}</Text>
            <Text style={styles.statLabel}>Intelligence</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{character.stats.vitality}</Text>
            <Text style={styles.statLabel}>Vitality</Text>
          </View>
        </View>

        <View style={styles.resourcesContainer}>
          <View style={styles.resourceItem}>
            <Text style={styles.resourceValue}>{character.stats.health}</Text>
            <Text style={styles.resourceLabel}>Health</Text>
          </View>
          <View style={styles.resourceItem}>
            <Text style={styles.resourceValue}>{character.stats.mana}</Text>
            <Text style={styles.resourceLabel}>Mana</Text>
          </View>
        </View>
      </View>

      <View style={styles.abilitiesContainer}>
        <Text style={styles.sectionTitle}>Abilities</Text>
        {character.abilities.map((ability, index) => (
          <View key={index} style={styles.abilityCard}>
            <Text style={styles.abilityName}>{ability.name}</Text>
            <Text style={styles.abilityDescription}>{ability.description}</Text>
            <Text style={styles.abilityCooldown}>
              Cooldown: {ability.cooldown} turns
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.professionInfoContainer}>
        <Text style={styles.sectionTitle}>Profession Info</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>{character.profession}</Text>
          <Text style={styles.infoDescription}>
            {getProfessionDescription(character.profession)}
          </Text>
        </View>
      </View>

      <View style={styles.raceInfoContainer}>
        <Text style={styles.sectionTitle}>Race Info</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>{character.race}</Text>
          <Text style={styles.infoDescription}>
            {getRaceDescription(character.race)}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

// Helper functions to get descriptions
const getProfessionDescription = (profession: Profession): string => {
  switch (profession) {
    case Profession.WARRIOR:
      return 'Warriors are strong melee fighters who excel in close combat. They have high health and strength, allowing them to deal significant damage while withstanding enemy attacks.';
    case Profession.ASSASSIN:
      return 'Assassins are agile fighters who specialize in quick, deadly strikes. They have high dexterity and can deal critical damage, though they have less health than warriors.';
    case Profession.WIZARD:
      return 'Wizards are powerful spellcasters who command arcane forces. They have high intelligence and mana, allowing them to cast devastating spells, though they have less health than other classes.';
    default:
      return '';
  }
};

const getRaceDescription = (race: Race): string => {
  switch (race) {
    case Race.HUMAN:
      return 'Humans are versatile and adaptable, with balanced attributes across all stats. Their adaptability allows them to excel in any profession.';
    case Race.DWARF:
      return 'Dwarves are sturdy and strong, with high vitality and strength. They are naturally resistant to damage and excel as warriors.';
    case Race.ORC:
      return 'Orcs are powerful and tough, with very high strength but lower intelligence. They excel in melee combat and can enter berserker rages.';
    case Race.ELF:
      return 'Elves are graceful and intelligent, with high dexterity and magical aptitude. They excel as wizards and assassins, and have a natural connection to nature.';
    default:
      return '';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  characterCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 5,
    borderLeftColor: '#4a80f5',
  },
  characterName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  characterDetails: {
    marginBottom: 10,
  },
  characterDetail: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#666',
  },
  experienceContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  experienceBarContainer: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 10,
  },
  experienceBar: {
    height: '100%',
    backgroundColor: '#4caf50',
  },
  experienceText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  statsContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {
    width: '48%',
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4a80f5',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  resourcesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resourceItem: {
    width: '48%',
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  resourceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4caf50',
    marginBottom: 5,
  },
  resourceLabel: {
    fontSize: 14,
    color: '#666',
  },
  abilitiesContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  abilityCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    padding: 15,
    marginBottom: 10,
  },
  abilityName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  abilityDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  abilityCooldown: {
    fontSize: 12,
    color: '#999',
  },
  professionInfoContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  raceInfoContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    padding: 15,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  infoDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default CharacterInfoScreen;
