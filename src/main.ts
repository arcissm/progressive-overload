import { Plugin, TFile, WorkspaceLeaf} from "obsidian";
import { SettingsTab } from "./ui/settings/SettingsTab";
import { PluginSettings, DEFAULT_SETTINGS } from "./services/settings/Settings";
import {WorkoutDropdownModal} from "./ui/ribbon/WorkoutDropdownModal";
import {WORKOUT_VIEW, WorkoutView} from "./ui/view/WorkoutView";
import { WorkoutController } from "controller/WorkoutController";
import { setEngine } from "crypto";
import { CONFIG_WORKOUT_VIEW, ConfigWorkoutsView } from "ui/view/ConfigWorkoutsView";

export default class WorkoutPlugin extends Plugin {
	private settings: PluginSettings;
	private controller: WorkoutController;
	private testView: ConfigWorkoutsView

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

		this.registerView(
			CONFIG_WORKOUT_VIEW,
			(leaf: WorkspaceLeaf) => (this.testView = new ConfigWorkoutsView(leaf, this.controller))
		  );
	  
		  this.app.workspace.onLayoutReady(this.onLayoutReady.bind(this));


		this.registerEvent(this.app.vault.on('modify', (file) => {
			const filenamePattern = /^\d{4}-\d{2}-\d{2} .+\.md$/;
			const gymDirectory = file.path.split('/')[0];
			if (file instanceof TFile && file.extension === 'md' && filenamePattern.test(file.name) && gymDirectory === this.settings.notesDir) {
				console.log(file.name)
				// TODO: CHANGE TO ONLY FILE OF TODAY
				// but after cuz it would be a bitch to debug
				this.controller.handleFileChange(file);
			}
		}));
		/*
		this.registerView(
			WORKOUT_VIEW,
			(leaf) => new WorkoutView(leaf, this)
		);

		this.addRibbonIcon('heart', 'info', () => {
			this.activateView();
		});




		*/


	}
	onunload() {
		this.app.workspace.detachLeavesOfType(WORKOUT_VIEW);
	}


	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		if (this.settings.notesDir === ""){
			await this.saveData(DEFAULT_SETTINGS);
		}else{
			await this.saveData(this.settings);
		}
	}


	onLayoutReady(): void {
		if (this.app.workspace.getLeavesOfType(CONFIG_WORKOUT_VIEW).length) {
		  return;
		}
		this.app.workspace.getRightLeaf(false)?.setViewState({
		  type: CONFIG_WORKOUT_VIEW,
		});
	  }


}

