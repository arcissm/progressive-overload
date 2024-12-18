import React, { useState, useEffect } from 'react';
import { Exercise } from 'models/Exercise';
import { ExerciseConfig } from 'models/configs/ExerciseConfig';
import MultiSelectInput from '../components/MultiSelect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { REPS } from 'utils/Constants';

interface ExerciseFormProps {
  initialConfig: ExerciseConfig;
  muscles: string[];
  onSave: (oldConfig: ExerciseConfig, newConfig: ExerciseConfig) => void;
  onDelete: (exerciseId: string) => void;
}

const ExerciseForm: React.FC<ExerciseFormProps> = ({
  initialConfig,
  muscles,
  onSave,
  onDelete,
}) => {
  const [isEditMode, setEditMode] = useState<boolean>(false);
  const [editedConfig, setEditedConfig] = useState<ExerciseConfig>(initialConfig);

  useEffect(() => {
    // Reset editedConfig when initialConfig changes (e.g., when collapsing)
    setEditedConfig(initialConfig);
    setEditMode(false);
  }, [initialConfig]);

  // Input
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
  
      // Allow empty value but enforce minimum when not empty
      if (['sets', 'weight', 'time', 'weightIncrease'].includes(field)) {
        let numericValue = value === "" ? "" : Number(value);
        if (field === 'sets' && numericValue !== "" && typeof numericValue === "number" && numericValue < 1) {
          numericValue = 1; // Enforce minimum value of 1 for sets
        }
        (updatedExercise as any)[field] = numericValue;
      } else {
        (updatedExercise as any)[field] = value;
      }
  
      updatedExercise.nameToId();
      setEditedConfig((prevConfig) => {
        return new ExerciseConfig(updatedExercise, prevConfig?.muscles || []);
      });
    }
  };
  

  // Muscle Input
  const handleMuscleSelectionChange = (selected: string[]) => {
    if (isEditMode) {
      setEditedConfig((prevConfig) => {
        return new ExerciseConfig(prevConfig.exercise, [...selected]);
      });
    }
  };

  // Save
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(initialConfig)
    console.log(editedConfig)

    onSave(initialConfig, editedConfig);
    setEditMode(false);
  };

  // Edit Mode
  const handleEdit = () => {
    setEditMode(true);
  };

  // Cancelt Edit
  const handleCancelEdit = () => {
    setEditedConfig(initialConfig);
    setEditMode(false);
  };

  return (
    <form onSubmit={handleSave}>
      <div className="workout-settings-exercise-container">
        <div className="workout-settings-exercise-container-details">
          <div className="workout-settings-exercise-container-details-list">
            {[
              {
                label: 'Name',
                type: 'text',
                value: editedConfig.exercise.name,
                field: 'name',
              },
              {
                label: 'Sets',
                type: 'number',
                value: editedConfig.exercise.sets,
                field: 'sets',
              },
              {
                label: 'Weight',
                type: 'number',
                value: editedConfig.exercise.weight,
                field: 'weight',
              },
              {
                label: 'Time',
                type: 'text',
                value: editedConfig.exercise.time,
                field: 'time',
              },
              {
                label: 'Weight Increase',
                type: 'number',
                value: editedConfig.exercise.weightIncrease,
                field: 'weightIncrease',
              },
            ].map((inputItem, index) => (
              <div
                key={index}
                className="workout-settings-exercise-container-details-element-box"
              >
                <label>{inputItem.label}</label>
                <input
                  className="workout-settings-exercise-container-details-input"
                  type={inputItem.type}
                  value={inputItem.value}
                  readOnly={!isEditMode}
                  onChange={(e) =>
                    handleInputChange(inputItem.field as keyof Exercise, e.target.value)
                  }
                />
              </div>
            ))}

            {/* Reps dropdown */}
            <div
              key="reps"
              className="workout-settings-exercise-container-details-element-box"
            >
              <label>Reps</label>
              <select
                className="workout-settings-exercise-container-details-input"
                value={editedConfig.exercise.reps}
                disabled={!isEditMode}
                onChange={(e) => handleInputChange('reps', e.target.value)}
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
                selectedValues={editedConfig.muscles}
                onSelectionChange={handleMuscleSelectionChange}
                disabled={!isEditMode}
              />
            </div>

            {/* Checkboxes */}
            <div className="workout-settings-exercise-container-details-checkboxes">
              <div className="workout-settings-exercise-container-details-checkboxes-box">
                <input
                  type="checkbox"
                  id={`unlocked-${editedConfig.exercise.id}`}
                  checked={editedConfig.exercise.isUnlocked}
                  readOnly={!isEditMode}
                  onChange={(e) => handleInputChange('isUnlocked', e.target.checked)}
                />
                <label htmlFor={`unlocked-${editedConfig.exercise.id}`}>Unlocked</label>
              </div>
            </div>
          </div>

          <div className="workout-settings-exercise-container-buttons">
            {isEditMode ? (
              <>
                <button
                  className="workout-settings-table-button workout-settings-table-button-save"
                  type="submit"
                >
                  <FontAwesomeIcon icon={faFloppyDisk} />
                </button>
                <button
                  className="workout-settings-table-button"
                  type="button"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                className="workout-settings-table-button"
                type="button"
                onClick={handleEdit}
              >
                <FontAwesomeIcon icon={faPenToSquare} />
              </button>
            )}
            <button
              className="workout-settings-table-button"
              type="button"
              onClick={() => onDelete(editedConfig.exercise.id)}
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </div>
        </div>

        <div className="workout-settings-exercise-container-note">
          <textarea
            rows={4}
            placeholder="Enter notes here..."
            value={editedConfig.exercise.note}
            readOnly={!isEditMode}
            onChange={(e) => handleInputChange('note', e.target.value)}
          />
        </div>
      </div>
    </form>
  );
};

export default ExerciseForm;
