import React, { createContext, useContext } from "react";
import { WorkoutController } from "controller/WorkoutController";

// Create the context
const ConfigControllerContext = createContext<WorkoutController | undefined>(undefined);

// Create a custom hook to use the WorkoutControllerContext more easily
export const useWorkoutController = () => {
  const context = useContext(ConfigControllerContext);
  if (!context) {
    throw new Error("use WorkoutController must be used within a ConfigControllerProvider");
  }
  return context;
};

// Create a provider component
interface ConfigControllerProviderProps {
  controller: WorkoutController;
  children: React.ReactNode;
}

export const ConfigControllerProvider: React.FC<ConfigControllerProviderProps> = ({ controller, children }) => {
  return (
    <ConfigControllerContext.Provider value={controller}>
      {children}
    </ConfigControllerContext.Provider>
  );
};
