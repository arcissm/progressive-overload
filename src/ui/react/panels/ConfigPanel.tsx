import React, { useState } from 'react';
import WorkoutPanel from './WorkoutPanel';
import MusclePanel from './MusclePanel';
import ExercisePanel from './ExercisePanel';
import VariationPanel from './VariationPanel';
import Tabs from '../components/Tabs';
import { CONFIG_TABS } from 'utils/Constants';
import WarmUpPannel from './WarmUpPanel';
import BreakPanel from './BreakPanel';

const ConfigPanel: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(CONFIG_TABS[0].key);

  return (
    <div className="config-workout-view">
      <Tabs currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <div className="tab-content">
        {currentTab === 'workouts' && <WorkoutPanel />}
        {currentTab === 'muscles' && <MusclePanel />}
        {currentTab === 'exercises' && <ExercisePanel />}
        {currentTab === 'variations' && <VariationPanel />}
        {currentTab === 'warmups' && <WarmUpPannel />}
        {currentTab === 'breaks' && <BreakPanel />}

      </div>
    </div>
  );
};

export default ConfigPanel;
