import * as fs from 'fs';
import {Muscle} from "../../models/Muscle";
import { MUSCLE_DATA_PATH } from "utils/Constants";
import { Exercise } from 'models/Exercise';

export class MuscleData {
	private dataPath: string
	private muscles: Array<Muscle> = [];

	constructor(dirPath: string) {
		this.dataPath = dirPath + MUSCLE_DATA_PATH;
		this.convertDataToMuscles(this.dataPath);
	}

	addMuscle(muscle: Muscle){
		this.muscles.push(muscle)
		this.saveMuscles()
	}

	getMuscles(){
		return this.muscles
	}
	
	getMuscleByName(muscleName: string) {
		return this.muscles.find(muscle => muscle.name === muscleName) || null;
	}

	updateMuscle(oldMuscle: Muscle, newMuscle: Muscle) {
		const index = this.muscles.findIndex(muscle => muscle.equals(oldMuscle));
		if (index !== -1) {
			this.muscles[index] = newMuscle;
		}

		this.saveMuscles();
	}

	deleteMuscle(muscle: Muscle) {
		const index = this.muscles.findIndex((m) => m.equals(muscle));
		if (index !== -1) {
			this.muscles.splice(index, 1); 
		}
		this.saveMuscles();
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

			const warmUps = (rawMuscle.warmUps || []).map((rawWarmUp: any) => {
				return new Exercise(
					rawWarmUp.name,
					rawWarmUp.sets,
					rawWarmUp.reps,
					rawWarmUp.weight,
					rawWarmUp.time,
					rawWarmUp.weightIncrease,
					rawWarmUp.variation,    
					rawWarmUp.boosted,
					rawWarmUp.note,
					rawWarmUp.isSuccess,
					rawWarmUp.isCompleted,
					rawWarmUp.isUnlocked
				);
			});

			const muscle = new Muscle(
				rawMuscle.name, 
				rawMuscle.minSets, 
				rawMuscle.maxSets, 
				rawMuscle.boosted,
				rawMuscle.coreExercises || [], // Read coreExercises or set it to an empty array if not present
				warmUps || [] 
			);
			this.muscles.push(muscle);
		});
	}
}
