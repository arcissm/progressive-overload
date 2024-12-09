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
    }
}
