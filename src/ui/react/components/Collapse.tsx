import React, { useState } from 'react';

interface CollapseProps {
  header: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  initialOpen?: boolean;
}

const Collapse: React.FC<CollapseProps> = ({
  header,
  children,
  className = '',
  initialOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const toggleCollapse = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className={`collapse-component ${className}`}>
      <div className="collapse-header" onClick={toggleCollapse}>
        {header}
      </div>
      {isOpen && <div className="collapse-content">{children}</div>}
    </div>
  );
};

export default Collapse;
