import React from "react";
import { useWorkoutController } from "../w";

const WorkoutPanel: React.FC = () => {
  const controller = useWorkoutController();

  return (
    <div>
      <h3>Manage Workouts</h3>
      {/* Add more complicated logic, forms, buttons, etc. */}
      <p>This is where you manage your workout types.</p>
    </div>
  );
};

export default WorkoutPanel; // Default export
