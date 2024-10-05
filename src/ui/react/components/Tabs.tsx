import React from 'react';
import { CONFIG_TABS } from 'utils/Constants';

interface TabsProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ currentTab, setCurrentTab }) => {
  return (
    <div className="tab-navigation">
      {CONFIG_TABS.map((tab) => (
        <button
          key={tab.key}
          className={`tab-button ${currentTab === tab.key ? 'active' : ''}`}
          onClick={() => setCurrentTab(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
