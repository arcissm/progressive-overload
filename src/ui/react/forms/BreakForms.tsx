import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';

interface BreakFormProps {
  initialBreak: string;
  index: number,
  onSave: (newBreak: string) => void;
  onDelete: (breakIndex: number) => void;
}

const BreakForm: React.FC<BreakFormProps> = ({ initialBreak, index, onSave, onDelete}) => {
  const [isEditMode, setEditMode] = useState<boolean>(false);
  const [editedBreak, seteditedBreak] = useState<string>(initialBreak);

  // Utity
  const processBreakString = (breakString: string): string => {
    return breakString.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
  };

  // Update editedExercise when initialBreak changes
  useEffect(() => {
    seteditedBreak(processBreakString(initialBreak));
    setEditMode(false);
  }, [initialBreak]);


  // Save
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedBreak);
    setEditMode(false);
  };

  // Edit Mode
  const handleEdit = () => {
    setEditMode(true);
  };

  // Cancel Edit
  const handleCancelEdit = () => {
    setEditMode(false);
    seteditedBreak(processBreakString(initialBreak));
  };

  return (
    <form onSubmit={handleSave}>
      <div className="workout-settings-exercise-container">
        <div className="workout-settings-exercise-container-details">
          <div className="workout-settings-exercise-container-details-list">
            <div className="workout-settings-exercise-container-note">
              <textarea
                rows={18}
                placeholder="Enter notes here..."
                value={editedBreak}
                readOnly={!isEditMode}
                onChange={(e) => seteditedBreak(e.target.value)}
              />
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
              onClick={() => onDelete(index)}
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default BreakForm;
