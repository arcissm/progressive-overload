export interface PluginSettings {
    notesDir: string;
    imagesDir: string;  // Add a directory path for images
    calendarCompletedColor: string;
    calendarCardioColor: string;
    calendarStartedColor: string;
}

// Default values for all our setting options
export const DEFAULT_SETTINGS: PluginSettings = {
    notesDir: "Gyming",
    imagesDir: "Motivation Pics",
    calendarCompletedColor: "#ffa500",
    calendarCardioColor: "#008080",
    calendarStartedColor: "#AD83FF",
}
