import React, { useEffect, useState } from "react";
import { useWorkoutController } from "controller/ConfigControllerProvider";
import PanelLayout from "../components/PanelLayout";
import BreakForm from "../forms/BreakForms";
import { Workout } from "models/Workout";
import { getTodayLocalDate } from "utils/AlgorithmUtils";
import { BREAK } from "utils/Constants";

const BreakPanel: React.FC = () => {
  const controller = useWorkoutController();
  const [breaks, setBreaks] = useState<Workout[]>([]);

  // Load the breaks when the component mounts
  useEffect(() => {
    const loadData = async () => {
      const fetchedBreaks = controller.getAllBreaks();
      setBreaks(fetchedBreaks);
    };
    loadData();
  }, [controller]);

  // Update the break at the specified index with the new note
  const handleSave = (index: number, newBreak: string) => {
    // Create the updated breaks array
    const updatedBreaks = breaks.map((breakItem, idx) =>
      idx === index
        ? new Workout(
            BREAK,
            getTodayLocalDate(),
            newBreak,
            false,
            false,
            [],
            []
          )
        : breakItem
    );

    // Update the state with the new breaks
    setBreaks(updatedBreaks);

    // Save the updated breaks
    controller.saveBreaks(updatedBreaks);
  };

  // Remove the break at the specified index
  const handleDelete = (index: number) => {
    // Create the updated breaks array without the deleted break
    const updatedBreaks = breaks.filter((_, idx) => idx !== index);

    // Update the state with the new breaks
    setBreaks(updatedBreaks);

    // Save the updated breaks
    controller.saveBreaks(updatedBreaks);
  };

  // Add a new empty break to the list
  const handleAddBreak = () => {
    // Create the new break
    const newBreak = new Workout(
      BREAK,
      getTodayLocalDate(),
      "",
      false,
      false,
      [],
      []
    );

    // Create the updated breaks array with the new break
    const updatedBreaks = [...breaks, newBreak];

    // Update the state with the new breaks
    setBreaks(updatedBreaks);

    // Save the updated breaks
    controller.saveBreaks(updatedBreaks);
  };

  return (
    <PanelLayout
      title="Punishment Config"
      description="They should inspire fear in your soul. When you fail, you must atone by doing these."
      displayFooter={true}
      footerAction={handleAddBreak}
    >
      <div className="workout-settings-muscle-container">
        {breaks.map((breakWorkout, index) => (
          <div key={index}>
            <BreakForm
              index={index}
              initialBreak={breakWorkout.note}
              onSave={(newBreak: string) => handleSave(index, newBreak)}
              onDelete={() => handleDelete(index)}
            />
          </div>
        ))}
      </div>
    </PanelLayout>
  );
};

export default BreakPanel;
