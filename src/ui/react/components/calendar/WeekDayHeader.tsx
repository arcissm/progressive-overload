import React from 'react';

const WeekDayHeader: React.FC = () => {
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="calendar-grid">
      {daysOfWeek.map((day) => (
        <div key={day} className="calendar-header-day">
          {day.toUpperCase()}
        </div>
      ))}
    </div>
  );
};

export default WeekDayHeader;
