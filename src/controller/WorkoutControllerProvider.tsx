import React, { createContext, useContext, useState, useEffect } from "react";
import { WorkoutController } from "controller/WorkoutController";

// Create the context with the workout data and controller
const WorkoutControllerContext = createContext<{
  controller: WorkoutController;
  workouts: any[];
  currentDate: Date; // Add currentDate to the context type
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

  // **Add currentDate state**
  const [currentDate, setCurrentDate] = useState(new Date());

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

  // **Effect to update currentDate at midnight**
  useEffect(() => {
    const now = new Date();
    const msUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime() + 100;

    const testTime = 3600
    const timeoutId = setTimeout(() => {
      
      const d = (new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1))
      setCurrentDate(d);
      // setCurrentDate(new Date());
      // console.log(currentDate)
    }, msUntilMidnight);

    // // Cleanup the timeout when the component unmounts or effect re-runs
    return () => clearTimeout(timeoutId);
  }, [currentDate]);

  // **Include currentDate in the context value**
  return (
    <WorkoutControllerContext.Provider value={{ controller, workouts, currentDate }}>
      {children}
    </WorkoutControllerContext.Provider>
  );
};
