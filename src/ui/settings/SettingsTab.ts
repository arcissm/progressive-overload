import { App, PluginSettingTab, Setting } from "obsidian";
import WorkoutPlugin from "main";

export class SettingsTab extends PluginSettingTab {
    plugin: WorkoutPlugin;

    constructor(app: App, plugin: WorkoutPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    async display(): Promise<void> {
        const { containerEl } = this;
        containerEl.empty(); // Clear any existing settings

        containerEl.createEl('h2', { text: 'Workout Plugin Settings' });

        const settings = this.plugin.settingsController.settings;

        // Note Path Setting
        new Setting(containerEl)
            .setName('Note Path')
            .setDesc('Path where the workout notes will be created')
            .addText(text => text
                .setPlaceholder('Enter path')
                .setValue(settings.notesDir)
                .onChange(async (value) => {
                    this.plugin.settingsController.updateSettings({ notesDir: value });
                }));

        // Image Directory Path Setting
        new Setting(containerEl)
            .setName('Image Directory')
            .setDesc('Directory where images will be stored')
            .addText(text => text
                .setPlaceholder('Enter directory name for images')
                .setValue(settings.imagesDir)
                .onChange(async (value) => {
                    this.plugin.settingsController.updateSettings({ imagesDir: value });
                }));

                
    // Yoga Chance Setting
        // This expects a number (0 to 1). Users can input a decimal or fraction.
        new Setting(containerEl)
            .setName('Yoga Chance')
            .setDesc('Chance (between 0 and 1) that a chosen workout will be yoga')
            .addText(text => text
                .setPlaceholder('0.25')
                .setValue(settings.yogaChance.toString())
                .onChange(async (value) => {
                    const parsed = parseFloat(value);
                    // Validate the input to ensure it’s between 0 and 1
                    if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
                        this.plugin.settingsController.updateSettings({ yogaChance: parsed });
                    }
                }));

        // Number of Workout Days in 2 Weeks
        // This expects an integer number.
        new Setting(containerEl)
            .setName('Workout Days in 2 Weeks')
            .setDesc('Number of workout days planned within a 14-day period')
            .addText(text => text
                .setPlaceholder('8')
                .setValue(settings.numberWorkoutDays2Weeks.toString())
                .onChange(async (value) => {
                    const parsed = parseInt(value, 10);
                    // Validate the input to ensure it’s a positive integer
                    if (!isNaN(parsed) && parsed >= 0) {
                        this.plugin.settingsController.updateSettings({ numberWorkoutDays2Weeks: parsed });
                    }
                }));
    }
}
