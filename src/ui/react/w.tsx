import React, { createContext, useContext } from "react";
import { WorkoutController } from "controller/WorkoutController";

// Create the context
const WorkoutControllerContext = createContext<WorkoutController | undefined>(undefined);

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
  return (
    <WorkoutControllerContext.Provider value={controller}>
      {children}
    </WorkoutControllerContext.Provider>
  );
};
