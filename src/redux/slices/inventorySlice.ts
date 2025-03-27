import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Item, ItemType, EquipmentSlot } from '../../models/Item';

interface InventoryState {
  items: Item[];
  equippedItems: Record<EquipmentSlot, Item | null>;
  gold: number;
  maxInventorySize: number;
}

const initialState: InventoryState = {
  items: [],
  equippedItems: {
    [EquipmentSlot.HEAD]: null,
    [EquipmentSlot.CHEST]: null,
    [EquipmentSlot.LEGS]: null,
    [EquipmentSlot.FEET]: null,
    [EquipmentSlot.MAIN_HAND]: null,
    [EquipmentSlot.OFF_HAND]: null,
    [EquipmentSlot.NECK]: null,
    [EquipmentSlot.RING]: null,
  },
  gold: 0,
  maxInventorySize: 20,
};

export const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Item>) => {
      if (state.items.length < state.maxInventorySize) {
        state.items.push(action.payload);
      }
    },
    removeItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((_, index) => index !== action.payload);
    },
    equipItem: (state, action: PayloadAction<number>) => {
      const itemIndex = action.payload;
      const item = state.items[itemIndex];

      if (!item || item.type !== ItemType.EQUIPMENT || !item.equipmentSlot) {
        return;
      }

      // If there's already an item equipped in this slot, unequip it first
      const currentEquipped = state.equippedItems[item.equipmentSlot];
      if (currentEquipped) {
        state.items.push(currentEquipped);
      }

      // Equip the new item
      state.equippedItems[item.equipmentSlot] = item;

      // Remove the equipped item from inventory
      state.items = state.items.filter((_, index) => index !== itemIndex);
    },
    unequipItem: (state, action: PayloadAction<EquipmentSlot>) => {
      const slot = action.payload;
      const item = state.equippedItems[slot];

      if (item && state.items.length < state.maxInventorySize) {
        // Add the item back to inventory
        state.items.push(item);

        // Remove from equipped items
        state.equippedItems[slot] = null;
      }
    },
    useItem: (state, action: PayloadAction<number>) => {
      const itemIndex = action.payload;
      const item = state.items[itemIndex];

      if (!item || item.type !== ItemType.CONSUMABLE) {
        return;
      }

      // Remove the used item from inventory
      state.items = state.items.filter((_, index) => index !== itemIndex);

      // The actual effect of using the item will be handled by a middleware
    },
    addGold: (state, action: PayloadAction<number>) => {
      state.gold += action.payload;
    },
    removeGold: (state, action: PayloadAction<number>) => {
      state.gold = Math.max(0, state.gold - action.payload);
    },
    upgradeInventorySize: (state, action: PayloadAction<number>) => {
      state.maxInventorySize += action.payload;
    },
  },
});

export const {
  addItem,
  removeItem,
  equipItem,
  unequipItem,
  useItem,
  addGold,
  removeGold,
  upgradeInventorySize,
} = inventorySlice.actions;

export default inventorySlice.reducer;
