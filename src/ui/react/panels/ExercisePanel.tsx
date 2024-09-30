import React, { useEffect, useRef, useState } from "react";
import { useWorkoutController } from "controller/WorkoutControllerProvider";
import { Exercise } from "models/Exercise";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp, faFloppyDisk, faPenToSquare, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import MultiSelectInput from "../components/MultiSelect";
import { REPS } from "utils/Constants";
import { ExerciseConfig } from "models/configs/ExerciseConfig";


const ExercisePanel: React.FC = () => {
  const controller = useWorkoutController();
  const [muscles, setMuscles] = useState<string[]>([]);
  const [exerciseConfigs, setExerciseConfigs] = useState<ExerciseConfig[]>([]); 
  const [filteredConfigs, setFilteredConfgis] = useState<ExerciseConfig[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);
  const [isEditMode, setEditMode] = useState<boolean>(false);
  const [editedConfig, setEditedConfig] = useState<ExerciseConfig | null>(null);
  const exerciseListRef = useRef<HTMLDivElement>(null);

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

  // Collapse
  const toggleCollapse = (exerciseId: string) => {
    setExpandedExerciseId((prev) => {
      if(prev === exerciseId){ //closing the tab
        setEditMode(false)
        setEditedConfig(null);
        return null;
      }else{ // open the tab
        return exerciseId
      }
    });
  };


  // cancel
  const cancelEdit = () =>{
    if (isEditMode) {
      setEditMode(false); 
      setEditedConfig(null); 
    }
  }

  // edit mode
  const handleEdit = (config: ExerciseConfig) => {
    setEditMode(true);
    setEditedConfig(config);
  };

   // Multi Select Input
   const handleMuscleSelectionChange = (selected: string[]) => {
    setEditedConfig((prevConfig) => {
      if (prevConfig) {
        const prevMuscleSet = new Set(prevConfig.muscles);
        const selectedSet = new Set(selected);
        const areEqual = prevMuscleSet.size === selectedSet.size && 
                        [...prevMuscleSet].every(item => selectedSet.has(item));

        if (areEqual) {
          return prevConfig; // No changes, return as is
        } else {
          return new ExerciseConfig(prevConfig.exercise, [...selected]); // Create a new ExerciseConfig with the updated muscles
        }
      }
      return null; // If prevConfig was null, explicitly return null
    });
  };

  const handleInputChange = (field: keyof Exercise, value: any) => {
    if (isEditMode && editedConfig) {
      const updatedExercise = new Exercise(
        editedConfig.exercise.name,
        editedConfig.exercise.sets,
        editedConfig.exercise.reps,
        editedConfig.exercise.weight,
        editedConfig.exercise.time,
        editedConfig.exercise.weightIncrease,
        editedConfig.exercise.variation,
        editedConfig.exercise.boosted,
        editedConfig.exercise.note,
        editedConfig.exercise.isSuccess,
        editedConfig.exercise.isCompleted,
        editedConfig.exercise.isUnlocked
      );
  
      // Convert the value to a number if the field is expected to be numeric
      if (['sets', 'weight', 'time', 'weightIncrease'].includes(field)) {
        (updatedExercise as any)[field] = value === "" ? 0 : Number(value);
      } else {
        (updatedExercise as any)[field] = value;
      }
  
      updatedExercise.nameToId();
      setEditedConfig((prevConfig) => {
        return new ExerciseConfig(updatedExercise, prevConfig?.muscles || []);
      });
    }
  };

  const handleSave = (oldConfig: ExerciseConfig) =>{
    if (isEditMode && editedConfig) {
      setExerciseConfigs(()=>{
        return controller.saveExerciseConfigs(oldConfig, editedConfig);
      })
      cancelEdit()
    } 
  }

  const handleDeleteExercise = (exerciseId: string) =>{
    const updatedConfigs = controller.deleteExerciseConfig(exerciseId);
    setExerciseConfigs([...updatedConfigs]); // Spread to ensure a new reference
    cancelEdit();
  }

  const handleAddExercise = () => {
    const newExercise = new Exercise("New Exercise");
    const updatedConfigs = controller.addExerciseConfig(newExercise);
    setExerciseConfigs([...updatedConfigs]); // Spread operator to create a new array
  
    setExpandedExerciseId(newExercise.id);
  
    // Scroll to the bottom with a slight delay
    setTimeout(() => {
      if (exerciseListRef.current) {
        exerciseListRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }, 100); // Adjust the delay as needed  }
  }








  

  return (
    <div className="workout-settings-panel" onClick={() => cancelEdit()}>
      <div className="workout-settings-information">
        <h1>Exercise Config</h1>
        <p>Add, Remove or Edit exercises</p>
        <p>Exercises are ordered by their muscle groups</p>
      </div>

      <div className="workout-settings-search">
        <input
          type="text"
          placeholder="Search exercises"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="workout-settings-exercise-list" ref={exerciseListRef} onClick={(e) => e.stopPropagation()}>
      {filteredConfigs.map((config) => (
          <div key={config.exercise.id}>
            <div className="workout-settings-exercise-header" onClick={() => toggleCollapse(config.exercise.id)}>
              <div className="workout-settings-exercise-header-name">{config.exercise.name}</div>
              <FontAwesomeIcon 
                className="workout-settings-exercise-header-arrow"
                icon={expandedExerciseId === config.exercise.id ? faAngleUp : faAngleDown} 
                size="2x"
              />
            </div>

            {expandedExerciseId === config.exercise.id && (
              <div className="workout-settings-exercise-container">
                <div className="workout-settings-exercise-container-details">
                  <div className="workout-settings-exercise-container-details-list">
                    {[
                      { label: "Name", type: "text", value: isEditMode?editedConfig?.exercise.name || "": config.exercise.name, field: "name" },
                      { label: "Sets", type: "number", value: isEditMode?editedConfig?.exercise.sets || "": config.exercise.sets, field: "sets" },
                      { label: "Weight", type: "number", value: isEditMode?editedConfig?.exercise.weight || "":  config.exercise.weight, field: "weight" },
                      { label: "Time", type: "text", value: isEditMode?editedConfig?.exercise.time || "":  config.exercise.time, field: "time" },
                      { label: "Weight Increase", type: "number", value: isEditMode?editedConfig?.exercise.weightIncrease || "": config.exercise.weightIncrease, field: "weightIncrease" }
                    ].map((inputItem, index) => (
                      <div key={index} className="workout-settings-exercise-container-details-element-box">
                        <label>{inputItem.label}</label>
                        <input
                          className="workout-settings-exercise-container-details-input"
                          type={inputItem.type}
                          value={inputItem.value}
                          readOnly={!isEditMode}
                          onChange={(e) => handleInputChange(inputItem.field as keyof Exercise, e.target.value)}
                        />
                      </div>
                    ))}

                    {/* Reps dropdown */}
                    <div key="reps" className="workout-settings-exercise-container-details-element-box">
                      <label>Reps</label>
                      <select
                        className="workout-settings-exercise-container-details-input"
                        value={editedConfig?.exercise.reps || config.exercise.reps}
                        disabled={!isEditMode}
                        onChange={(e) => handleInputChange("reps", e.target.value)}
                      >
                        {REPS.map((repOption, index) => (
                          <option key={index} value={repOption}>
                            {repOption}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* MultiSelectInput for Muscles */}
                    <div className="workout-settings-exercise-container-details-element-box">
                      <label>Muscles</label>
                      <MultiSelectInput
                        options={muscles}
                        selectedValues={config.muscles}
                        onSelectionChange={handleMuscleSelectionChange}
                      />
                    </div>

                    {/* Checkboxes for Core and Locked */}
                    <div className="workout-settings-exercise-container-details-checkboxes">
                      <div className="workout-settings-exercise-container-details-checkboxes-box">
                        <input
                          type="checkbox"
                          id={`locked-${config.exercise.id}`}
                          checked={editedConfig ? editedConfig?.exercise.isUnlocked: config.exercise.isUnlocked}
                          readOnly={!isEditMode}
                          onChange={(e) => handleInputChange('isUnlocked', e.target.checked)}
                        />
                        <label htmlFor={`locked-${config.exercise.id}`}>Unlocked</label>
                      </div>
                    </div>
                  </div>

                  <div className="workout-settings-exercise-container-buttons">
                    {isEditMode ? (
                      <button 
                        className="workout-settings-table-button workout-settings-table-button-save"
                        onClick={() => handleSave(config)}>
                        <FontAwesomeIcon icon={faFloppyDisk} />
                      </button>
                    ) : (
                      <button 
                        className="workout-settings-table-button"
                        onClick={() => handleEdit(config)}>
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                    )}
                    <button 
                    className="workout-settings-table-button" 
                    onClick={() => handleDeleteExercise(config.exercise.id)}>
                      <FontAwesomeIcon icon={faTrashCan} />
                    </button>

                  </div>
                </div>
                
                <div className="workout-settings-exercise-container-note">
                  <textarea 
                    rows={4} 
                    placeholder="Enter notes here..." 
                    value={isEditMode?editedConfig?.exercise.note || "":  config.exercise.note}
                    readOnly={!isEditMode}
                    onChange={(e) => handleInputChange('note', e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="workout-settings-table-footer">
        <button className="workout-settings-table-button" onClick={handleAddExercise}>
          <FontAwesomeIcon icon={faPlus} size="2x" />
        </button>
      </div>
    </div>
  );
};

export default ExercisePanel;
