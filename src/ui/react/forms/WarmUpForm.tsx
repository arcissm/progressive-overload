import React, { useState, useEffect } from 'react';
import { Exercise } from 'models/Exercise';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { REPS } from 'utils/Constants';

interface WarmUpFormProps {
    initialExercise: Exercise;
  onSave: (oldExercise: Exercise, newExercise: Exercise) => void;
  onDelete: (exerciseId: string) => void;
}

const WarmUpForm: React.FC<WarmUpFormProps> = ({
    initialExercise,
  onSave,
  onDelete,
}) => {
  const [isEditMode, setEditMode] = useState<boolean>(false);
  const [editedExercise, setEditiedExercise] = useState<Exercise>(initialExercise);

  useEffect(() => {
    // Reset editedConfig when initialConfig changes (e.g., when collapsing)
    setEditiedExercise(initialExercise);
    setEditMode(false);
  }, [initialExercise]);

  // Input change handlers
  const handleInputChange = (field: keyof Exercise, value: any) => {
    if (isEditMode && editedExercise) {
      const updatedExercise = new Exercise(
        editedExercise.name,
        editedExercise.sets,
        editedExercise.reps,
        editedExercise.weight,
        editedExercise.time,
        editedExercise.weightIncrease,
        editedExercise.variation,
        editedExercise.boosted,
        editedExercise.note,
        editedExercise.isSuccess,
        editedExercise.isCompleted,
        editedExercise.isUnlocked
      );
  
      // Convert the value to a number if the field is expected to be numeric
      if (['sets', 'weight', 'time'].includes(field)) {
        (updatedExercise as any)[field] = value === "" ? 0 : Number(value);
      } else {
        (updatedExercise as any)[field] = value;
      }
  
      updatedExercise.nameToId();
      setEditiedExercise((prevConfig) => {
        return updatedExercise.clone();
      });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(initialExercise, editedExercise);
    setEditMode(false);
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditiedExercise(initialExercise);
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
                value: editedExercise.name,
                field: 'name',
              },
              {
                label: 'Sets',
                type: 'number',
                value: editedExercise.sets,
                field: 'sets',
              },
              {
                label: 'Weight',
                type: 'number',
                value: editedExercise.weight,
                field: 'weight',
              },
              {
                label: 'Time',
                type: 'text',
                value: editedExercise.time,
                field: 'time',
              }
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
                value={editedExercise.reps}
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
              onClick={() => onDelete(editedExercise.id)}
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </div>
        </div>

        <div className="workout-settings-exercise-container-note">
          <textarea
            rows={4}
            placeholder="Enter notes here..."
            value={editedExercise.note}
            readOnly={!isEditMode}
            onChange={(e) => handleInputChange('note', e.target.value)}
          />
        </div>
      </div>
    </form>
  );
};

export default WarmUpForm;
