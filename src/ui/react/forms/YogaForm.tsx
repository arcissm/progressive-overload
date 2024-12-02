import React, { useState, useEffect } from 'react';
import { Exercise } from 'models/Exercise';
import { Yoga } from 'models/Yoga';
import { faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useWorkoutController } from 'controller/ConfigControllerProvider';

interface YogaFormProps {
    initialYoga: Yoga;
//   onSave: (oldYoga: Yoga, newYoga: Yoga) => void;
//   onDelete: (exerciseId: string) => void;
}
const YogaForm: React.FC<YogaFormProps> = ({ initialYoga }) => {
  const controller = useWorkoutController();
  const [editedYoga, setEditedYoga] = useState<Yoga>(initialYoga);
  const [debouncedYogaUpdate, setDebouncedYogaUpdate] = useState<Yoga | null>(null);

  useEffect(() => {
    // Reset editedYoga when initialYoga changes
    setEditedYoga(initialYoga);
  }, [initialYoga]);

  // Input change handlers
  const handleInputChange = (
    field: keyof Yoga,
    value: string | number,
    urlIndex?: number
  ) => {
    setEditedYoga((prevYoga) => {
      const updatedYoga = new Yoga(prevYoga.chance, [...prevYoga.urls]);

      if (field === "chance") {
        updatedYoga.chance = Number(value);
      } else if (field === "urls" && typeof urlIndex === "number") {
        updatedYoga.urls[urlIndex] = String(value);
      }

      // Set the updated yoga for debouncing
      setDebouncedYogaUpdate(updatedYoga);

      return updatedYoga;
    });
  };

  // Add a new empty URL to the list
  const handleAdd = () => {
    setEditedYoga((prevYoga) => {
      const updatedYoga = new Yoga(prevYoga.chance, [...prevYoga.urls, ""]);
      setDebouncedYogaUpdate(updatedYoga);
      return updatedYoga;
    });
  };

  // Delete a URL at the specified index
  const handleDelete = (index: number) => {
    setEditedYoga((prevYoga) => {
      const updatedYoga = new Yoga(
        prevYoga.chance,
        prevYoga.urls.filter((_, i) => i !== index)
      );
      setDebouncedYogaUpdate(updatedYoga);
      return updatedYoga;
    });
  };

  // Debounce yoga updates
  useEffect(() => {
    if (debouncedYogaUpdate) {
      const timeoutId = setTimeout(() => {
        // Update yoga in the controller
        if(debouncedYogaUpdate) controller.updateYoga(debouncedYogaUpdate);
        setDebouncedYogaUpdate(null); // Clear the debounced update
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [debouncedYogaUpdate]);

  return (
    <div className="workout-settings-exercise-container">
      <div className="workout-settings-exercise-container-details">
        <div className="workout-settings-exercise-container-details-list">
          {/* Chance Input */}
          <div className="workout-settings-exercise-container-details-element-box">
            <label>Chance</label>
            <input
              className="workout-settings-exercise-container-details-input"
              type="number"
              value={editedYoga.chance}
              onChange={(e) =>
                handleInputChange("chance", Number(e.target.value))
              }
            />
          </div>

          {/* Videos List and Add Button */}
          <div className="workout-settings-exercise-container-details-element-box">
            <label>Videos</label>

            <div className="yoga-add-button_place">
              <div className="yoga-add-button">
                <button type="button" className="" onClick={handleAdd}>
                  <FontAwesomeIcon icon={faPlus} size="lg" />
                </button>
              </div>
            </div>

            {/* Display URLs in reverse */}
            {editedYoga.urls
              .slice()
              .reverse()
              .map((url, reversedIndex) => {
                const originalIndex = editedYoga.urls.length - 1 - reversedIndex;
                return (
                  <div key={reversedIndex} className="yoga-videos_url">
                    <div className="yoga-videos_url-input">
                      <input
                        className="workout-settings-exercise-container-details-input"
                        type="text"
                        value={url}
                        onChange={(e) =>
                          handleInputChange("urls", e.target.value, originalIndex)
                        }
                      />
                    </div>
                    <div className="yoga-videos_url-button">
                      <button
                        type="button"
                        onClick={() => handleDelete(originalIndex)}
                      >
                        <FontAwesomeIcon icon={faTrashCan} />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default YogaForm;
