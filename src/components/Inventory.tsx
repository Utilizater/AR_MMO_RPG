import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { Item, EquipmentSlot } from '../models/Item';
import {
  equipItem,
  unequipItem,
  useItem,
} from '../redux/slices/inventorySlice';

const Inventory: React.FC = () => {
  const dispatch = useDispatch();
  const { items, equippedItems, gold } = useSelector(
    (state: RootState) => state.inventory
  );

  const handleEquip = (index: number) => {
    dispatch(equipItem(index));
  };

  const handleUnequip = (slot: EquipmentSlot) => {
    dispatch(unequipItem(slot));
  };

  const handleUse = (index: number) => {
    dispatch(useItem(index));
  };

  const renderItem = (item: Item, index: number) => (
    <div key={item.id} className='item-card'>
      {item.imageUrl ? (
        <img src={item.imageUrl} alt={item.name} className='item-image' />
      ) : (
        <div className='item-placeholder'>
          <span>{item.name[0]}</span>
        </div>
      )}
      <div className='item-details'>
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        <p>Value: {item.value} gold</p>
        {item.stats && (
          <div className='item-stats'>
            {Object.entries(item.stats).map(([stat, value]) => (
              <span key={stat}>
                {stat}: {value}{' '}
              </span>
            ))}
          </div>
        )}
        <div className='item-actions'>
          {item.type === 'EQUIPMENT' && item.equipmentSlot && (
            <button onClick={() => handleEquip(index)}>Equip</button>
          )}
          {item.type === 'CONSUMABLE' && (
            <button onClick={() => handleUse(index)}>Use</button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className='inventory-container'>
      <div className='inventory-header'>
        <h2>Inventory</h2>
        <p>Gold: {gold}</p>
      </div>

      <div className='equipment-section'>
        <h3>Equipment</h3>
        <div className='equipment-grid'>
          {Object.entries(equippedItems).map(([slot, item]) => (
            <div key={slot} className='equipment-slot'>
              <h4>{slot}</h4>
              {item ? (
                <div className='equipped-item'>
                  {renderItem(item, -1)}
                  <button onClick={() => handleUnequip(slot as EquipmentSlot)}>
                    Unequip
                  </button>
                </div>
              ) : (
                <div className='empty-slot'>Empty</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className='inventory-section'>
        <h3>Items</h3>
        <div className='inventory-grid'>
          {items.map((item, index) => renderItem(item, index))}
        </div>
      </div>
    </div>
  );
};

export default Inventory;
