import React, { useEffect, useState } from "react";
import { useWorkoutController } from "../w";
import { Muscle } from "models/Muscle"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashCan,  } from '@fortawesome/free-solid-svg-icons'; 
import { Notice } from "obsidian";


// Define a new type for debouncing multiple muscles
type MuscleUpdate = {
  oldMuscle: Muscle;
  newMuscle: Muscle;
};

const MusclePanel: React.FC = () => {
  const controller = useWorkoutController(); // Get the controller from the context
  const [muscles, setMuscles] = useState<Muscle[]>([]); 
  const [debouncedMuscleUpdates, setDebouncedMuscleUpdates] = useState<MuscleUpdate[]>([]); // Track multiple updates


  // Use useEffect to load the muscles when the component mounts
  useEffect(() => {
    const loadMuscles = async () => {
      const fetchedMuscles = await controller.getMuscles();
      setMuscles(fetchedMuscles);
    };
    
    loadMuscles();
  }, [controller]);


  const handleAddMuscle = () => {
    const muscleWithEmptyNameExists = muscles.some(muscle => muscle.name === "");
  
    if (!muscleWithEmptyNameExists) {
      setMuscles((prevMuscles) => {
        const newMuscle = new Muscle("", 0, 0, 0)
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

  
  const handleInputChange = (index: number, field: keyof Muscle, value: string | number) => {
    setMuscles((prevMuscles) => {
      const updatedMuscles = [...prevMuscles]; // Best practice to copy state
      const oldMuscle = new Muscle(
        updatedMuscles[index].name,
        updatedMuscles[index].minSets,
        updatedMuscles[index].maxSets,
        updatedMuscles[index].boosted
      );

      // Use the isNameUnique utility function to check if the new name is unique
      if (field === 'name' && !isNameUnique(prevMuscles, String(value), index)) {
        new Notice("Be original");
        return updatedMuscles; // Do not update if the name is not unique
      }

      // Update muscle based on changed field
      updatedMuscles[index] = new Muscle(
        field === 'name' ? String(value) : updatedMuscles[index].name,
        field === 'minSets' ? Number(value) : updatedMuscles[index].minSets,
        field === 'maxSets' ? Number(value) : updatedMuscles[index].maxSets,
        updatedMuscles[index].boosted
      );

      setDebouncedMuscleUpdates((prevUpdates) => {
        const lastUpdateIndex = prevUpdates.findIndex(update => update.newMuscle.name === oldMuscle.name);
        if (lastUpdateIndex > -1) {
          // If there is a previous update with the same muscle name, replace it with the new one
          const updatedQueue = [...prevUpdates];
          updatedQueue[lastUpdateIndex].newMuscle = updatedMuscles[index];
          return updatedQueue;
        } else {
          // If not in the queue, add it
          return [...prevUpdates, { oldMuscle, newMuscle: updatedMuscles[index] }];
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
    <div className="muscle-panel">
      <div className="muscle-information">
        <h1>Muscle Config</h1>
        <p>Add, Remove or Edit muscles</p>
        <p>Every workout will have x number of sets between (Min Sets, Max Sets)</p>
      </div>

      {/* Fixed header */}
      <div className="muscle-header">
        <div className="header-item">Name</div>
        <div className="header-item">Min Sets</div>
        <div className="header-item">Max Sets</div>
        <div className="header-trash"></div>
      </div>

      {/* Scrollable muscle input section */}
      <div className="muscle-list">
        {muscles.map((muscle, index) => (
          <div key={index} className="muscle-row">
            <div className="input-container">
              <input
                type="text"
                value={muscle.name}
                onChange={(e) => handleInputChange(index, 'name', e.target.value)}
              />
            </div>
            <div className="input-container">
              <input
                type="number"
                value={muscle.minSets}
                onChange={(e) => handleInputChange(index, 'minSets', Number(e.target.value))}
              />
            </div>
            <div className="input-container">
              <input
                type="number"
                value={muscle.maxSets}
                onChange={(e) => handleInputChange(index, 'maxSets', Number(e.target.value))}
              />
            </div>
            <div className="trash-container">
              <button 
                className="muscle-add-button"
                onClick={() => handleDeleteMuscle(muscle, index)}>
                  <FontAwesomeIcon icon={faTrashCan} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="muscle-footer">
        <button className="muscle-add-button"
         onClick={handleAddMuscle}>
          <FontAwesomeIcon icon={faPlus} size="2x" />
        </button>
      </div>
    </div>
  );
};

export default MusclePanel;