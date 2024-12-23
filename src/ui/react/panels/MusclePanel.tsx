import React, { useEffect, useState } from "react";
import { useWorkoutController } from "../../../controller/ConfigControllerProvider";
import { Muscle } from "models/Muscle"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons'; 
import { Notice } from "obsidian";
import MultiSelectInput from "../components/MultiSelect";
import PanelLayout from "../components/PanelLayout";


type MuscleUpdate = {
  oldMuscle: Muscle;
  newMuscle: Muscle;
};

const MusclePanel: React.FC = () => {
  const controller = useWorkoutController();
  const [muscles, setMuscles] = useState<Muscle[]>([]); 
  const [muscleExerciseMap, setMuscleExerciseMap] = useState< Map<string, string[]>>(new Map());
  const [originalMuscles, setOriginalMuscles] = useState<Muscle[]>([]);


  // Use useEffect to load the muscles when the component mounts
  useEffect(() => {
    const loadData = async () => {
      const fetchedMuscles = controller.getMuscles();
      setMuscles(fetchedMuscles);
      setOriginalMuscles(fetchedMuscles); // Keep a copy of the original state
      const fetchedMuscleExerciseMap = controller.getMuscleExerciseMap();
      setMuscleExerciseMap(fetchedMuscleExerciseMap);
    };
    
    loadData();
  }, [controller]);


  // Add
  const handleAddMuscle = () => {
    const muscleWithEmptyNameExists = muscles.some(muscle => muscle.name === "");
  
    if (!muscleWithEmptyNameExists) {
      setMuscles((prevMuscles) => {
        const newMuscle = new Muscle("", 0, 0, 0, [], []);
        const updatedMuscles = [...prevMuscles, newMuscle];
        controller.addMuscle(newMuscle);
  
        // Update original muscles
        setOriginalMuscles((prevOriginals) => [...prevOriginals, newMuscle]);
  
        return updatedMuscles;
      });
    } else {
      new Notice("Finish creating your muscle before you add another.");
    }
  };
  
  // Delete
  const handleDeleteMuscle = (muscle: Muscle, index: number) => {
    controller.deleteMuscle(muscle);
    setMuscles((prevMuscles) => {
      const updatedMuscles = [...prevMuscles];
      updatedMuscles.splice(index, 1); // Remove the muscle at the given index
      return updatedMuscles;
    });
  };

  // Handle Input Change (Real-Time)
  const handleInputChange = (index: number, field: keyof Muscle, value: string | number | string[]) => {
    setMuscles((prevMuscles) => {
      const updatedMuscles = [...prevMuscles];

  
      // Handle numeric fields (minSets, maxSets) and allow empty string
      const newMuscle = new Muscle(
        field === "name" ? String(value) : updatedMuscles[index].name,
        field === "minSets"
          ? (value === "" ? "" : Number(value)) as number
          : updatedMuscles[index].minSets,
        field === "maxSets"
          ? (value === "" ? "" : Number(value)) as number
          : updatedMuscles[index].maxSets,
        updatedMuscles[index].boosted,
        field === "coreExercises"
          ? (value as string[])
          : updatedMuscles[index].coreExercises,
        updatedMuscles[index].warmUps
      );

      if(field === "coreExercises"){
        handleBlur(index, field, value)
      }
  
      // Update the specific muscle with the new values
      updatedMuscles[index] = newMuscle;
      return updatedMuscles;
    });
  };

  // Handle Blur (Validation and Controller Update)
  const handleBlur = (index: number, field: keyof Muscle, value: string | number | string[]) => {
    const oldMuscle = originalMuscles[index]; // Use the original copy
    const currentMuscle = muscles[index];

    // Handle name-specific validation
    if (field === "name") {
      const newName = String(value);
      // Check for duplicate names
      if (
        currentMuscle.name !== newName &&
        muscles.some((muscle, idx) => idx !== index && muscle.name.toLowerCase() === newName.toLowerCase())
      ) {
        new Notice("This muscle name already exists. Please choose a different name.");
        setMuscles((prevMuscles) =>
          prevMuscles.map((muscle, idx) =>
            idx === index ? new Muscle(oldMuscle.name, muscle.minSets, muscle.maxSets, muscle.boosted, muscle.coreExercises, muscle.warmUps) : muscle
          )
        );
        return;
      }
    }

    // Create updated muscle based on the field and value
    const newMuscle = new Muscle(
      field === "name" ? String(value) : currentMuscle.name,
      field === "minSets" ? Number(value) : currentMuscle.minSets,
      field === "maxSets" ? Number(value) : currentMuscle.maxSets,
      currentMuscle.boosted,
      field === "coreExercises" ? (value as string[]) : currentMuscle.coreExercises,
      currentMuscle.warmUps
    );

    controller.updateMuscle(oldMuscle, newMuscle);

    setOriginalMuscles((prevOriginals) =>
      prevOriginals.map((muscle, idx) => (idx === index ? newMuscle : muscle))
    );
  };



  return (
    <PanelLayout
      title="Muscle Config"
      description="
      Set the range (Min and Max) for how many sets to spend on a muscle group.
      Core Exercises are always included and have a minimum number of sets assigned (in the exercise tab)."
      footerAction={handleAddMuscle}
      displayFooter={true} >
    
      <div className="workout-settings-muscle-container">
        <div className="workout-settings-muscle-header">
          <div className="workout-settings-muscle-row">
            <div className="workout-settings-muscle-header-cell">Name</div>
            <div className="workout-settings-muscle-header-cell">Min Sets</div>
            <div className="workout-settings-muscle-header-cell">Max Sets</div>
            <div className="workout-settings-muscle-header-cell trash-header"></div>
          </div>
        </div>

        {muscles.map((muscle, index) => (
          <div key={index} className="workout-settings-muscle-data">
            <div className="workout-settings-muscle-row">
              <div className="workout-settings-muscle-cell">
                <input
                  type="text"
                  value={muscle.name}
                  onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                  onBlur={(e) => handleBlur(index, 'name', e.target.value)}
                />
              </div>
              <div className="workout-settings-muscle-cell">
                <input
                  type="number"
                  value={muscle.minSets === 0 ? "" : muscle.minSets}
                  onChange={(e) => handleInputChange(index, "minSets", e.target.value)}
                  onBlur={(e) => handleBlur(index, 'minSets', e.target.value)}
                />
              </div>
              <div className="workout-settings-muscle-cell">
                <input
                  type="number"
                  value={muscle.maxSets === 0 ? "" : muscle.maxSets}
                  onChange={(e) => handleInputChange(index, "maxSets", e.target.value)}
                  onBlur={(e) => handleBlur(index, 'maxSets', e.target.value)}
                />
              </div>
              <div className="workout-settings-muscle-cell trash-cell">
                <button
                  className="workout-settings-table-button"
                  onClick={() => handleDeleteMuscle(muscle, index)}
                >
                  <FontAwesomeIcon icon={faTrashCan} />
                </button>
              </div>
            </div>
            <div className="workout-settings-muscle-row">
              <div className="workout-settings-muscle-multiselect-label">Core Exercises</div>
              <div className="workout-settings-muscle-multiselect">
                <MultiSelectInput
                  options={muscleExerciseMap.get(muscle.name) || []}
                  selectedValues={muscle.coreExercises}
                  onSelectionChange={(selected) => handleInputChange(index, 'coreExercises', selected)}
                />
              </div>
            </div>
            <hr />
          </div>
        ))}
      </div>
    </PanelLayout>
  );
};

export default MusclePanel;
