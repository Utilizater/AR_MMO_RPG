import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { createCharacter } from '../redux/slices/characterSlice';
import { Profession, Race } from '../models/Character';

const CharacterCreationScreen: React.FC = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [selectedProfession, setSelectedProfession] =
    useState<Profession | null>(null);
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);
  const [step, setStep] = useState(1); // 1: Name, 2: Profession, 3: Race, 4: Confirm

  const professions = [
    {
      type: Profession.WARRIOR,
      name: 'Warrior',
      description: 'Strong melee fighters with high health and defense.',
    },
    {
      type: Profession.ASSASSIN,
      name: 'Assassin',
      description:
        'Agile fighters specializing in critical strikes and evasion.',
    },
    {
      type: Profession.WIZARD,
      name: 'Wizard',
      description: 'Powerful spellcasters with devastating magical abilities.',
    },
  ];

  const races = [
    {
      type: Race.HUMAN,
      name: 'Human',
      description: 'Versatile and adaptable, with balanced attributes.',
    },
    {
      type: Race.DWARF,
      name: 'Dwarf',
      description: 'Sturdy and strong, with high vitality and strength.',
    },
    {
      type: Race.ORC,
      name: 'Orc',
      description:
        'Powerful and tough, with very high strength but lower intelligence.',
    },
    {
      type: Race.ELF,
      name: 'Elf',
      description:
        'Graceful and intelligent, with high dexterity and magical aptitude.',
    },
  ];

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleCreateCharacter = () => {
    if (name && selectedProfession && selectedRace) {
      dispatch(
        createCharacter({
          name,
          profession: selectedProfession,
          race: selectedRace,
        })
      );
    }
  };

  const renderNameStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>What is your name, adventurer?</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder='Enter your character name'
        placeholderTextColor='#999'
      />
      <TouchableOpacity
        style={[styles.button, !name ? styles.buttonDisabled : null]}
        onPress={handleNext}
        disabled={!name}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );

  const renderProfessionStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>Choose your profession</Text>
      <ScrollView style={styles.scrollContainer}>
        {professions.map((profession) => (
          <TouchableOpacity
            key={profession.type}
            style={[
              styles.selectionCard,
              selectedProfession === profession.type
                ? styles.selectedCard
                : null,
            ]}
            onPress={() => setSelectedProfession(profession.type)}>
            <Text style={styles.cardTitle}>{profession.name}</Text>
            <Text style={styles.cardDescription}>{profession.description}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.navigationButtons}>
        <TouchableOpacity style={styles.button} onPress={handleBack}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            !selectedProfession ? styles.buttonDisabled : null,
          ]}
          onPress={handleNext}
          disabled={!selectedProfession}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderRaceStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>Choose your race</Text>
      <ScrollView style={styles.scrollContainer}>
        {races.map((race) => (
          <TouchableOpacity
            key={race.type}
            style={[
              styles.selectionCard,
              selectedRace === race.type ? styles.selectedCard : null,
            ]}
            onPress={() => setSelectedRace(race.type)}>
            <Text style={styles.cardTitle}>{race.name}</Text>
            <Text style={styles.cardDescription}>{race.description}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.navigationButtons}>
        <TouchableOpacity style={styles.button} onPress={handleBack}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, !selectedRace ? styles.buttonDisabled : null]}
          onPress={handleNext}
          disabled={!selectedRace}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderConfirmStep = () => {
    const profession = professions.find((p) => p.type === selectedProfession);
    const race = races.find((r) => r.type === selectedRace);

    return (
      <View style={styles.stepContainer}>
        <Text style={styles.title}>Confirm your character</Text>
        <View style={styles.confirmCard}>
          <Text style={styles.confirmLabel}>Name:</Text>
          <Text style={styles.confirmValue}>{name}</Text>

          <Text style={styles.confirmLabel}>Profession:</Text>
          <Text style={styles.confirmValue}>{profession?.name}</Text>

          <Text style={styles.confirmLabel}>Race:</Text>
          <Text style={styles.confirmValue}>{race?.name}</Text>
        </View>
        <View style={styles.navigationButtons}>
          <TouchableOpacity style={styles.button} onPress={handleBack}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={handleCreateCharacter}>
            <Text style={styles.buttonText}>Create Character</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return renderNameStep();
      case 2:
        return renderProfessionStep();
      case 3:
        return renderRaceStep();
      case 4:
        return renderConfirmStep();
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Character Creation</Text>
      {renderCurrentStep()}
    </View>
  );
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
  stepContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4a80f5',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonDisabled: {
    backgroundColor: '#a0a0a0',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
    marginBottom: 20,
  },
  selectionCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 15,
    marginBottom: 10,
  },
  selectedCard: {
    borderColor: '#4a80f5',
    borderWidth: 2,
    backgroundColor: '#f0f5ff',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 20,
    marginBottom: 20,
  },
  confirmLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 5,
  },
  confirmValue: {
    fontSize: 18,
    color: '#333',
    marginBottom: 15,
  },
});

export default CharacterCreationScreen;
