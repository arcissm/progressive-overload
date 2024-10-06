export interface PluginSettings {
    notesDir: string;
    imagesDir: string;  // Add a directory path for images
}

// Default values for all our setting options
export const DEFAULT_SETTINGS: PluginSettings = {
    notesDir: "Gyming",
    imagesDir: "Motivation Pics" // Set default for images directory
};
