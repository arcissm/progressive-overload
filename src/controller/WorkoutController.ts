import { Workout } from "models/Workout";
import { App, Notice, TFile } from "obsidian";
import { BreakService } from "services/break/BreakService";
import { DBService } from "services/core/DBService";
import { WorkoutService } from "services/core/WorkoutService";
import { NoteService } from "services/note/NoteService";
import { PluginSettings } from "services/settings/Settings";
import { getTitleInfo, newDate } from "utils/AlgorithmUtils";
import { SettingsController } from "./SettingsController";



export class WorkoutController {

    private app: App;
    private db: DBService;
	private noteService: NoteService;
	private workoutService: WorkoutService;
	private breakService: BreakService;
	private subscribers: Function[] = [];



	
	constructor(app: App, settings: SettingsController, db:DBService ) {
		this.app = app;
        this.db = db;

        this.workoutService = new WorkoutService(this.db, settings);
		this.noteService = new NoteService(this.app, this.workoutService, settings)
		this.breakService = new BreakService(this.db, settings);
	}

	unsubscribe(callback: Function) {
        this.subscribers = this.subscribers.filter(sub => sub !== callback);
    }
	
    subscribe(callback: Function) {
        this.subscribers.push(callback);
    }

    notifySubscribers() {
        this.subscribers.forEach(callback => callback());
    }

	getWorkouts(){
		return this.db.getWorkouts()
	}

	getWorkoutsByDate(date: Date){
		return this.db.getWorkoutsByDate(date)
	}
	
	// WORKOUT TYPE
    getNormalWorkoutTypes(){
        return this.db.getNormalWorkoutTypes();
    }

    isOnBreak() {
        return this.breakService.isOnBreak();
    }

	// Workout
    async createWorkout(workoutType:string) {
        if (this.breakService.isOnBreak()){
            this.noteService.createNote(this.breakService.getRandomBreakWorkout());
        }else{
            this.noteService.createWorkoutNote(workoutType);
        }

		this.notifySubscribers();
    }

    async removeWorkout(filename: string) {
		await this.noteService.deleteNote(filename);
		this.notifySubscribers();
    }



	private async workoutIsSuccessful(workout: Workout){

		this.workoutService.succeedWorkout(workout);
		this.notifySubscribers(); 
	}


	private async workoutIsCompleted(workout: Workout){

		this.workoutService.completeWorkout(workout);
		this.notifySubscribers();
	}


	// File
	async openNote(date: Date) {
		const formattedDate = date.toISOString().split('T')[0];
		const files = this.app.vault.getMarkdownFiles();
		const matchingFile = files.find(file => file.basename.startsWith(`${formattedDate} `));
	
		if (matchingFile) {
			await this.app.workspace.openLinkText(matchingFile.path, matchingFile.path);
		} else {
			new Notice("No file found for this date.");
		}
	}

	
	async handleFileChange(file: TFile) {
		const content = await this.app.vault.read(file);
	
		await this.checkboxCompletedIsChecked(file);
		await this.checkboxSuccessIsChecked(file);

	}

	async checkboxSuccessIsChecked(file: TFile) {
		const content = await this.app.vault.read(file);
		const {workoutType, date, index} = getTitleInfo(file.name)
		const workout = this.workoutService.getWorkoutFromNote(workoutType, newDate(date), index)
		const successCheckboxes = this.noteService.getCheckboxes("Success", content);
		let allSuccess = true;

		successCheckboxes.forEach(checkbox => {
			if (checkbox.checked) {
				const exerciseId = checkbox.id.replace(/^success_/, "");
				this.workoutService.succeedExercise(workout, exerciseId);
			}else{
				allSuccess = false
			}
		});

		if(allSuccess && workout != null){
			this.workoutIsSuccessful(workout)
		}
	}


	async checkboxCompletedIsChecked(file: TFile) {
		const content = await this.app.vault.read(file);
		const {workoutType, date, index} = getTitleInfo(file.name)
		const workout = this.workoutService.getWorkoutFromNote(workoutType, newDate(date), index)
		const completedCheckboxes = this.noteService.getCheckboxes("Completed", content);
		let allCompleted = true;

		completedCheckboxes.forEach(checkbox => {
			if(checkbox.checked){
				const exerciseId = checkbox.id.replace(/^completed_/, "");
				this.workoutService.completeExercise(workout, exerciseId)

			}else {
				allCompleted = false;
			}
		});

		if(allCompleted && workout != null){
			this.workoutIsCompleted(workout)
		}
	}

	


}