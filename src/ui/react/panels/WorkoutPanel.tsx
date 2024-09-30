import React, { useEffect, useState } from "react";
import { useWorkoutController } from "../../../controller/WorkoutControllerProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import MultiSelectInput from "../components/MultiSelect";
import { Notice } from "obsidian";

const WorkoutPanel: React.FC = () => {
  const controller = useWorkoutController();
  const [muscles, setMuscles] = useState<string[]>([]);
  const [workoutTypeMuscleArray, setWorkoutTypeMuscleArray] = useState<[string, string[]][]>([]);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

  // Load
  useEffect(() => {
    const loadWorkoutData = async () => {
      const fetchedMuscles = controller.getMuscles();
      const muscleNames = fetchedMuscles.map((muscle) => muscle.name);
      setMuscles(muscleNames);

      const array = controller.getWorkoutTypeMuscleArray();
      setWorkoutTypeMuscleArray(array);

      
    };
    loadWorkoutData();
  }, [controller]);

  // Multi Select Muscles
  const handleSelectionChange = (type: string, selectedMuscles: string[]) => {
    const updatedArray = workoutTypeMuscleArray.map(([t, muscles]): [string, string[]] =>
      t === type ? [t, selectedMuscles] : [t, muscles]
    );
    setWorkoutTypeMuscleArray(updatedArray);
  };
  
  // Add
  const handleAddWorkoutType = () => {
    const emptyWorkoutTypeExists = workoutTypeMuscleArray.some(([type]) => type === "");
    if (!emptyWorkoutTypeExists) {
      setWorkoutTypeMuscleArray((prevArray) => [...prevArray, ["", []]]);
      controller.addWorkoutType();
    } else {
      new Notice("Finish creating your Workout Type before you add another.");
    }
  };

  // Delete
  const handleDeleteWorkoutType = (type: string) => {
    const updatedArray = workoutTypeMuscleArray.filter(([t]) => t !== type);
    setWorkoutTypeMuscleArray(updatedArray);
    controller.removeWorkout(type);
  };


  // Name Change
  const handleInputChange = (oldType: string, newType: string) => {
    // if (newType !== oldType && workoutTypeMuscleArray.some(([t]) => t === newType)) {
    //   new Notice("This workout type already exists. Please choose a different name.");
    //   return;
    // }
    const updatedArray = workoutTypeMuscleArray.map(([t, muscles]): [string, string[]] =>
      t === oldType ? [newType, muscles] : [t, muscles]
    );
    setWorkoutTypeMuscleArray(updatedArray);
  };



  // Debounce
  useEffect(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    const newTimeout = setTimeout(() => {
      controller.updateWorkoutTypeMuscleMap(workoutTypeMuscleArray);
      // console.log("Array sent to the backend:", workoutTypeMuscleArray);
    }, 500);
    setDebounceTimeout(newTimeout);

    return () => {
      if (newTimeout) {
        clearTimeout(newTimeout);
      }
    };
  }, [workoutTypeMuscleArray, controller]);





  return (
    <div className="workout-settings-panel">
      <div className="workout-settings-information">
        <h1>Workout Types Config</h1>
        <p>Add, Remove or Edit workout Type</p>
        <p>Every workout type includes one or more muscles that will be worked on</p>
      </div>

      <div className="workout-settings-table-container">
        <table className="workout-settings-table">
          <thead>
            <tr>
              <th className="workout-settings-table-header">Type</th>
              <th className="workout-settings-table-header">Muscles</th>
              <th className="workout-settings-table-header-trash"></th>
            </tr>
          </thead>
          <tbody>
            {workoutTypeMuscleArray.map(([type, selectedMuscles], index) => (
              <tr key={index}>
                <td className="workout-settings-table-cell">
                  <input
                    type="text"
                    value={type}
                    onChange={(e) => handleInputChange(type, e.target.value)}
                  />
                </td>
                <td className="workout-settings-table-cell">
                  <MultiSelectInput
                    options={muscles}
                    selectedValues={selectedMuscles}
                    onSelectionChange={(selected) => handleSelectionChange(type, selected)}
                  />
                </td>
                <td className="workout-settings-table-cell">
                  <button
                    className="workout-settings-table-button"
                    onClick={() => handleDeleteWorkoutType(type)}>
                    <FontAwesomeIcon icon={faTrashCan} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="workout-settings-table-footer">
        <button
          className="workout-settings-table-button"
          onClick={handleAddWorkoutType}>
          <FontAwesomeIcon icon={faPlus} size="2x" />
        </button>
      </div>
    </div>
  );
};

export default WorkoutPanel;