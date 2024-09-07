import * as fs from 'fs';

export class BreakData {
	private dataPath: string
	workoutDaysCount: number
	breakDaysCount: number

	constructor(dataPath: string) {
		this.dataPath = dataPath;
		// init workouts
		this.convertDataToBreakData(this.dataPath);
	}

	saveCountData() {
		const dataToSave = {
			workoutDaysCount: this.workoutDaysCount,
			breakDaysCount: this.breakDaysCount,
		};

		const jsonString = JSON.stringify(dataToSave, null, 2);
		fs.writeFileSync(this.dataPath, jsonString, 'utf8');
	}


	private convertDataToBreakData(dataPath: string) {
		const rawData = fs.readFileSync(dataPath, 'utf8');
		const parsedData = JSON.parse(rawData);

		this.workoutDaysCount = parsedData.workoutDaysCount
		this.breakDaysCount = parsedData.breakDaysCount
	}
}
