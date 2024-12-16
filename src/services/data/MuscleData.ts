import * as fs from 'fs';
import {Muscle} from "../../models/Muscle";
import { MUSCLE_DATA_PATH } from "utils/Constants";
import { Exercise } from 'models/Exercise';
import path from 'path';

export class MuscleData {
	private dataPath: string
	private muscles: Array<Muscle> = [];

	constructor(dirPath: string) {
		this.dataPath = dirPath + MUSCLE_DATA_PATH;
		this.convertDataToMuscles();
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


	private convertDataToMuscles() {
		const rawData = fs.readFileSync(this.dataPath, 'utf8');
		const parsedData = JSON.parse(rawData);
	
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
				rawMuscle.coreExercises || [],
				warmUps || [] 
			);
			this.muscles.push(muscle);
		});
	}
}
