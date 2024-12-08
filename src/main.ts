import { Plugin, TFile, WorkspaceLeaf } from "obsidian"; 
import { SettingsTab } from "./ui/settings/SettingsTab";
import { WorkoutDropdownModal } from "./ui/ribbon/WorkoutDropdownModal";
import { WorkoutController } from "controller/WorkoutController";
import { CONFIG_WORKOUT_VIEW, ConfigWorkoutsView } from "ui/view/ConfigWorkoutsView";
import { WorkoutView, WORKOUT_VIEW } from "ui/view/WorkoutView";
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

		// Register events, ribbons, and views
		this.registerPluginEvents();
		this.registerRibbonIcons();
		this.registerViews();

		// Ensure layout is ready and check for existing leaves
		this.app.workspace.onLayoutReady(this.onLayoutReady.bind(this));
	}

	onunload() {
		this.app.workspace.detachLeavesOfType(WORKOUT_VIEW);        // Clean up WorkoutView
		this.app.workspace.detachLeavesOfType(CONFIG_WORKOUT_VIEW); // Clean up ConfigWorkoutsView
	}

	// Separate function to register plugin events
	private registerPluginEvents(): void {
		this.registerEvent(
			this.app.vault.on('delete', async (file) => {
				if (file instanceof TFile) {
					this.workoutController.removeWorkout(file.name);
				}
			})
		);

		this.registerEvent(
			this.app.vault.on('modify', (file) => {
				const filenamePattern = /^\d{4}-\d{2}-\d{2} .+\.md$/;
				const gymDirectory = file.path.split('/')[0];
				if (
					file instanceof TFile &&
					file.extension === 'md' &&
					filenamePattern.test(file.name) &&
					gymDirectory === this.settingsController.settings.notesDir
				) {
					this.workoutController.handleFileChange(file);
				}
			})
		);
	}

	// Separate function to register ribbon icons
	private registerRibbonIcons(): void {
		// Existing ribbon to create a new workout
		this.addRibbonIcon('dumbbell', 'New Workout', () => {
			new WorkoutDropdownModal(this.app, this.workoutController).open();
		});

		// New ribbon to reopen both views if closed
		this.addRibbonIcon('swords', 'Reopen Workout Calendar + Settings', () => {
			this.openViews();
		});
	}

	// Separate function to register custom views
	private registerViews(): void {
		this.registerView(
			CONFIG_WORKOUT_VIEW,
			(leaf: WorkspaceLeaf) => (this.configView = new ConfigWorkoutsView(leaf, this.configController, this.settingsController))
		);

		this.registerView(
			WORKOUT_VIEW,
			(leaf: WorkspaceLeaf) => (this.statsView = new WorkoutView(leaf, this.workoutController, this.settingsController))
		);
	}

	// Method to open the views if they are not open
	private openViews(): void {
		// Load Workout View if not already open
		if (this.app.workspace.getLeavesOfType(WORKOUT_VIEW).length === 0) {
			this.app.workspace.getRightLeaf(false)?.setViewState({
				type: WORKOUT_VIEW,
			});
		}

		// Load Config Workouts View if not already open
		if (this.app.workspace.getLeavesOfType(CONFIG_WORKOUT_VIEW).length === 0) {
			this.app.workspace.getRightLeaf(false)?.setViewState({
				type: CONFIG_WORKOUT_VIEW,
			});
		}
	}

	// Ensure the layout is ready and avoid spawning multiple views
	onLayoutReady(): void {
		this.openViews();
	}
}
