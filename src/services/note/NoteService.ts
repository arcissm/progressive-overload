import {App} from 'obsidian';
import {WorkoutService} from "./WorkoutService";

export class NoteService {
	private app: App;
	private workoutService: WorkoutService;
	private notesDir: string;

	constructor(app: App, workoutService: WorkoutService, notesDir:string) {
		this.app = app;
		this.notesDir = notesDir;
		this.workoutService = workoutService;
	}


	async deleteNote(filename: string){
		// Extract the date (before the space)
		const date = filename.split(' ')[0];
		// Extract the workout type (after the space, removing the .md extension)
		const workoutType = filename.split(' ')[1].replace('.md', '').toLowerCase();
		this.workoutService.deleteWorkout(workoutType, date);
	}

	async createNote(workoutType:string){

		const workout = this.workoutService.createNewWorkout(workoutType)

		// Adds capital Letter
		const fancyWorkoutType = workoutType.charAt(0).toUpperCase() + workoutType.slice(1).toLowerCase();

		// Define the full path of the note
		const fullPath = await this.getNotePath() + " " + fancyWorkoutType + ".md";

		// Check if file already exists
		const existingFile = this.app.vault.getAbstractFileByPath(fullPath);
		if (existingFile) {
			// console.log("Note already exists");
			return;
		}

		try {
			// Create the note
			const file = await this.app.vault.create(fullPath, workout.toMarkdown());
			// console.log("Note created:", file.path);
		} catch (error) {
			// console.error(`Failed to create note at path: ${fullPath}`, error);
			return null;
		}
	}

	private async ensureDirectoryExists(directoryPath: string) {
		// Check if the directory already exists
		const existingFolder = this.app.vault.getAbstractFileByPath(directoryPath);

		if (!existingFolder) {
			// Create the directory if it does not exist
			try {
				await this.app.vault.createFolder(directoryPath);
			} catch (error) {
				// Handle specific error cases, like the folder already existing
				// if (error.message.includes("Folder already exists")) {
				// 	console.debug("Directory already exists:", directoryPath);
				// } else {
				// 	console.error("Error creating directory:", error);
				// }
			}
		}
	}

	// Function to get the week number for the current date
	private getWeekNumber(date: Date): number {
		// Start of the year
		const startOfYear = new Date(date.getFullYear(), 0, 1);

		// Calculate the number of days from the start of the year to the current date
		const daysDifference = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));

		// Determine the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
		const dayOfWeek = (date.getDay() + 6) % 7; // Monday = 0, Sunday = 6

		// Calculate the week number
		return Math.ceil((daysDifference + dayOfWeek + 1) / 7);
	}


	private async getNotePath(): Promise<string> {
		const today = new Date();
		const year = today.getFullYear();
		const yearDir = this.notesDir + "/" + year + "/";
		const latestWeek = this.getWeekNumber(today);
		const weekDir = yearDir + "Week " + (latestWeek + 1) + "/";
		await this.ensureDirectoryExists(weekDir);
		return weekDir + today.toISOString().split('T')[0];
	}

}
