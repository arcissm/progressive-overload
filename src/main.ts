import {Notice, Plugin, TFile, WorkspaceLeaf} from "obsidian";
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
			(leaf) => new WorkoutView(leaf, this)
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

	private async activateView() {
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




	getWorkoutByDate(date:string){
		return this.workoutService.getWorkoutsByDate(date);
	}


	async removeWorkout(noteName: string) {
		this.breakService.revertBreakData()
		await this.noteService.deleteNote(noteName);
		await this.updateCalendarView(); // Update the calendar view
		// await this.updateChecklistView(); // Update the checklist view if necessary
		// await this.updateStatsView(); // Update the stats view if necessary
	}


	async createNote(workoutType:string){
		const code = await this.noteService.createNote(workoutType)
		if(code == 200){
			this.breakService.updateBreakData();
			await this.updateCalendarView(); // Update the calendar view
			// await this.updateChecklistView(); // Update the checklist view if necessary
			// await this.updateStatsView(); // Update the stats view if necessary
		}
	}

	async openNote(date: string) {
		const files = this.app.vault.getMarkdownFiles();
		const fileNamePattern = `${date} `; // e.g., "2024-09-03 "

		const matchingFile = files.find(file => file.basename.startsWith(fileNamePattern));

		if (matchingFile) {
			await this.app.workspace.openLinkText(matchingFile.path, matchingFile.path);
		} else {
			new Notice("No file found for this date.");
		}
	}

	isOnBreak(){
		return this.breakService.isOnBreak();
	}

	async handleFileChange(file: TFile) {
		const content = await this.app.vault.read(file);
	
		await this.handleCompletedCheckboxes(content);
		await this.handleSuccessCheckboxes(content);

	}
	

	// Handle completed checkboxes
	async handleCompletedCheckboxes(content: string) {
		const completedCheckboxes = this.noteService.getCheckboxes("Completed", content);
		let allCompleted = true;

		completedCheckboxes.forEach(checkbox => {
			const exerciseId = checkbox.id.replace(/^completed_/, "");

			if (!checkbox.checked) {
				allCompleted = false; // Mark as incomplete if any completed checkbox is unchecked
			}
		});

		if (allCompleted) {
			this.workoutService.updateWorkoutComplete(file.name);
			await this.updateCalendarView(); // Update the calendar view
			// await this.updateChecklistView(); // Optionally update other views
			// await this.updateStatsView();    // Optionally update stats
		}
	}

	// Handle success checkboxes
	async handleSuccessCheckboxes(content: string) {
		const successCheckboxes = this.noteService.getCheckboxes("Success", content);

		successCheckboxes.forEach(checkbox => {
			const exerciseId = checkbox.id.replace(/^success_/, "");

			if (checkbox.checked) {
				this.workoutService.updateExerciseSuccess(exerciseId);
			}
		});
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

	private async updateCalendarView() {
		const view = this.getActiveWorkoutView();
		if (view) {
			view.updateCalendar();
		}
	}

	private async updateChecklistView() {
		const view = this.getActiveWorkoutView();
		if (view) {
			view.updateChecklist();
		}
	}

	private async updateStatsView() {
		const view = this.getActiveWorkoutView();
		if (view) {
			view.updateStats();
		}
	}

	private getActiveWorkoutView(): WorkoutView | null {
		const leaves = this.app.workspace.getLeavesOfType(WORKOUT_VIEW);
		return leaves.length > 0 ? (leaves[0].view as WorkoutView) : null;
	}

}

