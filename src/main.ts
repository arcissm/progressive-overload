import { Plugin, TFile, WorkspaceLeaf } from "obsidian"; 
import { SettingsTab } from "./ui/settings/SettingsTab";
import { PluginSettings, DEFAULT_SETTINGS } from "./services/settings/Settings";
import { WorkoutDropdownModal } from "./ui/ribbon/WorkoutDropdownModal";
import { WorkoutController } from "controller/WorkoutController";
import { CONFIG_WORKOUT_VIEW, ConfigWorkoutsView } from "ui/view/ConfigWorkoutsView";
import {  WorkoutView, WORKOUT_VIEW } from "ui/view/WorkoutView";

export default class WorkoutPlugin extends Plugin {
	private settings: PluginSettings;
	private controller: WorkoutController;
	private configView: ConfigWorkoutsView;
	private statsView: WorkoutView;

	// @ts-ignore
	private dirPath = this.app.vault.adapter.basePath;

	async onload() {
		await this.loadSettings();
		this.controller = new WorkoutController(this.app, this.settings);

		// Add the settings tab to Obsidian's settings
		this.addSettingTab(new SettingsTab(this.app, this));

		// Note Deleted Event
		this.registerEvent(this.app.vault.on('delete', async (file) => {
			if (file instanceof TFile) {
				this.controller.removeWorkout(file.name);
			}
		}));

		this.addRibbonIcon('dumbbell', 'New Workout', () => {
			new WorkoutDropdownModal(this.app, this.controller).open();
		});

		// Register Config Workouts View
		this.registerView(
			CONFIG_WORKOUT_VIEW,
			(leaf: WorkspaceLeaf) => (this.configView = new ConfigWorkoutsView(leaf, this.controller))
		);

		// Register the ExempleView (aaaaaa view)
		this.registerView(
			WORKOUT_VIEW,
			(leaf: WorkspaceLeaf) => (this.statsView = new WorkoutView(leaf, this.controller))
		);

		// Ensure layout is ready and check for existing leaves
		this.app.workspace.onLayoutReady(this.onLayoutReady.bind(this));

		// Handle file modification
		this.registerEvent(this.app.vault.on('modify', (file) => {
			const filenamePattern = /^\d{4}-\d{2}-\d{2} .+\.md$/;
			const gymDirectory = file.path.split('/')[0];
			if (file instanceof TFile && file.extension === 'md' && filenamePattern.test(file.name) && gymDirectory === this.settings.notesDir) {
				console.log(file.name);
				// TODO: CHANGE TO ONLY FILE OF TODAY
				// but after cuz it would be a bitch to debug
				this.controller.handleFileChange(file);
			}
		}));
	}

	onunload() {
		this.app.workspace.detachLeavesOfType(WORKOUT_VIEW); // Clean up WorkoutView
		this.app.workspace.detachLeavesOfType(CONFIG_WORKOUT_VIEW); // Clean up ConfigWorkoutsView
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		if (this.settings.notesDir === "") {
			await this.saveData(DEFAULT_SETTINGS);
		} else {
			await this.saveData(this.settings);
		}
	}

	// Ensure the layout is ready and avoid spawning multiple views
	onLayoutReady(): void {
		// Load ExempleView (aaaaaa view) if not already open
		if (this.app.workspace.getLeavesOfType(WORKOUT_VIEW).length === 0) {
			this.app.workspace.getRightLeaf(false)?.setViewState({
				type: WORKOUT_VIEW,
			});
		}

		// Load ConfigWorkoutsView if not already open
		if (this.app.workspace.getLeavesOfType(CONFIG_WORKOUT_VIEW).length === 0) {
			this.app.workspace.getRightLeaf(false)?.setViewState({
				type: CONFIG_WORKOUT_VIEW,
			});
		}
		
	}
}
