import { Plugin} from "obsidian";
import { SettingsTab } from "./ui/settings/SettingsTab"; // Import the settings tab
import { PluginSettings, DEFAULT_SETTINGS } from "./services/settings/Settings";
import {WorkoutData} from "./services/data/WorkoutData";
import {DATA_PATH} from "./ui/constants/Constants";
import {Workout} from "./models/Workout";
import {Exercise} from "./models/Exercise";

export default class WorkoutPlugin extends Plugin {
	public settings: PluginSettings;
	public workoutData: WorkoutData

	async onload() {
		await this.loadSettings();

		// Add the settings tab to Obsidian's settings
		this.addSettingTab(new SettingsTab(this.app, this));


		// // Create new exercises
		// const newExercises: Exercise[] = [
		// 	new Exercise("abc", 3, 8, "8-66", ),
		// ];
		// // Create a new workout
		// const newWorkout = new Workout("arms", "2024-08-09", newExercises, "TEST session");

		// @ts-ignore
		this.workoutData = new WorkoutData(this.app.vault.adapter.basePath + DATA_PATH);

		// this.workoutData.addWorkout(newWorkout)

		console.log("ALL")

		this.workoutData.getAllWorkouts().forEach(w=>
			console.log(w)
		)

		console.log("ARMS")
		console.log(this.workoutData.getLastWorkoutOfType("arms"));
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		if (this.settings.notePath === ""){
			await this.saveData(DEFAULT_SETTINGS);
		}else{
			await this.saveData(this.settings);
		}
	}


}
