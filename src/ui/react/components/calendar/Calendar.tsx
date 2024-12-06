import React, { useState, useEffect } from 'react';
import CalendarDay from './CalendarDay';
import CalendarNav from './CalendarNav';
import WeekDayHeader from './WeekDayHeader';
import MonthGrid from './MonthGrid';
import { useWorkoutController } from 'controller/WorkoutControllerProvider';
import CalendarLegend from './CalendarLegend';
import { useSettingsController } from 'controller/SettingsControllerProvider';

const Calendar: React.FC = () => {
  const { currentDate: today } = useWorkoutController(); // Access settings from context
  const { settings, updateSettings } = useSettingsController();
  
  const [colorMapping, setColorMapping] = useState({
    completed: settings.calendarCompletedColor,
    completedCardio: settings.calendarCardioColor,
    started: settings.calendarStartedColor,
  });

  useEffect(() => {
    // Only update settings if there's a real difference
    if (
      colorMapping.completed !== settings.calendarCompletedColor ||
      colorMapping.completedCardio !== settings.calendarCardioColor ||
      colorMapping.started !== settings.calendarStartedColor
    ) {
      updateSettings({
        calendarCompletedColor: colorMapping.completed,
        calendarCardioColor: colorMapping.completedCardio,
        calendarStartedColor: colorMapping.started,
      });
    }
  }, [colorMapping, settings, updateSettings]);

  

  // Initialize currentMonth based on today's date
  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  // Update currentMonth whenever today's date changes
  useEffect(() => {
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
  }, [today]);

  // Navigation handlers
  const goToPrevMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Render previous, current, and next month days
  const renderPrevMonthDays = (): JSX.Element[] => {
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
    const adjustedFirstDay = (firstDayOfMonth + 6) % 7; // Shift Sunday (0) to the end of the week
    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    const daysInPrevMonth = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0).getDate();

    return [...Array(adjustedFirstDay)].map((_, i) => {
      const dayOfPrevMonth = daysInPrevMonth - (adjustedFirstDay - 1 - i);
      const currentDate = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), dayOfPrevMonth);
      return (
        <CalendarDay
          key={currentDate.toISOString()}
          dayText={dayOfPrevMonth.toString()}
          currentDate={currentDate}
          isGreyedOut={true}
          isOutsideMonth={true}
          today={today} // Pass 'today' from provider
          colorMapping={colorMapping}
        />
      );
    });
  };

  const renderCurrentMonthDays = (): JSX.Element[] => {
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();

    return [...Array(daysInMonth)].map((_, i) => {
      const day = i + 1;
      const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      return (
        <CalendarDay
          key={currentDate.toISOString()}
          dayText={day.toString()}
          currentDate={currentDate}
          isGreyedOut={false}
          isOutsideMonth={false}
          today={today} // Pass 'today' from provider
          colorMapping={colorMapping}        />
      );
    });
  };

  const renderNextMonthDays = (): JSX.Element[] => {
    const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDay();
    const adjustedLastDay = (lastDayOfMonth + 6) % 7; // Shift Sunday (0) to the end of the week
    const daysToFill = 6 - adjustedLastDay;

    const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);

    return [...Array(daysToFill)].map((_, i) => {
      const day = i + 1;
      const currentDate = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), day);
      return (
        <CalendarDay
          key={currentDate.toISOString()}
          dayText={day.toString()}
          currentDate={currentDate}
          isGreyedOut={true}
          isOutsideMonth={true}
          today={today} // Pass 'today' from provider
          colorMapping={colorMapping}        />
      );
    });
  };

  return (
    <div className="calendar-container">
      <CalendarNav currentMonth={currentMonth} goToPrevMonth={goToPrevMonth} goToNextMonth={goToNextMonth} />
      <WeekDayHeader />
      <MonthGrid
        renderPrevMonthDays={renderPrevMonthDays}
        renderCurrentMonthDays={renderCurrentMonthDays}
        renderNextMonthDays={renderNextMonthDays}
      />
      <CalendarLegend colorMapping={colorMapping} setColorMapping={setColorMapping} />
      </div>
  );
};

export default Calendar;
