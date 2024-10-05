import { ExerciseConfig } from "models/configs/ExerciseConfig";
import { Exercise } from "models/Exercise";
import { Muscle } from "models/Muscle";
import { Workout } from "models/Workout";
import { App, Notice, TFile } from "obsidian";
import { BreakService } from "services/break/BreakService";
import { DBService } from "services/core/DBService";
import { WorkoutService } from "services/core/WorkoutService";
import { NoteService } from "services/note/NoteService";
import { PluginSettings } from "services/settings/Settings";
import { WORKOUT_VIEW, WorkoutView } from "ui/view/WorkoutView";
import { getTitleInfo } from "utils/AlgorithmUtils";
import { TreeNode } from "utils/data-structure/TreeNode";



export class WorkoutController {

    private app: App;
    private db: DBService;
	private noteService: NoteService;
	private workoutService: WorkoutService;
	private breakService: BreakService;

	constructor(app: App, settings: PluginSettings ) {
		this.app = app;

        // @ts-ignore
        const dirPath = app.vault.adapter.basePath;
        this.db = new DBService(dirPath);

        this.workoutService = new WorkoutService(this.db);
		this.noteService = new NoteService(this.app, this.workoutService, settings.notesDir)
		this.breakService = new BreakService(this.db);
	}


	// Workout
    async createWorkout(workoutType:string) {
        // check if should be on break
        if (this.breakService.isOnBreak()){
            this.noteService.createNote(this.breakService.getRandomBreakWorkout());
        }else{
            this.noteService.createWorkoutNote(workoutType);
        }

		this.updateCalendarView()
        // await this.updateCalendarView(); // Update the calendar view
        // await this.updateChecklistView(); // Update the checklist view if necessary
        // await this.updateStatsView(); // Update the stats view if necessary
    }

    async removeWorkout(filename: string) {
		await this.noteService.deleteNote(filename);
		this.updateCalendarView()

		// await this.updateCalendarView(); // Update the calendar view
		// await this.updateChecklistView(); // Update the checklist view if necessary
		// await this.updateStatsView(); // Update the stats view if necessary
    }

	getWorkouts(){
		return this.db.getWorkouts()
	}

	getWorkoutsByDate(date: Date){
		return this.db.getWorkoutsByDate(date)
	}

    isOnBreak() {
        return this.breakService.isOnBreak();
    }

	private async workoutIsSuccessful(workout: Workout){

		this.workoutService.succeedWorkout(workout);
		this.updateCalendarView()

		// await this.updateCalendarView(); // Update the calendar view
		// await this.updateChecklistView(); // Optionally update other views
		// await this.updateStatsView();    // Optionally update stats
		
	}


	private async workoutIsCompleted(workout: Workout){

		this.workoutService.completeWorkout(workout);
		this.updateCalendarView(); // Update the calendar view
		// await this.updateChecklistView(); // Optionally update other views
		// await this.updateStatsView();    // Optionally update stats
		
	}


	// File
	async openNote(date: Date) {
		const formattedDate = date.toISOString().split('T')[0]; // Example: '2024-09-03'
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
		const workout = this.workoutService.getWorkoutFromNote(workoutType,new Date(date), index)
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
		const workout = this.workoutService.getWorkoutFromNote(workoutType,new Date(date), index)
		const completedCheckboxes = this.noteService.getCheckboxes("Completed", content);
		let allCompleted = true;

		completedCheckboxes.forEach(checkbox => {
			if(checkbox.checked){
				const exerciseId = checkbox.id.replace(/^completed_/, "");
				this.workoutService.completeExercise(workout, exerciseId)

			}else {
				allCompleted = false; // Mark as incomplete if any completed checkbox is unchecked
			}
		});

		if(allCompleted && workout != null){
			this.workoutIsCompleted(workout)
		}
	}

	

	// MUSCLES
	addMuscle(muscle: Muscle){
		this.db.addMuscle(muscle)
	}

	getMuscles(){
		return this.db.getMuscles();
	}
	getMusclesForWorkoutType(workoutType:string){
		return this.db.getMusclesForWorkoutType(workoutType)
	}

	updateMuscle(oldMuscle: Muscle, newMuscle:Muscle){
		this.db.updateMuscle(oldMuscle, newMuscle)
	}

	deleteMuscle(muscle:Muscle){
		this.db.deleteMuscle(muscle)
	}



	// EXERCISES
	getExercises(){
		return this.db.getExercises();
	}

	getExerciseConfigs(){
		return this.db.getExerciseConfigs();
	}
	
	getMuscleExerciseMap(){
		return this.db.getMuscleExerciseMap();
	}

	saveExerciseConfigs(oldConfig:ExerciseConfig, newConfig:ExerciseConfig) {
		return this.db.saveExerciseConfigs(oldConfig, newConfig);
	}

	deleteExerciseConfig(id:string){
		return this.db.deleteExerciseConfig(id)
	}

	addExerciseConfig(newExercise: Exercise){
		return this.db.addExerciseConfig(newExercise)
	}





	getVariations(){
		return this.db.getVariations()
	}

	getVariationForExercise(exerciseName: string){
		return this.db.getVariationForExercise(exerciseName);
	}

	setVariationForExercise(exerciseName: string, data: string) {
		this.db.setVariationForExercise(exerciseName, data)
	}

	updateExerciseForVariation(oldExerciseName: string, newExerciseName: string){
		return this.db.updateExerciseForVariation(oldExerciseName, newExerciseName)

	}

	addNode(exerciseName: string, node: TreeNode<string>){
		return this.db.addNode(exerciseName, node)
	}
	removeNode(exerciseName: string, node: TreeNode<string>){
		return this.db.removeNode(exerciseName, node)
	}

	updateVariationName(exerciseName: string, oldValue: string, newValue: string) {
		return this.db.updateVariationName(exerciseName, oldValue, newValue)
	}
	addTree(){
		return this.db.addTree()
	}

	deleteTree(root: string){
		return this.db.deleteTree(root)
	}

	// WORKOUT TYPE
    getNormalWorkoutTypes(){
        return this.db.getNormalWorkoutTypes();
    }

    getWorkoutTypes(){
        return this.db.getWorkoutTypes();
    }

	getWorkoutTypeMuscleArray() {
		return this.db.getWorkoutTypeMuscleArray();
	}

	updateWorkoutTypeMuscleMap(workoutMuscleArray:  [string, string[]][]){
		this.db.updateWorkoutTypeMuscleMap(workoutMuscleArray)
	}

	addWorkoutType(){
		this.db.addWorkoutType();
	}

	removeWorkoutType(workoutType: string){
		this.db.removeWorkoutType(workoutType)
	}
 
	
	private getActiveWorkoutView(): WorkoutView | null {
		const leaves = this.app.workspace.getLeavesOfType(WORKOUT_VIEW);
		return leaves.length > 0 ? (leaves[0].view as WorkoutView) : null;
	}
	
	private async updateCalendarView() {
		const view = this.getActiveWorkoutView();
		if (view) {
		view.updateCalendar(); // Calls React's updateCalendar to force re-render
		}
	}
	  
	/*

	async handleWorkoutNoteChange(file: TFile) {
        const content = await this.app.vault.read(file);
	
		await this.handleCompletedCheckboxes(content);
		await this.handleSuccessCheckboxes(content);
    }



	// Handle success checkboxes

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

	

    */
}