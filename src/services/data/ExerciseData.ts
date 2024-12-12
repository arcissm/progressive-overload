import {Exercise} from "../../models/Exercise";
import * as fs from 'fs';
import { EXERCISE_DATA_PATH } from "utils/Constants";

export class ExerciseData {
	private dataPath: string
	private exercises: Array<Exercise> = [];

	constructor(dirPath: string) {
		this.dataPath = dirPath + EXERCISE_DATA_PATH;
		this.ensureDirectoryExists(dirPath);
		this.ensureFileExists();
		this.convertDataToExercises();
	}


	getExerciseById(id: string): Exercise | undefined {
		return this.exercises.find(exercise => exercise.id === id);
	}
	
	getAllExercises(){
		return this.exercises;
	}

	addExercise(newExercise: Exercise){
		this.exercises.push(newExercise)
	}

	deleteExercise(id: string) {
		const index = this.exercises.findIndex(exercise => exercise.nameToId() === id);
		if (index !== -1) {
			this.exercises.splice(index, 1);
		}
	}

	private ensureDirectoryExists(dirPath: string) {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
    }

	private ensureFileExists() {
		if (!fs.existsSync(this.dataPath)) {
			fs.writeFileSync(this.dataPath, JSON.stringify([], null, 2), 'utf8');
		}
	}

	saveExercises(){
		const updatedData = JSON.stringify( this.exercises, null, 2);
		fs.writeFileSync( this.dataPath, updatedData, 'utf8');
	}


	private convertDataToExercises() {
		const rawData = fs.readFileSync(this.dataPath, 'utf8');
		const parsedData = JSON.parse(rawData);

		parsedData.forEach((rawExercise: any) => {

			const exercise = new Exercise(
				rawExercise.name, 
				Number(rawExercise.sets), 
				rawExercise.reps, 
				Number(rawExercise.weight), 
				Number(rawExercise.time), 
				Number(rawExercise.weightIncrease), 
				rawExercise.variation, 
				Number(rawExercise.boolean), 
				rawExercise.note,
				rawExercise.isSuccess,
				rawExercise.isCompleted, 
				rawExercise.isUnlocked)

			this.exercises.push(exercise)
		});
	}
}
