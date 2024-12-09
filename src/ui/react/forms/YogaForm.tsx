import React, { useState, useEffect } from 'react';
import { faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useWorkoutController } from 'controller/ConfigControllerProvider';
import { useSettingsController } from 'controller/SettingsControllerProvider';
import LabelledInput from '../components/LabelledInput';

interface YogaFormProps {
    initialYoga: string[];
}

const YogaForm: React.FC<YogaFormProps> = ({ initialYoga }) => {
  const controller = useWorkoutController();
  const { settings, updateSettings } = useSettingsController();

  const [editedYoga, setEditedYoga] = useState<string[]>(initialYoga);
  const [debouncedYogaUpdate, setDebouncedYogaUpdate] = useState<string[] | null>(null);

  useEffect(() => {
    // Whenever initialYoga changes or settings.yogaChance changes, we synchronize.
    // In this case, we only need to sync the string array.
    setEditedYoga(initialYoga);
  }, [initialYoga]);
  
  // Delete
  const handleAdd = () => {
    setEditedYoga((prev) => {
      const updated = [...prev, ""];
      setDebouncedYogaUpdate(updated);
      return updated;
    });
  };

  // Delete
  const handleDelete = (index: number) => {
    setEditedYoga((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      setDebouncedYogaUpdate(updated);
      return updated;
    });
  };

  // List Input
  const handleUrlChange = (urlIndex: number, value: string) => {
    setEditedYoga((prev) => {
      const updated = [...prev];
      updated[urlIndex] = value;
      setDebouncedYogaUpdate(updated);
      return updated;
    });
  };

  // Chance Input
  const handleChanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChance = Number(e.target.value);
    if (!isNaN(newChance)) {
      updateSettings({ yogaChance: newChance });
    }
  };

  // Debounce saving the updated yoga string list
  useEffect(() => {
    if (debouncedYogaUpdate) {
      const timeoutId = setTimeout(() => {
        controller.updateYoga(debouncedYogaUpdate);
        setDebouncedYogaUpdate(null);
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [debouncedYogaUpdate, controller]);

  return (
    <div className="workout-settings-exercise-container">
      <div className="workout-settings-exercise-container-details">
        <div className="workout-settings-exercise-container-details-list">
          {/* Chance Input */}
          <LabelledInput
            label={"What is the chance that you get a Yoga warmup"}
            description={"1/4 workouts = 25% = 0.25"}
            value={settings.yogaChance}
            type={"number"}
            onChange={handleChanceChange}
          />

          {/* Videos List and Add Button */}
          <div className="workout-settings-exercise-container-details-element-box">
            <label className="label-workout-days">Videos</label>

            <div className="yoga-add-button_place">
              <div className="yoga-add-button">
                <button type="button" onClick={handleAdd}>
                  <FontAwesomeIcon icon={faPlus} size="lg" />
                </button>
              </div>
            </div>

            {/* Display URLs in reverse */}
            {editedYoga
              .slice()
              .reverse()
              .map((url, reversedIndex) => {
                const originalIndex = editedYoga.length - 1 - reversedIndex;
                return (
                  <div key={reversedIndex} className="yoga-videos_url">
                    <div className="yoga-videos_url-input">
                      <input
                        className="workout-settings-exercise-container-details-input"
                        type="text"
                        value={url}
                        onChange={(e) => handleUrlChange(originalIndex, e.target.value)}
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
