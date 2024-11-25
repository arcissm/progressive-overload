import React from 'react';
import { Workout } from 'models/Workout';
import { isSameDate } from 'utils/AlgorithmUtils';
import { useWorkoutController } from 'controller/WorkoutControllerProvider';

interface CalendarDayProps {
  dayText: string;
  currentDate: Date;
  isGreyedOut: boolean;
  isOutsideMonth: boolean;
  today: Date;
}

const CalendarDay: React.FC<CalendarDayProps> = ({ dayText, currentDate, isGreyedOut, isOutsideMonth, today }) => {
  const { controller } = useWorkoutController();
  const workouts = controller.getWorkoutsByDate(currentDate);

  const getWorkoutClass = (workout: Workout, isOutsideMonth: boolean) => {
    if (workout.workoutType === 'cardio') {
      return isOutsideMonth ? 'completed-cardio-outside-month' : 'completed-cardio';
    }

    if (workout.isCompleted) {
      return isOutsideMonth ? 'completed-outside-month' : 'completed';
    }

    return isOutsideMonth ? 'started-outside-month' : 'started';
  };

  return (
    <div
      key={currentDate.toISOString()}
      className={`calendar-day ${isGreyedOut ? 'greyed-out' : ''} ${
        isSameDate(currentDate, today) ? 'current-day' : ''
      }`}
      onClick={() => controller.openNote(currentDate)}
    >
      <div className="calendar-day__container">
        <div className="calendar-day__container-date">{dayText}</div>
        <div className="calendar-day__container-circles">
          {workouts.map((workout, index) => (
            <div key={index} className={`calendar-day__container-circles-dot ${getWorkoutClass(workout, isOutsideMonth)}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarDay;