import React, { useEffect } from 'react';
import { useWorkoutController } from 'controller/WorkoutControllerProvider';

const WorkoutStats: React.FC = () => {
  const controller = useWorkoutController();

  // Load
  useEffect(() => {
    const container = document.getElementById('stats-container');
    if (container) {
      const heading = document.createElement('h3');
      heading.textContent = 'Stats Graph';
      container.appendChild(heading);
    }

  }, [controller]);

  return (
    <div id="stats-container">
    </div>
  );
};

export default WorkoutStats;
