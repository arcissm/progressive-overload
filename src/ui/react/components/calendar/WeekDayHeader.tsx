import React from 'react';

const WeekDayHeader: React.FC = () => {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
