import React, { useState, useEffect } from 'react';
import { useWorkoutController } from 'controller/WorkoutControllerProvider';
import { Workout } from 'models/Workout';
import { getTodayDateUTC, isSameDate } from 'utils/AlgorithmUtils';

const CalendarComponent: React.FC = () => {
  const { controller } = useWorkoutController();
  const [currentMonth, setCurrentMonth] = useState(getTodayDateUTC());
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  // Load workout data
  useEffect(() => {
    const loadWorkoutData = async () => {
      const fetchedWorkouts = controller.getWorkouts();
      setWorkouts(fetchedWorkouts);
    };
    loadWorkoutData();
  }, [controller]); // Adding updateCalendar to the dependency array so that it re-renders when triggered

  const getWorkoutClass = (workout: Workout, isOutsideMonth: boolean) => {
    if (workout.workoutType === "cardio") {
      return isOutsideMonth ? 'completed-cardio-outside-month' : 'completed-cardio';
    }
  
    if (workout.isCompleted) {
      return isOutsideMonth ? 'completed-outside-month' : 'completed';
    }
  
    return isOutsideMonth ? 'started-outside-month' : 'started';
  };

  // Helper to render days of the week
  const renderDaysOfWeek = () => {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="calendar-grid">
        {daysOfWeek.map((day) => (
          <div key={day} className="calendar-header-day">{day.toUpperCase()}</div>
        ))}
      </div>
    );
  };

  // Helper to render day cells
  const renderDay = (dayText: string, currentDate: Date, isGreyedOut: boolean, isOutsideMonth: boolean) => {
    const workouts = controller.getWorkoutsByDate(currentDate);
    return (
      <div
        key={currentDate.toISOString()}
        className={`calendar-day ${isGreyedOut ? 'greyed-out' : ''} ${
          isSameDate(currentDate, getTodayDateUTC()) ? 'current-day' : ''
        }`}
        onClick={() => controller.openNote(currentDate)}
      >
        <div className="calendar-day__container">
          <div className="calendar-day__container-date">{dayText}</div>
          <div className="calendar-day__container-circles">
            {workouts.map((workout, index) => (
              <div
                key={index}
                className={`calendar-day__container-circles-dot ${getWorkoutClass(workout, isOutsideMonth)}`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render the previous month's days
  const renderPrevMonthDays = () => {
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    const daysInPrevMonth = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0).getDate();

    return [...Array(firstDayOfMonth)].map((_, i) => {
      const dayOfPrevMonth = daysInPrevMonth - i;
      const currentDate = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), dayOfPrevMonth);
      return renderDay(dayOfPrevMonth.toString(), currentDate, true, true);
    });
  };

  // Render the current month's days
  const renderCurrentMonthDays = () => {
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();

    return [...Array(daysInMonth)].map((_, i) => {
      const day = i + 1;
      const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      return renderDay(day.toString(), currentDate, false, false);
    });
  };

  // Render the next month's days
  const renderNextMonthDays = () => {
    const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDay();
    const daysToFill = 6 - lastDayOfMonth;

    const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);

    return [...Array(daysToFill)].map((_, i) => {
      const day = i + 1;
      const currentDate = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), day);
      return renderDay(day.toString(), currentDate, true, true);
    });
  };

  // Handle month navigation
  const goToPrevMonth = () => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev.getFullYear(), prev.getMonth() - 1, 1); // Subtract one month and set to 1st of the month
      return newMonth;
    });
  };

  const goToNextMonth = () => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev.getFullYear(), prev.getMonth() + 1, 1); // Add one month and set to 1st of the month
      return newMonth;
    });
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button className="calendar-btn" onClick={goToPrevMonth}>&lt;</button>
        <span className="calendar-title">
          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </span>
        <button className="calendar-btn" onClick={goToNextMonth}>&gt;</button>
      </div>

      {renderDaysOfWeek()}

      <div className="calendar-grid">
        {renderPrevMonthDays()}
        {renderCurrentMonthDays()}
        {renderNextMonthDays()}
      </div>
    </div>
  );
};

export default CalendarComponent;
