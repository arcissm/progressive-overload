export interface PluginSettings {
    notesDir: string;
    imagesDir: string;
    calendarCompletedColor: string;
    calendarCardioColor: string;
    calendarStartedColor: string;
    yogaChance: number;
    numberWorkoutDays2Weeks: number;
}

// Default values for all our setting options
export const DEFAULT_SETTINGS: PluginSettings = {
    notesDir: "Gyming",
    imagesDir: "Motivation Pics",
    calendarCompletedColor: "#ffa500",
    calendarCardioColor: "#008080",
    calendarStartedColor: "#AD83FF",
    yogaChance: 0.25,
    numberWorkoutDays2Weeks: 8
}
