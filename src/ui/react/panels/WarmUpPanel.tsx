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

// Handlers
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


const handleDeleteExercise = (oldMuscle: Muscle, exerciseId: string) => {
  const newMuscle = oldMuscle.clone();
  newMuscle.warmUps = newMuscle.warmUps.filter((warmUp) => warmUp.id !== exerciseId);
  controller.updateMuscle(oldMuscle, newMuscle);
  setMuscles((prevMuscles) => 
    prevMuscles.map((muscle) => (muscle.equals(oldMuscle) ? newMuscle : muscle))
  );
};


const handleAdd = (oldMuscle: Muscle) => {
  const newMuscle = oldMuscle.clone()
  newMuscle.warmUps.push(new Exercise("New Exercise"))
  controller.updateMuscle(oldMuscle, newMuscle)
  setMuscles((prevMuscles) => 
    prevMuscles.map((muscle) => (muscle.equals(oldMuscle) ? newMuscle : muscle))
  );
}

    

  return (
    <PanelLayout
      title="Warm Up Config"
      description="Add, Remove or Edit Warm Ups. Every muscle group should have a warm up."
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
