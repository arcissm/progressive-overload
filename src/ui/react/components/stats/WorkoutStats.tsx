import React, { useEffect } from 'react';
import { useWorkoutController } from 'controller/WorkoutControllerProvider';

const WorkoutStats: React.FC = () => {
  const controller = useWorkoutController();

  useEffect(() => {
    // This effect would run after the component mounts
    const container = document.getElementById('stats-container');
    if (container) {
      const heading = document.createElement('h3');
      heading.textContent = 'Stats Graph';
      container.appendChild(heading);
    }

    // Cleanup if needed
    return () => {
      if (container) {
        container.innerHTML = ''; // Remove the heading if the component unmounts
      }
    };
  }, [controller]); // Dependency array includes the controller

  return (
    <div id="stats-container">
    </div>
  );
};

export default WorkoutStats;
