import React, { useState } from 'react';
import { useWorkoutController } from 'controller/WorkoutControllerProvider';

const Checklist: React.FC = () => {
  const controller = useWorkoutController();

  const initialItems = [
    { id: 1, label: 'Item 1', checked: false },
    { id: 2, label: 'Item 2', checked: true },
    { id: 3, label: 'Item 3', checked: false },
  ];

  const [items, setItems] = useState(initialItems);

  const handleCheckboxChange = (id: number) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  return (
    <div>
      <h3>Checklist</h3>
      {items.map(item => (
        <div key={item.id}>
          <input
            type="checkbox"
            id={`checkbox-${item.id}`}
            checked={item.checked}
            onChange={() => handleCheckboxChange(item.id)}
          />
          <label htmlFor={`checkbox-${item.id}`}>{item.label}</label>
        </div>
      ))}
    </div>
  );
};

export default Checklist;
