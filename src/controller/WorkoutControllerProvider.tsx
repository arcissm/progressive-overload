import React, { createContext, useContext, useState } from "react";
import { WorkoutController } from "controller/WorkoutController";

// Create the context with an additional function `updateCalendar`
const WorkoutControllerContext = createContext<{
  controller: WorkoutController;
  updateCalendar: () => void;
} | undefined>(undefined);

// Create a custom hook to use the WorkoutControllerContext more easily
export const useWorkoutController = () => {
  const context = useContext(WorkoutControllerContext);
  if (!context) {
    throw new Error("useWorkoutController must be used within a WorkoutControllerProvider");
  }
  return context;
};

// Create a provider component
interface WorkoutControllerProviderProps {
  controller: WorkoutController;
  children: React.ReactNode;
}

export const WorkoutControllerProvider: React.FC<WorkoutControllerProviderProps> = ({ controller, children }) => {
  const [calendarKey, setCalendarKey] = useState(0);

  // Function to trigger re-render of calendar by incrementing the key
  const updateCalendar = () => {
    setCalendarKey((prevKey) => prevKey + 1); // Increment the key to force re-render
  };

  return (
    <WorkoutControllerContext.Provider value={{ controller, updateCalendar }}>
      {children}
    </WorkoutControllerContext.Provider>
  );
};
