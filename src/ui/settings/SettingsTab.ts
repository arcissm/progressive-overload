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
				.setValue(this.plugin.settings.notePath)
				.onChange(async (value) => {
					this.plugin.settings.notePath = value;
					await this.plugin.saveSettings();
				}));
	}
}
