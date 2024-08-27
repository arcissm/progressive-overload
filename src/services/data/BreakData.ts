import * as fs from 'fs';

export class BreakData {
	private dataPath: string
	workoutDaysCount: number
	breakDaysCount: number

	constructor(dataPath: string) {
		this.dataPath = dataPath;
		// init workouts
		this.setCountData(this.dataPath);
	}

	saveCountData() {
		// Create an object with the current state
		const dataToSave = {
			workoutDaysCount: this.workoutDaysCount,
			breakDaysCount: this.breakDaysCount,
		};

		// Convert the object to a JSON string
		const jsonString = JSON.stringify(dataToSave, null, 2);

		// Write the JSON string back to the file
		fs.writeFileSync(this.dataPath, jsonString, 'utf8');
	}


	private setCountData(dataPath: string) {
		// Read and parse the JSON file
		const rawData = fs.readFileSync(dataPath, 'utf8');
		const parsedData = JSON.parse(rawData);

		this.workoutDaysCount = parsedData.workoutDaysCount
		this.breakDaysCount = parsedData.breakDaysCount
	}
}
