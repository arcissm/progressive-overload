// components/PanelLayout.tsx
import React, { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

interface PanelLayoutProps {
  title: string;
  description: string;
  footerAction?: () => void; // Made optional to avoid issues when displayFooter is false
  displayFooter: boolean; // New prop to control footer visibility
  children: React.ReactNode;
}

const PanelLayout: React.FC<PanelLayoutProps> = ({ title, description, footerAction, displayFooter, children }) => {
  const contentEndRef = useRef<HTMLDivElement>(null);

  
  const handleAdd = () => {
    // Define your handleAdd logic here if needed
    if (footerAction) {
      footerAction(); // Call the footerAction if it's provided
    }
    setTimeout(() => {
      if (contentEndRef.current) {
        contentEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }, 100); // Adjust the delay as needed
  };

  return (
    <div className="workout-settings-panel">
      <div className="workout-settings-information">
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      <div className="workout-settings-content" ref={contentEndRef}>
        {children}
      </div>

      {displayFooter && (
        <div className="workout-settings-table-footer">
          <button className="workout-settings-table-button" onClick={handleAdd}>
            <FontAwesomeIcon icon={faPlus} size="2x" />
          </button>
        </div>
      )}
    </div>
  );
};

export default PanelLayout;
