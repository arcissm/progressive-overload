import React, { useState } from "react";
import { WorkoutController } from "controller/WorkoutController";
import WorkoutPanel from "../panels/WorkoutPanel";
import MusclePanel from "../panels/MusclePanel";
import ExercisePanel from "../panels/ExercisePanel";
import { useWorkoutController } from "../w";



export const Tabs: React.FC = () => {
  // Define the type for the currentTab state to only allow specific string values
  const [currentTab, setCurrentTab] = useState<"workouts" | "muscles" | "exercises">("workouts");

  return (
    <div className="config-workout-view">
      <div className="tab-navigation">
        <button
          className={`tab-button ${currentTab === "workouts" ? "active" : ""}`}
          onClick={() => setCurrentTab("workouts")}
        >
          Workout Types
        </button>
        <button
          className={`tab-button ${currentTab === "muscles" ? "active" : ""}`}
          onClick={() => setCurrentTab("muscles")}
        >
          Muscles
        </button>
        <button
          className={`tab-button ${currentTab === "exercises" ? "active" : ""}`}
          onClick={() => setCurrentTab("exercises")}
        >
          Exercises
        </button>
      </div>
      
      <div className="tab-content">
        {/* Inline conditional rendering of the current tab */}
        {currentTab === "workouts" && <WorkoutPanel />}
        {currentTab === "muscles" && <MusclePanel />}
        {currentTab === "exercises" && <ExercisePanel />}
      </div>
    </div>
  );
};
