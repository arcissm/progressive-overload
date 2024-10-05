import React from 'react';

interface MonthGridProps {
  renderPrevMonthDays: () => JSX.Element[];
  renderCurrentMonthDays: () => JSX.Element[];
  renderNextMonthDays: () => JSX.Element[];
}

const MonthGrid: React.FC<MonthGridProps> = ({
  renderPrevMonthDays,
  renderCurrentMonthDays,
  renderNextMonthDays,
}) => {
  return (
    <div className="calendar-grid">
      {renderPrevMonthDays()}
      {renderCurrentMonthDays()}
      {renderNextMonthDays()}
    </div>
  );
};

export default MonthGrid;
