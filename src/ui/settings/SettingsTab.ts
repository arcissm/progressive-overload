import { App, PluginSettingTab, Setting } from "obsidian";

// This is what appears in the settings UI
// It updates the Settings Object when a value is changed
// It tells the plugin to save the Settings
export class SettingsTab extends PluginSettingTab {
    plugin: any;

    constructor(app: App, plugin: any) {
        super(app, plugin);
        this.plugin = plugin;
    }

    async display(): Promise<void> {
        const { containerEl } = this;
        containerEl.empty(); // Clear any existing settings

        containerEl.createEl('h2', { text: 'Workout Plugin Settings' });

        // Note Path Setting
        new Setting(containerEl)
            .setName('Note Path')
            .setDesc('Path where the workout notes will be created')
            .addText(text => text
                .setPlaceholder('Enter path')
                .setValue(this.plugin.settings.notesDir) // Adjusted to use notesDir
                .onChange(async (value) => {
                    this.plugin.settings.notesDir = value;
                    await this.plugin.saveSettings();
                }));

        // Image Directory Path Setting
        new Setting(containerEl)
            .setName('Image Directory')
            .setDesc('Directory where images will be stored')
            .addText(text => text
                .setPlaceholder('Enter directory name for images')
                .setValue(this.plugin.settings.imagesDir)  // New setting for image directory
                .onChange(async (value) => {
                    this.plugin.settings.imagesDir = value;
                    await this.plugin.saveSettings();
                }));
    }
}
