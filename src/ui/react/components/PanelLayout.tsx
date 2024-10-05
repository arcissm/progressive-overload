// components/PanelLayout.tsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

interface PanelLayoutProps {
  title: string;
  description: string;
  footerAction: () => void;
  children: React.ReactNode;
}

const PanelLayout: React.FC<PanelLayoutProps> = ({ title, description, footerAction, children }) => {
  return (
    <div className="workout-settings-panel">
      <div className="workout-settings-information">
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      <div className="workout-settings-content">
        {children}
      </div>

      <div className="workout-settings-table-footer">
        <button className="workout-settings-table-button" onClick={footerAction}>
          <FontAwesomeIcon icon={faPlus} size="2x" />
        </button>
      </div>
    </div>
  );
};

export default PanelLayout;
