import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import {
  equipItem,
  unequipItem,
  useItem,
  removeItem,
} from '../redux/slices/inventorySlice';
import { Item, ItemType, EquipmentSlot } from '../models/Item';

const InventoryScreen: React.FC = () => {
  const dispatch = useDispatch();
  const inventory = useSelector((state: RootState) => state.inventory);
  const character = useSelector(
    (state: RootState) => state.character.character
  );

  const [selectedItem, setSelectedItem] = useState<{
    item: Item;
    index: number;
  } | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'inventory' | 'equipment'>(
    'inventory'
  );

  if (!character) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Inventory</Text>
        <Text style={styles.emptyText}>
          Create a character to access inventory
        </Text>
      </View>
    );
  }

  const handleItemPress = (item: Item, index: number) => {
    setSelectedItem({ item, index });
    setModalVisible(true);
  };

  const handleEquipItem = () => {
    if (selectedItem) {
      dispatch(equipItem(selectedItem.index));
      setModalVisible(false);
      setSelectedItem(null);
    }
  };

  const handleUnequipItem = (slot: EquipmentSlot) => {
    dispatch(unequipItem(slot));
  };

  const handleUseItem = () => {
    if (selectedItem) {
      dispatch(useItem(selectedItem.index));
      setModalVisible(false);
      setSelectedItem(null);

      // Show effect of using the item
      if (
        selectedItem.item.type === ItemType.CONSUMABLE &&
        selectedItem.item.consumableEffect
      ) {
        const effect = selectedItem.item.consumableEffect;
        let message = '';

        switch (effect.type) {
          case 'heal':
            message = `Healed for ${effect.value} health points.`;
            break;
          case 'mana':
            message = `Restored ${effect.value} mana points.`;
            break;
          case 'buff':
            message = `Gained a buff for ${effect.duration} turns.`;
            break;
          case 'damage':
            message = `Dealt ${effect.value} damage.`;
            break;
        }

        Alert.alert('Item Used', message);
      }
    }
  };

  const handleDropItem = () => {
    if (selectedItem) {
      Alert.alert(
        'Drop Item',
        `Are you sure you want to drop ${selectedItem.item.name}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Drop',
            style: 'destructive',
            onPress: () => {
              dispatch(removeItem(selectedItem.index));
              setModalVisible(false);
              setSelectedItem(null);
            },
          },
        ]
      );
    }
  };

  const renderItemDetails = () => {
    if (!selectedItem) return null;

    const { item } = selectedItem;

    return (
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemRarity}>{item.rarity}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>

        {item.type === ItemType.EQUIPMENT && item.statBonuses && (
          <View style={styles.statBonuses}>
            <Text style={styles.statBonusesTitle}>Stat Bonuses:</Text>
            {item.statBonuses.strength && (
              <Text style={styles.statBonus}>
                Strength: +{item.statBonuses.strength}
              </Text>
            )}
            {item.statBonuses.dexterity && (
              <Text style={styles.statBonus}>
                Dexterity: +{item.statBonuses.dexterity}
              </Text>
            )}
            {item.statBonuses.intelligence && (
              <Text style={styles.statBonus}>
                Intelligence: +{item.statBonuses.intelligence}
              </Text>
            )}
            {item.statBonuses.vitality && (
              <Text style={styles.statBonus}>
                Vitality: +{item.statBonuses.vitality}
              </Text>
            )}
            {item.statBonuses.health && (
              <Text style={styles.statBonus}>
                Health: +{item.statBonuses.health}
              </Text>
            )}
            {item.statBonuses.mana && (
              <Text style={styles.statBonus}>
                Mana: +{item.statBonuses.mana}
              </Text>
            )}
          </View>
        )}

        {item.type === ItemType.CONSUMABLE && item.consumableEffect && (
          <View style={styles.consumableEffect}>
            <Text style={styles.consumableEffectTitle}>Effect:</Text>
            <Text style={styles.consumableEffectText}>
              {item.consumableEffect.type === 'heal' &&
                `Restores ${item.consumableEffect.value} health`}
              {item.consumableEffect.type === 'mana' &&
                `Restores ${item.consumableEffect.value} mana`}
              {item.consumableEffect.type === 'buff' &&
                `Increases stats by ${item.consumableEffect.value} for ${item.consumableEffect.duration} turns`}
              {item.consumableEffect.type === 'damage' &&
                `Deals ${item.consumableEffect.value} damage`}
            </Text>
          </View>
        )}

        <Text style={styles.itemValue}>Value: {item.value} gold</Text>

        <View style={styles.actionButtons}>
          {item.type === ItemType.EQUIPMENT && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleEquipItem}>
              <Text style={styles.actionButtonText}>Equip</Text>
            </TouchableOpacity>
          )}

          {item.type === ItemType.CONSUMABLE && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleUseItem}>
              <Text style={styles.actionButtonText}>Use</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.actionButton, styles.dropButton]}
            onPress={handleDropItem}>
            <Text style={styles.actionButtonText}>Drop</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderInventoryItems = () => {
    if (inventory.items.length === 0) {
      return <Text style={styles.emptyText}>Your inventory is empty</Text>;
    }

    return (
      <ScrollView style={styles.itemsList}>
        {inventory.items.map((item, index) => (
          <TouchableOpacity
            key={`${item.id}_${index}`}
            style={styles.itemCard}
            onPress={() => handleItemPress(item, index)}>
            <View style={styles.itemCardContent}>
              <Text style={styles.itemCardName}>{item.name}</Text>
              <Text style={styles.itemCardType}>{item.type}</Text>
              {item.type === ItemType.EQUIPMENT && item.equipmentSlot && (
                <Text style={styles.itemCardSlot}>{item.equipmentSlot}</Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const renderEquippedItems = () => {
    const slots = Object.values(EquipmentSlot);

    return (
      <ScrollView style={styles.equipmentList}>
        {slots.map((slot) => {
          const equippedItem = inventory.equippedItems[slot];

          return (
            <View key={slot} style={styles.equipmentSlot}>
              <Text style={styles.slotName}>{slot}</Text>
              {equippedItem ? (
                <View style={styles.equippedItemCard}>
                  <View style={styles.equippedItemInfo}>
                    <Text style={styles.equippedItemName}>
                      {equippedItem.name}
                    </Text>
                    <Text style={styles.equippedItemRarity}>
                      {equippedItem.rarity}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.unequipButton}
                    onPress={() => handleUnequipItem(slot)}>
                    <Text style={styles.unequipButtonText}>Unequip</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.emptySlot}>
                  <Text style={styles.emptySlotText}>Empty</Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Inventory</Text>

      <View style={styles.goldContainer}>
        <Text style={styles.goldText}>Gold: {inventory.gold}</Text>
        <Text style={styles.capacityText}>
          Capacity: {inventory.items.length}/{inventory.maxInventorySize}
        </Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'inventory' ? styles.activeTab : null,
          ]}
          onPress={() => setActiveTab('inventory')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'inventory' ? styles.activeTabText : null,
            ]}>
            Inventory
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'equipment' ? styles.activeTab : null,
          ]}
          onPress={() => setActiveTab('equipment')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'equipment' ? styles.activeTabText : null,
            ]}>
            Equipment
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'inventory'
        ? renderInventoryItems()
        : renderEquippedItems()}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType='slide'
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {renderItemDetails()}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setModalVisible(false);
                setSelectedItem(null);
              }}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  goldContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  goldText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f9a825',
  },
  capacityText: {
    fontSize: 16,
    color: '#666',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  tab: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
  },
  activeTab: {
    borderBottomColor: '#4a80f5',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#4a80f5',
    fontWeight: 'bold',
  },
  itemsList: {
    flex: 1,
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 5,
    borderLeftColor: '#4a80f5',
  },
  itemCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemCardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  itemCardType: {
    fontSize: 12,
    color: '#666',
    marginRight: 10,
  },
  itemCardSlot: {
    fontSize: 12,
    color: '#4a80f5',
  },
  equipmentList: {
    flex: 1,
  },
  equipmentSlot: {
    marginBottom: 15,
  },
  slotName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  equippedItemCard: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 5,
    borderLeftColor: '#4a80f5',
  },
  equippedItemInfo: {
    flex: 1,
  },
  equippedItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  equippedItemRarity: {
    fontSize: 12,
    color: '#666',
  },
  unequipButton: {
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 5,
  },
  unequipButtonText: {
    fontSize: 12,
    color: '#666',
  },
  emptySlot: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  emptySlotText: {
    fontSize: 14,
    color: '#999',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  itemDetails: {
    marginBottom: 20,
  },
  itemName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  itemRarity: {
    fontSize: 14,
    color: '#4a80f5',
    marginBottom: 10,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  statBonuses: {
    marginBottom: 15,
  },
  statBonusesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  statBonus: {
    fontSize: 14,
    color: '#4caf50',
    marginLeft: 10,
  },
  consumableEffect: {
    marginBottom: 15,
  },
  consumableEffectTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  consumableEffectText: {
    fontSize: 14,
    color: '#4a80f5',
    marginLeft: 10,
  },
  itemValue: {
    fontSize: 14,
    color: '#f9a825',
    marginBottom: 15,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#4a80f5',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  dropButton: {
    backgroundColor: '#f44336',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#666',
    fontWeight: 'bold',
  },
});

export default InventoryScreen;
