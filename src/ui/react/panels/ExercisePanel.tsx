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
  const newExercise = new Exercise('New Exercise');
  const updatedConfigs = controller.addExerciseConfig(newExercise);
  setExerciseConfigs([...updatedConfigs]);
};





  

  return (
    <PanelLayout
      title="Exercise Config"
      description="Add, Remove or Edit exercises. Exercises are ordered by their muscle groups."
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
