import {Plugin, TFile, WorkspaceLeaf} from "obsidian";
import { SettingsTab } from "./ui/settings/SettingsTab";
import { PluginSettings, DEFAULT_SETTINGS } from "./services/settings/Settings";
import {WorkoutData} from "./services/data/WorkoutData";
import {WorkoutDropdownModal} from "./ui/ribbon/WorkoutDropdownModal";
import {NoteService} from "./services/note/NoteService";
import {BREAK_DATA_PATH, EXERCISE_DATA_PATH, IMAGES_DIR, WORKOUT_DATA_PATH} from "./utils/Constants";
import {WorkoutService} from "./services/core/WorkoutService";
import {ExerciseData} from "./services/data/ExerciseData";
import {BreakData} from "./services/data/BreakData";
import {BreakService} from "./services/note/BreakService";
import {WORKOUT_VIEW, WorkoutView} from "./ui/view/WorkoutView";

export default class WorkoutPlugin extends Plugin {
	public settings: PluginSettings;
	private workoutData: WorkoutData;
	private exerciseData: ExerciseData;
	private breakData: BreakData;
	private noteService: NoteService;
	private workoutService: WorkoutService;
	private breakService: BreakService;


	// @ts-ignore
	private dirPath = this.app.vault.adapter.basePath;

	async onload() {
		await this.loadSettings();


		// Add the settings tab to Obsidian's settings
		this.addSettingTab(new SettingsTab(this.app, this));

		this.workoutData = new WorkoutData(this.dirPath + WORKOUT_DATA_PATH, this.dirPath + IMAGES_DIR);
		this.exerciseData = new ExerciseData(this.dirPath + EXERCISE_DATA_PATH)
		this.breakData = new BreakData(this.dirPath + BREAK_DATA_PATH);
		this.workoutService = new WorkoutService(this.workoutData, this.exerciseData);
		this.noteService = new NoteService(this.app,this.workoutService, this.settings.notesDir)
		this.breakService = new BreakService(this.breakData, this.workoutData);

		// console.log(this.exerciseData.getAllExercises())
			// Note Events
			// Create Note button
		this.addRibbonIcon('dice', 'Pick One', () => {
			new WorkoutDropdownModal(this.app, this).open();
		});

		this.registerView(
			WORKOUT_VIEW,
			(leaf) => new WorkoutView(leaf)
		);

		this.addRibbonIcon('heart', 'info', () => {
			this.activateView();
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


	}

	onunload() {
		this.app.workspace.detachLeavesOfType(WORKOUT_VIEW);
	}

	async activateView() {
		const { workspace } = this.app;

		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType(WORKOUT_VIEW);

		if (leaves.length > 0) {
			// A leaf with our view already exists, use that
			leaf = leaves[0];
		} else {
			// Our view could not be found in the workspace, create a new leaf
			// in the right sidebar for it
			leaf = workspace.getRightLeaf(false);
			await leaf.setViewState({ type: WORKOUT_VIEW, active: true });
		}

		// "Reveal" the leaf in case it is in a collapsed sidebar
		workspace.revealLeaf(leaf);
	}







	async removeWorkout(noteName: string) {
		this.breakService.revertBreakData()
		await this.noteService.deleteNote(noteName);
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
		const code = await this.noteService.createNote(workoutType)
		if(code == 200){
			this.breakService.updateBreakData();

		}
	}

	isOnBreak(){
		return this.breakService.isOnBreak();
	}


	handleFileChange(file: TFile) {
		this.app.vault.read(file).then(content => {
			const checkboxes = this.noteService.getAllCheckboxes(content);
			let allCompleted = true;

			checkboxes.forEach(checkbox => {
				const exerciseId = checkbox.id.replace(/^(completed_|success_)/, "");

				if (checkbox.id.startsWith("success_")) {
					if (checkbox.checked) {
						this.workoutService.updateExerciseSuccess(exerciseId);
					}
				} else if (checkbox.id.startsWith("completed_")) {
					if (!checkbox.checked) {
						allCompleted = false; // Mark the workout as incomplete if any completed checkbox is unchecked
					}
				}
			});

			// If all success checkboxes are checked, mark the workout as complete
			if (allCompleted) {
				this.workoutService.updateWorkoutComplete(file.name);
			}
		});
	}


	// handleFileChange(file: TFile) {
	// 	this.app.vault.read(file).then(content => {
	// 		const checkboxes = this.noteService.getAllCheckboxes(content);
	//
	// 		if (this.noteService.isAllChecked(checkboxes)) {
	// 			this.workoutService.updateWorkoutComplete(file.name);
	// 		}
	//
	// 		checkboxes.forEach(checkbox => {
	// 			if (checkbox.checked) {
	// 				this.workoutService.updateExerciseSuccess(checkbox.id);
	// 			}
	// 		});
	// 	});
	// }



}

