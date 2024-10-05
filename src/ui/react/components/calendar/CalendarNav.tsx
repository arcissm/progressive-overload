import React from 'react';

interface CalendarNavProps {
  currentMonth: Date;
  goToPrevMonth: () => void;
  goToNextMonth: () => void;
}

const CalendarNav: React.FC<CalendarNavProps> = ({ currentMonth, goToPrevMonth, goToNextMonth }) => {
  return (
    <div className="calendar-header">
      <button className="calendar-btn" onClick={goToPrevMonth}>
        &lt;
      </button>
      <span className="calendar-title">
        {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
      </span>
      <button className="calendar-btn" onClick={goToNextMonth}>
        &gt;
      </button>
    </div>
  );
};

export default CalendarNav;
