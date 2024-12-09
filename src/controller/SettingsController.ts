import WorkoutPlugin from "main";
import { DEFAULT_SETTINGS, PluginSettings } from "services/settings/Settings";

export class SettingsController {
    settings: PluginSettings;
    plugin: WorkoutPlugin;

    constructor(plugin: WorkoutPlugin) {
        this.plugin = plugin;
    }

    async updateSettings(newSettings: Partial<PluginSettings>) {
        this.settings = { ...this.settings, ...newSettings };
        await this.saveSettings();
    }

    async updateFullSettings(updatedSettings: PluginSettings) {
        this.settings = updatedSettings;
        await this.saveSettings();
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.plugin.loadData());
        this.settings.imagesDir = this.settings.imagesDir || DEFAULT_SETTINGS.imagesDir;
        this.settings.calendarCompletedColor = this.settings.calendarCompletedColor || DEFAULT_SETTINGS.calendarCompletedColor;
        this.settings.calendarCardioColor = this.settings.calendarCardioColor || DEFAULT_SETTINGS.calendarCardioColor;
        this.settings.calendarStartedColor = this.settings.calendarStartedColor || DEFAULT_SETTINGS.calendarStartedColor;
        this.settings.yogaChance = this.settings.yogaChance || DEFAULT_SETTINGS.yogaChance;
        this.settings.numberWorkoutDays2Weeks = this.settings.numberWorkoutDays2Weeks || DEFAULT_SETTINGS.numberWorkoutDays2Weeks;
    }

    async saveSettings() {
        if (!this.settings.notesDir || !this.settings.imagesDir) {
            await this.plugin.saveData(DEFAULT_SETTINGS);
        } else {
            await this.plugin.saveData(this.settings);
        }
    }
}
