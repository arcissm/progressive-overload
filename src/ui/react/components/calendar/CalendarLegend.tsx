// CalendarLegend.tsx
import React from 'react';

// Define the ColorMapping interface
interface ColorMapping {
  completed: string;
  completedCardio: string;
  started: string;
}

// Define the props interface for CalendarLegend
interface CalendarLegendProps {
  colorMapping: ColorMapping;
  setColorMapping: React.Dispatch<React.SetStateAction<ColorMapping>>;
}

const CalendarLegend: React.FC<CalendarLegendProps> = ({ colorMapping, setColorMapping }) => {
  // Event handler with typed parameters
  const handleColorChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: keyof ColorMapping
  ) => {
    const newColor = event.target.value;
    setColorMapping((prevMapping: ColorMapping) => ({
      ...prevMapping,
      [key]: newColor,
    }));
  };

  return (
    <div className="calendar-legend">
      {/* Completed Workouts */}
      <div className="legend-item">
        <input
          type="color"
          value={colorMapping.completed}
          onChange={(e) => handleColorChange(e, 'completed')}
        />
        <span>Completed</span>
      </div>
      {/* Completed Cardio Workouts */}
      <div className="legend-item">
        <input
          type="color"
          value={colorMapping.completedCardio}
          onChange={(e) => handleColorChange(e, 'completedCardio')}
        />
        <span>Cardio</span>
      </div>
      {/* Started Workouts */}
      <div className="legend-item">
        <input
          type="color"
          value={colorMapping.started}
          onChange={(e) => handleColorChange(e, 'started')}
        />
        <span>Started</span>
      </div>
    </div>
  );
};

export default CalendarLegend;
