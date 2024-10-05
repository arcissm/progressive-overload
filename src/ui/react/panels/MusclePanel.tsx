import React, { useEffect, useState } from "react";
import { useWorkoutController } from "../../../controller/ConfigControllerProvider";
import { Muscle } from "models/Muscle"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashCan,  } from '@fortawesome/free-solid-svg-icons'; 
import { Notice } from "obsidian";
import MultiSelectInput from "../components/MultiSelect";


// Define a new type for debouncing multiple muscles
type MuscleUpdate = {
  oldMuscle: Muscle;
  newMuscle: Muscle;
};

const MusclePanel: React.FC = () => {
  const controller = useWorkoutController();
  const [muscles, setMuscles] = useState<Muscle[]>([]); 
  const [muscleExerciseMap, setMuscleExerciseMap] = useState< Map<string, string[]>>(new Map());
  const [debouncedMuscleUpdates, setDebouncedMuscleUpdates] = useState<MuscleUpdate[]>([]); // Track multiple updates


  // Use useEffect to load the muscles when the component mounts
  useEffect(() => {
    const loadData = async () => {
      const fetchedMuscles = controller.getMuscles();
      setMuscles(fetchedMuscles);

      const fetchedMuscleExerciseMap = controller.getMuscleExerciseMap();  
      setMuscleExerciseMap(fetchedMuscleExerciseMap)    
    };
    
    loadData();
  }, [controller]);


  const handleAddMuscle = () => {
    const muscleWithEmptyNameExists = muscles.some(muscle => muscle.name === "");
  
    if (!muscleWithEmptyNameExists) {
      setMuscles((prevMuscles) => {
        const newMuscle = new Muscle("", 0, 0, 0, [])
        const updatedMuscles = [...prevMuscles, newMuscle];
        controller.addMuscle(newMuscle)
        return updatedMuscles

      });
    } else {
      new Notice("Finish creating your muscle before you add another.")
    }
  };

  const handleDeleteMuscle = (muscle: Muscle, index: number) => {
    // Call the controller to delete the muscle from the backend
    controller.deleteMuscle(muscle);
  
    // Update the state by removing the muscle from the list
    setMuscles((prevMuscles) => {
      const updatedMuscles = [...prevMuscles];
      updatedMuscles.splice(index, 1); // Remove the muscle at the given index
      return updatedMuscles;
    });
  };

  

  const handleInputChange = (index: number, field: keyof Muscle, value: string | number | string[]) => {
    setMuscles((prevMuscles) => {
      const updatedMuscles = [...prevMuscles]; // Copy the previous state
  
      
      if (field === 'name' && !isNameUnique(prevMuscles, String(value), index)) {
        new Notice("Be original");
        return updatedMuscles;
      }
      
      // Create the new Muscle object with updated fields
      updatedMuscles[index] = new Muscle(
        field === 'name' ? String(value) : updatedMuscles[index].name,
        field === 'minSets' ? Number(value) : updatedMuscles[index].minSets,
        field === 'maxSets' ? Number(value) : updatedMuscles[index].maxSets,
        updatedMuscles[index].boosted,
        field === 'coreExercises' ? (value as string[]) : updatedMuscles[index].coreExercises
      );
  
      // Handle debouncing logic (unchanged from your original function)
      setDebouncedMuscleUpdates((prevUpdates) => {
        const lastUpdateIndex = prevUpdates.findIndex(update => update.newMuscle.name === updatedMuscles[index].name);
        if (lastUpdateIndex > -1) {
          const updatedQueue = [...prevUpdates];
          updatedQueue[lastUpdateIndex].newMuscle = updatedMuscles[index];
          return updatedQueue;
        } else {
          return [...prevUpdates, { oldMuscle: prevMuscles[index], newMuscle: updatedMuscles[index] }];
        }
      });
  
      return updatedMuscles;
    });
  };
  

  // UseEffect for debouncing multiple muscle updates
  useEffect(() => {
    if (debouncedMuscleUpdates.length > 0) {
      const timeoutId = setTimeout(() => {
        debouncedMuscleUpdates.forEach(({ oldMuscle, newMuscle }) => {
          if (!oldMuscle.equals(newMuscle)) {
            controller.updateMuscle(oldMuscle, newMuscle);
          }
        });
        setDebouncedMuscleUpdates([]);
      }, 500); // Wait 500ms after the last input

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [debouncedMuscleUpdates, controller]);


  // Utility function to check if the muscle name is unique (considering singular/plural forms)
  const isNameUnique = (muscles: Muscle[], newName: string, currentIndex: number): boolean => {
    const normalizeMuscleName = (name: string) => {
      if (name.endsWith("s")) {
        return name.slice(0, -1); // Remove 's' for singular form
      } else {
        return name + "s"; // Add 's' for plural form
      }
    };
    return !muscles.some((muscle, i) => {
      return (
        (muscle.name === newName || muscle.name === normalizeMuscleName(newName)) &&
        i !== currentIndex // Exclude the current muscle being edited
      );
    });
  };


    

  return (
    <div className="workout-settings-panel">
      <div className="workout-settings-information">
        <h1>Muscle Config</h1>
        <p>Add, Remove or Edit muscles</p>
        <p>Every workout will have x number of sets between (Min Sets, Max Sets)</p>
      </div>

      {/* Div-based structure */}
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
          <div  key={index} className="workout-settings-muscle-data">
            <div className="workout-settings-muscle-row">
              <div className="workout-settings-muscle-cell">
                <input
                  type="text"
                  value={muscle.name}
                  onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                />
              </div>
              <div className="workout-settings-muscle-cell">
                <input
                  type="number"
                  value={muscle.minSets}
                  onChange={(e) => handleInputChange(index, 'minSets', Number(e.target.value))}
                />
              </div>
              <div className="workout-settings-muscle-cell">
                <input
                  type="number"
                  value={muscle.maxSets}
                  onChange={(e) => handleInputChange(index, 'maxSets', Number(e.target.value))}
                />
              </div>
              <div className="workout-settings-muscle-cell trash-cell">
                <button 
                  className="workout-settings-table-button"
                  onClick={() => handleDeleteMuscle(muscle, index)}>
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
            </div >
            <hr/>
          </div>

        ))}
      </div>

      <div className="workout-settings-table-footer">
          <button className="workout-settings-table-button" onClick={handleAddMuscle}>
            <FontAwesomeIcon icon={faPlus} size="2x" />
          </button>
        </div>
    </div>
  );
};

export default MusclePanel;
