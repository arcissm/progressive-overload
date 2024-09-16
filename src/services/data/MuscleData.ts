import {Exercise} from "../../models/Exercise";
import * as fs from 'fs';
import {Muscle} from "../../models/Muscle";
import { MUSCLE_DATA_PATH } from "utils/Constants";

export class MuscleData {
	private dataPath: string
	private muscles: Array<Muscle> = [];

	constructor(dirPath: string) {
		this.dataPath = dirPath + MUSCLE_DATA_PATH;
		this.convertDataToMuscles(this.dataPath);
	}

	getMuscles(){
		return this.muscles
	}
	
	getMuscleByName(muscleName: string) {
		return this.muscles.find(muscle => muscle.name === muscleName) || null;
	}

	saveMuscles(){
		const updatedData = JSON.stringify( this.muscles, null, 2);
		fs.writeFileSync( this.dataPath, updatedData, 'utf8');
	}


	private convertDataToMuscles(dataPath: string) {
		// Read and parse the JSON file
		const rawData = fs.readFileSync(dataPath, 'utf8');
		const parsedData = JSON.parse(rawData);

		// Process each exercise from the parsed data
		parsedData.forEach((rawMuscle: any) => {

			const muscle = new Muscle(rawMuscle.name, rawMuscle.minSets, rawMuscle.maxSets, rawMuscle.boosted)
			this.muscles.push(muscle)
		});
	}
}
