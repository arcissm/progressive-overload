import {Notice, Plugin, TFile} from "obsidian";
import { SettingsTab } from "./ui/settings/SettingsTab"; // Import the settings tab
import { PluginSettings, DEFAULT_SETTINGS } from "./services/settings/Settings";
import {WorkoutData} from "./services/data/WorkoutData";
import {WorkoutDropdownModal} from "./ui/ribbon/WorkoutDropdownModal";
import {NoteService} from "./services/note/NoteService";
import {DATA_PATH} from "./utils/Constants";
import {Exercise} from "./models/Exercise";
import {Workout} from "./models/Workout";
import {WorkoutService} from "./services/note/WorkoutService";

export default class WorkoutPlugin extends Plugin {
	public settings: PluginSettings;
	private workoutData: WorkoutData;
	private noteService: NoteService;
	private workoutService: WorkoutService;

	// @ts-ignore
	private dirPath = this.app.vault.adapter.basePath;

		async onload() {
		await this.loadSettings();


		// Add the settings tab to Obsidian's settings
		this.addSettingTab(new SettingsTab(this.app, this));

		this.workoutData = new WorkoutData(this.dirPath + DATA_PATH);
		this.workoutService = new WorkoutService(this.workoutData);
		this.noteService = new NoteService(this.app,this.workoutService, this.settings.notesDir)


			// Note Events
			// Create Note button
		this.addRibbonIcon('dice', 'Pick One', () => {
			new WorkoutDropdownModal(this.app, this).open();
		});

			// Note Modified Event
		this.registerEvent(this.app.vault.on('modify', (file) => {
			if (file instanceof TFile && file.extension === 'md') {
				this.handleFileChange(file);
			}
		}));

			// Note Deleted Event
		this.registerEvent(this.app.vault.on('delete', (file) => {
			if (file instanceof TFile) {
				this.removeWorkout(file.name);
			}
		}));

		//
		// // Create new exercises
		// const newExercises: Exercise[] = [
		// 	new Exercise("abc", 3, 8, "8-66", ),
		// ];
		// // Create a new workout
		// const newWorkout = new Workout("fff", "2024-08-09", newExercises, "TEST session");
		//
		// console.log("ADDING")
		// this.workoutData.addWorkout(newWorkout)
		//
		// console.log("ALL")
		//
		// this.workoutData.getAllWorkouts().forEach(w=>
		// 	console.log(w)
		// )
		//
		// console.log("ARMS")
		// console.log(this.workoutData.getLastWorkoutOfType("zzz"));

	}

	handleFileChange(file: TFile) {
		this.app.vault.read(file).then(content => {
			// Implement your logic to check if the checkbox was checked/unchecked
			const isChecked = content.includes('- [x] Completed');
			console.log(isChecked ? 'Checkbox is checked' : 'Checkbox is unchecked');
		});
	}

	async removeWorkout(noteName: string) {
		this.noteService.deleteNote(noteName);
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

	async createNote(workoutType:string){
		await this.noteService.createNote(workoutType)

	}

	addCheckboxEventListeners() {
		// Select all checkboxes with the class 'custom-checkbox'
		const checkboxes = document.querySelectorAll('.custom-checkbox');

		checkboxes.forEach((checkbox) => {
			checkbox.addEventListener('change', (event: Event) => {
				const target = event.target as HTMLInputElement;
				new Notice(`Checkbox is now ${target.checked ? 'checked' : 'unchecked'}`);
			});
		});
	}

}
