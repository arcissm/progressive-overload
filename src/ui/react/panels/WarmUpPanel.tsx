import React, { useEffect, useState } from "react";
import { useWorkoutController } from "../../../controller/ConfigControllerProvider";
import { Muscle } from "models/Muscle"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faPlus } from '@fortawesome/free-solid-svg-icons'; 
import PanelLayout from "../components/PanelLayout";
import Collapse from "../components/Collapse";
import WarmUpForm from "../forms/WarmUpForm";
import { Exercise } from "models/Exercise";
import YogaForm from "../forms/YogaForm";
import { ERROR_MESSAGE_NOT_UNIQUE_NAME, NEW_EXERCISE_ID, NEW_EXERCISE_NAME } from "utils/Constants";
import { Notice } from "obsidian";



const WarmUpPannel: React.FC = () => {
  const controller = useWorkoutController();
  const [muscles, setMuscles] = useState<Muscle[]>([]); 
  const [yoga, setYoga] = useState<string[]>(); 


  // Use useEffect to load the muscles when the component mounts
  useEffect(() => {
    const loadData = async () => {
      const fetchedMuscles = controller.getMuscles();
      setMuscles(fetchedMuscles);

      const fetchedYoga = controller.getYoga();
      setYoga(fetchedYoga);
    };
    
    loadData();
  }, [controller]);


  // Save
  const handleSave = (oldMuscle: Muscle, oldExercise: Exercise, newExercise: Exercise) => {
  const newMuscle = oldMuscle.clone();
  const exerciseIndex = newMuscle.warmUps.findIndex((exercise) => exercise.id === oldExercise.id);
  
  if (exerciseIndex !== -1) {
    newMuscle.warmUps[exerciseIndex] = newExercise;
    controller.updateMuscle(oldMuscle, newMuscle);
    setMuscles((prevMuscles) => 
      prevMuscles.map((muscle) => (muscle.equals(oldMuscle) ? newMuscle : muscle))
    );
  } else {
    console.error("Exercise not found in muscle's warm-ups.");
  }
};

  // Delete
  const handleDeleteExercise = (oldMuscle: Muscle, exerciseId: string) => {
    const newMuscle = oldMuscle.clone();
    newMuscle.warmUps = newMuscle.warmUps.filter((warmUp) => warmUp.id !== exerciseId);
    controller.updateMuscle(oldMuscle, newMuscle);
    setMuscles((prevMuscles) => 
      prevMuscles.map((muscle) => (muscle.equals(oldMuscle) ? newMuscle : muscle))
    );
  };

  // Add
  const handleAdd = (oldMuscle: Muscle) => {
    const newMuscle = oldMuscle.clone()

      if ((isDuplicate(newMuscle, NEW_EXERCISE_NAME, NEW_EXERCISE_ID))) {
        new Notice(ERROR_MESSAGE_NOT_UNIQUE_NAME);
        return;
      }

    newMuscle.warmUps.push(new Exercise(NEW_EXERCISE_NAME))
    controller.updateMuscle(oldMuscle, newMuscle)
    setMuscles((prevMuscles) => 
      prevMuscles.map((muscle) => (muscle.equals(oldMuscle) ? newMuscle : muscle))
    );
  }

    
  const isDuplicate = (muscle: Muscle, newExerciseName: string, newExerciseId:string) => {
    return muscle.warmUps.some(
        (warmup) => {
          return warmup.name.toLowerCase() === newExerciseName.toLowerCase() &&
          warmup.id === newExerciseId // Exclude the current exercise being edited
        }
      )
  }


  return (
    <PanelLayout
      title="Warm Up Config"
      description="Every muscle group should have a warm up. Up to you if like your joints healthy."
      displayFooter={false} >


      <div className="workout-settings-muscle-container">
      <Collapse 
        header={
          <div className="workout-settings-exercise-header">
            <div className="workout-settings-exercise-header-name">YOGA</div>
            <FontAwesomeIcon 
              className="workout-settings-exercise-header-arrow"
              icon={faAngleDown} 
              size="2x"
            />
          </div>
        }>
          <div className="workout-settings-exercise-list workout-setings-warmup-container warmup-yoga">
            {yoga ? <YogaForm initialYoga={yoga} /> : <div>Loading...</div>}
          </div>
        </Collapse>


        {muscles.map((muscle, index) => (
            <div key={index} >
                <div>
                    <h2>{muscle.name.toUpperCase()}</h2>
                </div>
                <div>
                <div className="workout-settings-exercise-list workout-setings-warmup-container">
                  {muscle.warmUps.map((warmUp) => (
                      <div key={warmUp.id}>

                        <Collapse 
                        header={
                          <div className="workout-settings-exercise-header">
                            <div className="workout-settings-exercise-header-name">{warmUp.name}</div>
                            <FontAwesomeIcon 
                              className="workout-settings-exercise-header-arrow"
                              icon={faAngleDown} 
                              size="2x"
                            />
                          </div>
                        }>
                          <WarmUpForm
                            initialExercise={warmUp}
                            onSave={(oldConfig, newConfig) => handleSave(muscle, oldConfig, newConfig)}
                            onDelete={(exerciseId) => handleDeleteExercise(muscle, exerciseId)}
                          />

                        </Collapse>
                      </div>
                    ))}

                    <div className="workout-settings-warmup-button-add-container">
                      <button className="workout-settings-table-button" onClick={() => handleAdd(muscle)}>
                        <FontAwesomeIcon icon={faPlus} size="2x" />
                      </button>
                    </div>
                  </div>
                </div>
            </div>
             ))}
      </div>
    </PanelLayout>
  );
};

export default WarmUpPannel;
