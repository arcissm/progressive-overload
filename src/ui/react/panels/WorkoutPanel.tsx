import React, { useEffect, useState } from "react";
import { useWorkoutController } from "../../../controller/ConfigControllerProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import MultiSelectInput from "../components/MultiSelect";
import { Notice } from "obsidian";
import PanelLayout from "../components/PanelLayout";

const WorkoutPanel: React.FC = () => {
  const controller = useWorkoutController();
  const [muscles, setMuscles] = useState<string[]>([]);
  const [workoutTypeMuscleArray, setWorkoutTypeMuscleArray] = useState<[string, string[]][]>([]);

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
  const handleSelectionChange = (workoutType: string, selectedMuscles: string[]) => {
    const updatedArray = workoutTypeMuscleArray.map(([type, muscles], idx): [string, string[]] =>
      type === workoutType ? [type, selectedMuscles] : [type, muscles]
    );

    setWorkoutTypeMuscleArray(updatedArray);    
    controller.updateWorkoutTypeMuscleMap(updatedArray);
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
    controller.removeWorkoutType(type);
  };

  // Handle Input Change (Real-Time)
  const handleInputChange = (index: number, oldType: string, newType: string) => {
    setWorkoutTypeMuscleArray((prevArray) =>
      prevArray.map(([t, muscles], idx) => {
        if (idx === index) {
          return [newType, muscles];
        }
        return [t, muscles];
      })
    );
  };

  // Handle Blur (Validation and Controller Update)
  const handleBlurr = (index: number, oldType: string, newType: string) => {
    // Check for duplicates
    if (
      newType !== oldType &&
      workoutTypeMuscleArray.some(([t], idx) => idx !== index && t.toLowerCase() === newType.toLowerCase())
    ) {
      new Notice("This workout type already exists. Please choose a different name.");
      setWorkoutTypeMuscleArray((prevArray) =>
        prevArray.map(([t, muscles], idx) => (idx === index ? [oldType, muscles] : [t, muscles]))
      );
      return;
    }

    // Update the controller with the validated value
    controller.updateWorkoutTypeMuscleMap(workoutTypeMuscleArray);
  };

  
  return (
    <PanelLayout
      title="Workout Types Config"
      description="Every workout type includes one or more muscles that will be worked on that day."
      footerAction={handleAddWorkoutType}
      displayFooter={true} >
        
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
                    onChange={(e) => handleInputChange(index, type, e.target.value)}
                    onBlur={(e) => handleBlurr(index, type, e.target.value)}
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
                    onClick={() => handleDeleteWorkoutType(type)}
                  >
                    <FontAwesomeIcon icon={faTrashCan} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PanelLayout>
  );
};

export default WorkoutPanel;
