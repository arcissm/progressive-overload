import React, { useEffect, useRef, useState } from "react";
import { useWorkoutController } from "controller/ConfigControllerProvider";
import { Exercise } from "models/Exercise";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { ExerciseConfig } from "models/configs/ExerciseConfig";
import PanelLayout from "../components/PanelLayout";
import Search from "../components/Search";
import Collapse from "../components/Collapse";
import ExerciseForm from "../forms/ExerciseForm";
import { Notice } from "obsidian";
import { ERROR_MESSAGE_NOT_UNIQUE_NAME, NEW_EXERCISE_ID, NEW_EXERCISE_NAME } from "utils/Constants";


const ExercisePanel: React.FC = () => {
  const controller = useWorkoutController();
  const [muscles, setMuscles] = useState<string[]>([]);
  const [exerciseConfigs, setExerciseConfigs] = useState<ExerciseConfig[]>([]); 
  const [filteredConfigs, setFilteredConfgis] = useState<ExerciseConfig[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Load workout data
  useEffect(() => {
    const loadWorkoutData = async () => {
      const fetchedMuscles = controller.getMuscles();
      const muscleNames = fetchedMuscles.map((muscle) => muscle.name);
      setMuscles(muscleNames);

      const fetchedConfigs = controller.getExerciseConfigs();
      setExerciseConfigs(fetchedConfigs);
    };
    loadWorkoutData();
  }, [controller]);

  // UI
  // Search
  useEffect(() => {
    const updatedFilteredExercises = exerciseConfigs.filter((config) =>
      config.exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredConfgis(updatedFilteredExercises);
  }, [searchQuery, exerciseConfigs]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

// Save
const handleSave = (oldConfig: ExerciseConfig, newConfig: ExerciseConfig) => {
  
  if ((isDuplicate(newConfig.exercise.name, newConfig.exercise.id) && oldConfig.exercise.name != newConfig.exercise.name)) {
    new Notice(ERROR_MESSAGE_NOT_UNIQUE_NAME);
    return;
  }

  setExerciseConfigs(() => {
    return controller.saveExerciseConfigs(oldConfig, newConfig);
  });
};

// Delete
const handleDeleteExercise = (exerciseId: string) => {
  const updatedConfigs = controller.deleteExerciseConfig(exerciseId);
  setExerciseConfigs([...updatedConfigs]);
};

// Add
const handleAddExercise = () => {

  if ((isDuplicate(NEW_EXERCISE_NAME, NEW_EXERCISE_ID))) {
    new Notice(ERROR_MESSAGE_NOT_UNIQUE_NAME);
    return;
  }
  const newExercise = new Exercise(NEW_EXERCISE_NAME);

  const updatedConfigs = controller.addExerciseConfig(newExercise);
  setExerciseConfigs([...updatedConfigs]);
};



const isDuplicate = (newExerciseName: string, newExerciseId:string) => {
  return exerciseConfigs.some(
  (config) => {
    return config.exercise.name.toLowerCase() === newExerciseName.toLowerCase() &&
    config.exercise.id === newExerciseId // Exclude the current exercise being edited
  }
  )
}


  

  return (
    <PanelLayout
      title="Exercise Config"
      description="
      Create an exercise and associate it with one or more muscle groups.
      Time doesn't work right now, use the note.
      Sets are more of a suggestion unless it's a core exercise. For cores, they're the minimum.
      Total sets for a muscle group are randomly split among unlocked exercises, keeping workouts varied but anchored to core exercises.
      "
      footerAction={handleAddExercise} 
      displayFooter={true} >
      <Search
        placeholder="Search exercises"
        onSearch={handleSearch}
        debounceTime={500}
      />

      <div className="workout-settings-exercise-list" onClick={(e) => e.stopPropagation()}>
      {filteredConfigs.map((config) => (
          <div key={config.exercise.id}>
            <Collapse 
            header={
              <div className="workout-settings-exercise-header">
                <div className="workout-settings-exercise-header-name">{config.exercise.name}</div>
                <FontAwesomeIcon 
                  className="workout-settings-exercise-header-arrow"
                  icon={faAngleDown} 
                  size="2x"
                />
              </div>
            }>
              <ExerciseForm
                initialConfig={config}
                muscles={muscles}
                onSave={handleSave}
                onDelete={handleDeleteExercise}
              />
            </Collapse>
          </div>
        ))}
      </div>
  </PanelLayout>
  );
};

export default ExercisePanel;
