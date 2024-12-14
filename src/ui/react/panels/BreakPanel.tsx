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

  const [breakDescription, setBreakDescription] = useState(
    `They should inspire fear in your soul. When you fail to meet your quota of minimum ${workoutDays2Weeks} days in 2 weeks, you will be forced to doing these. Make them hard. They don't have to be related to working out. Just fears.`)

  useEffect(() => {
    setBreakDescription(
      `They should inspire fear in your soul. When you fail to meet your quota of minimum ${workoutDays2Weeks} days in 2 weeks, you will be forced to doing these. Make them hard. They don't have to be related to working out. Just fears.`
    );
  }, [workoutDays2Weeks]);

  
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
    const inputValue = event.target.value;

    if (inputValue === "") {
      setWorkoutDays2Weeks(-1);
      return;
    }
  
    const days = Number(inputValue)
    setWorkoutDays2Weeks(days);
  };

  return (
    <PanelLayout
      title="Punishment Config"
      description={breakDescription}
      displayFooter={true}
      footerAction={handleAddBreak}
    >
      <LabelledInput 
        label={"Number of Workout Days in 2 Weeks"} 
        description={"Number of workout days planned within a 14-day period"} 
        value={workoutDays2Weeks === -1 ? "" : workoutDays2Weeks}
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
