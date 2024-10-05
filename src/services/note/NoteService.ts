import {App, Notice} from 'obsidian';
import {WorkoutService} from "../core/WorkoutService";
import {getTitleInfo} from "../../utils/AlgorithmUtils";
import {CheckBox} from "../../models/Checkbox";
import { Workout } from 'models/Workout';

export class NoteService {
	private app: App;
	private workoutService: WorkoutService;
	private notesDir: string;

	constructor(app: App, workoutService: WorkoutService, notesDir:string) {
		this.app = app;
		this.notesDir = notesDir;
		this.workoutService = workoutService;
	}

	async createWorkoutNote(workoutType:string){
		const workout = this.workoutService.createWorkout(workoutType)
		if(workout == null || workout == undefined){
			new Notice("Error: Workout could not be created")
			return
		}
		this.createNote(workout);
	}

	async createNote(workout: Workout){
		const workoutType = workout.workoutType;
		// Adds capital Letter
		const fancyWorkoutType = workoutType.charAt(0).toUpperCase() + workoutType.slice(1).toLowerCase();

		const mostPath = await this.getNotePath() + " " + fancyWorkoutType;
		let fullPath = mostPath + ".md";
		// Check if file already exists
		let existingFile = this.app.vault.getAbstractFileByPath(fullPath);
		let i = 2;

		while(existingFile){
			fullPath = mostPath + " " + i + ".md";
			existingFile = this.app.vault.getAbstractFileByPath(fullPath);
			i++;
		}

		try {
			// Create the note
			const file = await this.app.vault.create(fullPath, workout.toMarkdown());
			// console.log("Note created:", file.path);
		} catch (error) {
			console.error(`Failed to create note at path: ${fullPath}`, error);
		}
	}


	
	async deleteNote(filename: string) {
		const { workoutType, date, index } = getTitleInfo(filename);
		
		const dateParts = date.split('-').map(Number);
		const year = dateParts[0];
		const month = dateParts[1] - 1; // Months are zero-based in JavaScript Date
		const day = dateParts[2];
	
		this.renameNotes(workoutType, date, index);
		this.workoutService.deleteWorkout(workoutType, new Date(year, month, day), index);
	}
	

	async renameNotes(deletedWorkoutType:string, deletedDate:string, deletedIndex:number){

		const filesToChange = []
		const files = this.app.vault.getFiles();
		for (const file of files) {

			if(file.name.toLowerCase().contains(deletedDate + " " + deletedWorkoutType)){
				filesToChange.push(file)
			}
		}

		filesToChange.sort((a, b) => a.name.localeCompare(b.name));
		filesToChange.forEach(async file =>{		
			const filename = file.name;
			const filePath = file.path
			const lastSlashIndex = filePath.lastIndexOf('/');
			const directoryPath = filePath.substring(0, lastSlashIndex);
			const {workoutType, date, index} = getTitleInfo(filename)
			const fancyWorkoutType = workoutType.charAt(0).toUpperCase() + workoutType.slice(1).toLowerCase();
			let newFileName = date + " " + fancyWorkoutType;

			if( deletedIndex > index){
				newFileName = filename
			}else if(deletedIndex == 0 && index == 1){
				newFileName += ".md"
			}else{
				newFileName += " " + index + ".md"
			}
			await this.app.vault.rename(file, directoryPath + "/" + newFileName);
		})
	}



	

	private async getNotePath(): Promise<string> {
		const todayDateUTC = new Date();
		const todayDateString = todayDateUTC.toISOString().split('T')[0];
		const year = todayDateString.substring(0, 4);
		const yearDir = this.notesDir + "/" + year + "/";
		const latestWeek = this.getWeekNumber(todayDateUTC);
		const weekDir = yearDir + "Week " + (latestWeek + 1) + "/";
		await this.ensureDirectoryExists(weekDir);
		return weekDir + todayDateString;
	}


	private getWeekNumber(date: Date): number {
		const startOfYear = new Date(date.getFullYear(), 0, 1);
		// Calculate the number of days from the start of the year to the current date
		const daysDifference = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
		// Determine the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
		const dayOfWeek = (startOfYear.getDay() + 6) % 7; // Convert startOfYear's day of the week
		// Calculate the week number
		return Math.ceil((daysDifference + dayOfWeek + 1) / 7);
	}


	private async ensureDirectoryExists(directoryPath: string) {
		// Check if the directory already exists
		const existingFolder = this.app.vault.getAbstractFileByPath(directoryPath);
		if (!existingFolder) {
			// Create the directory if it does not exist
			try {
				await this.app.vault.createFolder(directoryPath);
			} catch (error) {
				if (!error.message.includes("Folder already exists")) {
					console.error("Error creating directory:", error);
				}
			}
		}
	}
	

	getCheckboxes(type: string, content: string): CheckBox[] {
		const checkboxRegex = new RegExp(`- \\[( |x)\\] \\*\\*${type}:\\*\\*.*<!-- id: (.+?) -->`, 'g');
		const checkboxes: CheckBox[] = [];
		let match;
	
		while ((match = checkboxRegex.exec(content)) !== null) {
			checkboxes.push(new CheckBox(match[2], match[1] === 'x'));
		}
	
		return checkboxes;
	}
	

	isAllChecked(checkboxes: CheckBox[]): boolean {
		return checkboxes.every(checkbox => checkbox.checked);
	}


	/*

	async createNote(workoutType:string){

		let workout;
		if(workoutType === "break"){
			const index = getRandomInt(0, POST_BREAK_WORKOUTS.length - 1)
			workout = POST_BREAK_WORKOUTS[index]
		// }else if(workoutType === "cardio") {
		// 	workout = this.workoutService.createCardioWorkout(workoutType)
		// }else{
		// 	workout = this.workoutService.createNewWorkout(workoutType)
		// }

		}else{
			new Notice("Good Job")
		}



		// Adds capital Letter
		const fancyWorkoutType = workoutType.charAt(0).toUpperCase() + workoutType.slice(1).toLowerCase();

		// Define the full path of the note
		const fullPath = await this.getNotePath() + " " + fancyWorkoutType + ".md";

		// Check if file already exists
		const existingFile = this.app.vault.getAbstractFileByPath(fullPath);
		if (existingFile) {
			// console.log("Note already exists");
			return 303;
		}

		try {
			// Create the note
			const file = await this.app.vault.create(fullPath, workout.toMarkdown());
			// console.log("Note created:", file.path);
			return 200
		} catch (error) {
			console.error(`Failed to create note at path: ${fullPath}`, error);
			return 404;
		}
			
	}



	*/

}
