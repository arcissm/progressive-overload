import {App, Notice, TFile, TFolder} from 'obsidian';
import {WorkoutService} from "../core/WorkoutService";
import {chooseRandomIndex, getTitleInfo, getTodayLocalDate, newDate} from "../../utils/AlgorithmUtils";
import {CheckBox} from "../../models/Checkbox";
import { Workout } from 'models/Workout';

export class NoteService {
	private app: App;
	private workoutService: WorkoutService;
	private notesDir: string;
	private imagesDir: string;

	constructor(app: App, workoutService: WorkoutService, notesDir:string, imagesDir:string) {
		this.app = app;
		this.notesDir = notesDir;
		this.imagesDir = imagesDir;
		this.workoutService = workoutService;

		this.ensureDirectoryExists(this.imagesDir)
	}

	async createWorkoutNote(workoutType:string){
		const workout = this.workoutService.createWorkout(workoutType)
		if(workout == null || workout == undefined){
			new Notice("Error: Workout could not be created")
			return
		}
		this.addMotivation(workout)
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

	async addMotivation(workout: Workout){
		const note = await this.createMotivationalNote()
		workout.note = note
	}

	async createMotivationalNote(): Promise<string> {
		const imagePath = await this.getMotivationalImage();
	
		if (!imagePath) {
			console.error("No motivational image found.");
			return "";
		}
	
		// Extract the image file name from the path (since Obsidian uses just the file name)
		const fileName = imagePath.split("/").pop() || "";
	
		let message = "";
	
		if (fileName.startsWith("bad_")) {
			message = "<div class=\"motivationalSpeech\">\n" +
				"Do you want to look like that forever?" +
				"</div>";
		} else if (fileName.startsWith("good_")) {
			message = "<div class=\"motivationalSpeech\">\n" +
				"You can look like this too." +
				"</div>";
		}
	
		// Use Obsidian's internal file embedding syntax
		return `![[${fileName}]]\n\n${message}\n`;
	}
	
	

	async getMotivationalImage(): Promise<string> {
		try {
			const imageFolder = this.app.vault.getAbstractFileByPath(this.imagesDir);
	
			if (imageFolder && imageFolder instanceof TFolder) {
				const files = imageFolder.children.filter(
					file => file instanceof TFile && /\.(jpg|jpeg|png|gif)$/i.test(file.name)
				);
	
				if (files.length === 0) {
					console.warn("No images found in the directory.");
					return "";
				}
	
				// Use the custom random index function
				const randomIndex = chooseRandomIndex(files.length);
				const randomImage = files[randomIndex] as TFile;
	
				return randomImage.path;
			} else {
				console.error("Image directory does not exist or is not a folder.");
				return "";
			}
		} catch (err) {
			console.error("Error reading the image folder:", err);
			return "";
		}
	}
	

	
	async deleteNote(filename: string) {
		const { workoutType, date, index } = getTitleInfo(filename);
		this.renameNotes(workoutType, date, index);
		this.workoutService.deleteWorkout(workoutType, newDate(date), index);
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
		const todayDateUTC = getTodayLocalDate();
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
		const dayOfWeek = startOfYear.getDay(); // 0 for Sunday
		const adjustedDayOfWeek = (dayOfWeek === 0 ? 0 : 7 - dayOfWeek); // Adjust so Sunday is the start
	
		// Calculate the week number
		return Math.ceil((daysDifference + adjustedDayOfWeek + 1) / 7);
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
}
