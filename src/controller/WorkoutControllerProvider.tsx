import React, { createContext, useContext, useState, useEffect } from "react";
import { WorkoutController } from "controller/WorkoutController";

// Create the context with the workout data and controller
const WorkoutControllerContext = createContext<{
  controller: WorkoutController;
  workouts: any[];
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
  const [workouts, setWorkouts] = useState<any[]>([]);

  // Subscribe to workout updates from the controller
  useEffect(() => {
    const updateWorkouts = () => {
      setWorkouts([...controller.getWorkouts()]); // Ensure we copy the array to trigger a re-render
    };

    // Subscribe to the controller's updates
    controller.subscribe(updateWorkouts);

    // Fetch initial workouts
    updateWorkouts();

    // Clean up subscription on unmount
    return () => controller.unsubscribe(updateWorkouts);
  }, [controller]);


  return (
    <WorkoutControllerContext.Provider value={{ controller, workouts }}>
      {children}
    </WorkoutControllerContext.Provider>
  );
};
