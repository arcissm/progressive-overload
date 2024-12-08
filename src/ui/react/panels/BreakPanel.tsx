import React, { useEffect, useState } from "react";
import { useWorkoutController } from "controller/ConfigControllerProvider";
import PanelLayout from "../components/PanelLayout";
import BreakForm from "../forms/BreakForms";
import { Workout } from "models/Workout";
import { getTodayLocalDate } from "utils/AlgorithmUtils";
import { BREAK } from "utils/Constants";
import { useSettingsController } from "controller/SettingsControllerProvider";
import LabelledInput from "../components/LabelledInput";

const BreakPanel: React.FC = () => {
  const controller = useWorkoutController();
  const { settings, updateSettings } = useSettingsController();

  const [breaks, setBreaks] = useState<Workout[]>([]);
  const [workoutDays2Weeks, setWorkoutDays2Weeks] = useState(settings.numberWorkoutDays2Weeks);

  useEffect(() => {
    const fetchedBreaks = controller.getAllBreaks();
    setBreaks(fetchedBreaks);
  }, [controller]);

  useEffect(() => {
    if (workoutDays2Weeks !== settings.numberWorkoutDays2Weeks) {
      updateSettings({ numberWorkoutDays2Weeks: workoutDays2Weeks });
    }
  }, [workoutDays2Weeks, settings, updateSettings]);

  const handleSave = (index: number, newBreak: string) => {
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

    setBreaks(updatedBreaks);
    controller.saveBreaks(updatedBreaks);
  };

  const handleDelete = (index: number) => {
    const updatedBreaks = breaks.filter((_, idx) => idx !== index);
    setBreaks(updatedBreaks);
    controller.saveBreaks(updatedBreaks);
  };

  const handleAddBreak = () => {
    const newBreak = new Workout(
      BREAK,
      getTodayLocalDate(),
      "",
      false,
      false,
      [],
      []
    );
    const updatedBreaks = [...breaks, newBreak];
    setBreaks(updatedBreaks);
    controller.saveBreaks(updatedBreaks);
  };

  const handleWorkoutDaysChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value)) {
      setWorkoutDays2Weeks(value);
    } else if (event.target.value === "") {
      setWorkoutDays2Weeks(0);
    }
  };

  return (
    <PanelLayout
      title="Punishment Config"
      description="They should inspire fear in your soul. When you fail, you must atone by doing these."
      displayFooter={true}
      footerAction={handleAddBreak}
    >
      <LabelledInput 
        label={"Number of Workout Days in 2 Weeks"} 
        description={"Number of workout days planned within a 14-day period"} 
        value={workoutDays2Weeks} 
        type={"number"} 
        onChange={handleWorkoutDaysChange}/>

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
    </PanelLayout>
  );
};

export default BreakPanel;
