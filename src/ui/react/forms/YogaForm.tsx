import React, { useState, useEffect } from 'react';
import { Yoga } from 'models/Yoga';
import { faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useWorkoutController } from 'controller/ConfigControllerProvider';
import { useSettingsController } from 'controller/SettingsControllerProvider';
import LabelledInput from '../components/LabelledInput';

interface YogaFormProps {
    initialYoga: Yoga;
}

const YogaForm: React.FC<YogaFormProps> = ({ initialYoga }) => {
  const controller = useWorkoutController();
  const { settings, updateSettings } = useSettingsController();

  // Instead of storing chance separately, we rely on settings.yogaChance
  // but we still need editedYoga to store URLs and to pass to updateYoga.
  const [editedYoga, setEditedYoga] = useState<Yoga>(
    new Yoga(settings.yogaChance, [...initialYoga.urls])
  );
  const [debouncedYogaUpdate, setDebouncedYogaUpdate] = useState<Yoga | null>(null);

  useEffect(() => {
    // Sync editedYoga with initialYoga's URLs and current settings.yogaChance
    setEditedYoga(new Yoga(settings.yogaChance, [...initialYoga.urls]));
  }, [initialYoga, settings.yogaChance]);

  // Add a new empty URL to the list
  const handleAdd = () => {
    setEditedYoga((prevYoga) => {
      const updatedYoga = new Yoga(settings.yogaChance, [...prevYoga.urls, ""]);
      setDebouncedYogaUpdate(updatedYoga);
      return updatedYoga;
    });
  };

  // Delete a URL at the specified index
  const handleDelete = (index: number) => {
    setEditedYoga((prevYoga) => {
      const updatedYoga = new Yoga(
        settings.yogaChance,
        prevYoga.urls.filter((_, i) => i !== index)
      );
      setDebouncedYogaUpdate(updatedYoga);
      return updatedYoga;
    });
  };

  // Handle URL input changes
  const handleUrlChange = (urlIndex: number, value: string) => {
    setEditedYoga((prevYoga) => {
      const updatedUrls = [...prevYoga.urls];
      updatedUrls[urlIndex] = value;
      const updatedYoga = new Yoga(settings.yogaChance, updatedUrls);
      setDebouncedYogaUpdate(updatedYoga);
      return updatedYoga;
    });
  };

  // Handle chance input changes directly from settings
  const handleChanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChance = Number(e.target.value);
    if (!isNaN(newChance)) {
      // Update settings
      updateSettings({ yogaChance: newChance });

      // Update editedYoga with the new chance
      setEditedYoga((prevYoga) => {
        const updatedYoga = new Yoga(newChance, [...prevYoga.urls]);
        setDebouncedYogaUpdate(updatedYoga);
        return updatedYoga;
      });
    }
  };

  // Debounce yoga updates
  useEffect(() => {
    if (debouncedYogaUpdate) {
      const timeoutId = setTimeout(() => {
        if (debouncedYogaUpdate) controller.updateYoga(debouncedYogaUpdate);
        setDebouncedYogaUpdate(null); // Clear the debounced update
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [debouncedYogaUpdate, controller]);

  return (
    <div className="workout-settings-exercise-container">
      <div className="workout-settings-exercise-container-details">
        <div className="workout-settings-exercise-container-details-list">
          {/* Chance Input - now using settings.yogaChance */}
          <LabelledInput
            label={"What is the chance that you get a Yoga warmup"}
            description={" 1/4 workouts = 25% = 0.25"}
            value={settings.yogaChance} // Display current settings value
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
