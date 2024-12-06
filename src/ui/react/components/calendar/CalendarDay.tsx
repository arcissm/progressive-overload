import React from 'react';
import { Workout } from 'models/Workout';
import { isSameDate } from 'utils/AlgorithmUtils';
import { useWorkoutController } from 'controller/WorkoutControllerProvider';

interface ColorMapping {
  completed: string;
  completedCardio: string;
  started: string;
}

interface CalendarDayProps {
  dayText: string;
  currentDate: Date;
  isGreyedOut: boolean;
  isOutsideMonth: boolean;
  today: Date;
  colorMapping: ColorMapping;
}

const CalendarDay: React.FC<CalendarDayProps> =  ({ dayText, currentDate, isGreyedOut, isOutsideMonth, today, colorMapping }) => {
  const { controller } = useWorkoutController();
  const workouts = controller.getWorkoutsByDate(currentDate);

  const getDotStyle = (workout: Workout, isOutsideMonth: boolean) => {
    let style = {
      backgroundColor: 'transparent',
      border: 'none',
      opacity: isOutsideMonth ? 0.4 : 1,
    };

    if (workout.workoutType === 'cardio') {
      style.backgroundColor = colorMapping.completedCardio;
    } else if (workout.isCompleted) {
      style.backgroundColor = colorMapping.completed;
    } else {
      style.border = `1px solid ${colorMapping.started}`;
    }

    return style;
  };

  return (
    <div
      className={`calendar-day ${isGreyedOut ? 'greyed-out' : ''} ${
        isSameDate(currentDate, today) ? 'current-day' : ''
      }`}
      onClick={() => controller.openNote(currentDate)}
    >
      <div className="calendar-day__container">
        <div className="calendar-day__container-date">{dayText}</div>
        <div className="calendar-day__container-circles">
          {workouts.map((workout, index) => (
            <div
              key={index}
              className="calendar-day__container-circles-dot"
              style={getDotStyle(workout, isOutsideMonth)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarDay;