import React, { useState } from "react";
import { WorkoutController } from "controller/WorkoutController";
import WorkoutPanel from "../panels/WorkoutPanel";
import MusclePanel from "../panels/MusclePanel";
import ExercisePanel from "../panels/ExercisePanel";
import { useWorkoutController } from "../../../controller/WorkoutControllerProvider";
import VariationPanel from "../panels/VariationPanel";



export const Tabs: React.FC = () => {
  // Define the type for the currentTab state to only allow specific string values
  const [currentTab, setCurrentTab] = useState<"workouts" | "muscles" | "exercises" | "variations" >("workouts");

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
        <button
          className={`tab-button ${currentTab === "variations" ? "active" : ""}`}
          onClick={() => setCurrentTab("variations")}
        >
          Variations
        </button>
      </div>
      
      <div className="tab-content">
        {/* Inline conditional rendering of the current tab */}
        {currentTab === "workouts" && <WorkoutPanel />}
        {currentTab === "muscles" && <MusclePanel />}
        {currentTab === "exercises" && <ExercisePanel />}
        {currentTab === "variations" && <VariationPanel />}

      </div>
    </div>
  );
};
