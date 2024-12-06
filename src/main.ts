import { Plugin, TFile, WorkspaceLeaf } from "obsidian"; 
import { SettingsTab } from "./ui/settings/SettingsTab";
import { WorkoutDropdownModal } from "./ui/ribbon/WorkoutDropdownModal";
import { WorkoutController } from "controller/WorkoutController";
import { CONFIG_WORKOUT_VIEW, ConfigWorkoutsView } from "ui/view/ConfigWorkoutsView";
import {  WorkoutView, WORKOUT_VIEW } from "ui/view/WorkoutView";
import { ConfigController } from "controller/ConfigController";
import { DBService } from "services/core/DBService";
import { SettingsController } from "controller/SettingsController";

export default class WorkoutPlugin extends Plugin {
	private db: DBService;
	private workoutController: WorkoutController;
	private configController: ConfigController;
	settingsController: SettingsController;


	private configView: ConfigWorkoutsView;
	private statsView: WorkoutView;

	// @ts-ignore
	private dirPath = this.app.vault.adapter.basePath;

	async onload() {
		this.settingsController = new SettingsController(this);
        await this.settingsController.loadSettings();

		// @ts-ignore
		const dirPath = app.vault.adapter.basePath;
		this.db = new DBService(dirPath);
		this.workoutController = new WorkoutController(this.app, this.settingsController.settings, this.db);
		this.configController = new ConfigController(this.settingsController.settings, this.db);

		// Add the settings tab to Obsidian's settings
		this.addSettingTab(new SettingsTab(this.app, this));

		// Note Deleted Event
		this.registerEvent(this.app.vault.on('delete', async (file) => {
			if (file instanceof TFile) {
				this.workoutController.removeWorkout(file.name);
			}
		}));

		this.addRibbonIcon('dumbbell', 'New Workout', () => {
			new WorkoutDropdownModal(this.app, this.workoutController).open();
		});

		// Register Config Workouts View
		this.registerView(
			CONFIG_WORKOUT_VIEW,
			(leaf: WorkspaceLeaf) => (this.configView = new ConfigWorkoutsView(leaf, this.configController))
		);

		// Register the ExempleView (aaaaaa view)
		this.registerView(
			WORKOUT_VIEW,
			(leaf: WorkspaceLeaf) => (this.statsView = new WorkoutView(leaf, this.workoutController, this.settingsController))
		);

		// Ensure layout is ready and check for existing leaves
		this.app.workspace.onLayoutReady(this.onLayoutReady.bind(this));

		// Handle file modification
		this.registerEvent(this.app.vault.on('modify', (file) => {
			const filenamePattern = /^\d{4}-\d{2}-\d{2} .+\.md$/;
			const gymDirectory = file.path.split('/')[0];
			if (file instanceof TFile && file.extension === 'md' && filenamePattern.test(file.name) && gymDirectory === this.settingsController.settings.notesDir) {
				this.workoutController.handleFileChange(file);
			}
		}));
	}

	onunload() {
		this.app.workspace.detachLeavesOfType(WORKOUT_VIEW); // Clean up WorkoutView
		this.app.workspace.detachLeavesOfType(CONFIG_WORKOUT_VIEW); // Clean up ConfigWorkoutsView
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
