import React, { useState } from 'react';
import WorkoutPanel from './WorkoutPanel';
import MusclePanel from './MusclePanel';
import ExercisePanel from './ExercisePanel';
import VariationPanel from './VariationPanel';
import Tabs from '../components/Tabs';
import { CONFIG_TABS } from 'utils/Constants';

const ConfigPanel: React.FC = () => {
  // State management for the current tab, initialized with the first tab
  const [currentTab, setCurrentTab] = useState(CONFIG_TABS[0].key);

  return (
    <div className="config-workout-view">
      {/* Render the Tabs and pass the currentTab and setCurrentTab functions */}
      <Tabs currentTab={currentTab} setCurrentTab={setCurrentTab} />
      
      {/* Render the correct panel based on the currentTab */}
      <div className="tab-content">
        {currentTab === 'workouts' && <WorkoutPanel />}
        {currentTab === 'muscles' && <MusclePanel />}
        {currentTab === 'exercises' && <ExercisePanel />}
        {currentTab === 'variations' && <VariationPanel />}
      </div>
    </div>
  );
};

export default ConfigPanel;
