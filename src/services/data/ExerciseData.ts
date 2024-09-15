import {Exercise} from "../../models/Exercise";
import * as fs from 'fs';
import { EXERCISE_DATA_PATH } from "utils/Constants";

export class ExerciseData {
	private dataPath: string
	private exercises: Array<Exercise> = [];

	constructor(dirPath: string) {
		this.dataPath = dirPath + EXERCISE_DATA_PATH;
		// init workouts
		this.convertDataToExercises(this.dataPath);
	}


	getExerciseById(id: string): Exercise | undefined {
		return this.exercises.find(exercise => exercise.id === id);
	}
	


	// findExerciseById(id: string): Exercise | null {
	// 	// Iterate through each Muscle in the muscleExercises array
	// 	for (const muscle of this.muscleExercises) {
	// 		// Use the find method to locate the exercise with the matching id
	// 		const exercise = muscle.exercises.find(ex => ex.id === id);
	// 		// If an exercise is found, return it
	// 		if (exercise) {
	// 			return exercise;
	// 		}
	// 	}
	// 	// If no exercise is found, return undefined
	// 	return null;
	// }

	// setSuccessful(exercises: Array<Exercise>){
	// 	const allExercises: Exercise[] = this.muscleExercises.flatMap(muscle => muscle.exercises);

	// 	exercises.forEach(exercise => {
	// 		const successfulExercises = allExercises.filter(ex => ex.name === exercise.name)
	// 		successfulExercises.forEach(successfulExercise =>
	// 			successfulExercise.isSuccess = true
	// 		)
	// 	})
	// }

	// getMuscleByName(muscleName: string) {
	// 	return this.muscleExercises.find(muscle => muscle.name === muscleName) || null;
	// }

	// getLockedExercisesByMuscle(muscleName: string): Exercise[] {
	// 	// Find the muscle with the specified name
	// 	const muscle = this.muscleExercises.find(muscle => muscle.name === muscleName);

	// 	if (!muscle) {
	// 		// Return an empty array if the muscle is not found
	// 		return [];
	// 	}

	// 	// Filter the exercises to include only the unlocked ones
	// 	// const unlockedExercises = muscle.exercises.filter(exercise => exercise.isUnlocked);
	// 	return muscle.exercises.filter(exercise => !exercise.isUnlocked);
	// }

	// updateExercises(muscleName:string, exercises:Array<Exercise>){
	// 	const muscle = this.muscleExercises.find(muscle => muscle.name === muscleName);
	// 	muscle?.exercises.forEach(exercise => {
	// 		const workoutExercise = exercises.find(workoutExercise=> workoutExercise.name === exercise.name)
	// 		if(workoutExercise){
	// 			exercise.reps = workoutExercise.reps;
	// 			exercise.weight = workoutExercise.weight;
	// 			exercise.time = workoutExercise.time;

	// 			// isSuccess doesn't update to false once
	// 			exercise.isSuccess = workoutExercise.isSuccess;
	// 		}
	// 	})

	// 	this.saveExercises();
	// }


	// getUnlockedExercisesByMuscle(muscleName: string): Exercise[] {
	// 	// Find the muscle with the specified name
	// 	const muscle = this.muscleExercises.find(muscle => muscle.name === muscleName);

	// 	if (!muscle) {
	// 		// Return an empty array if the muscle is not found
	// 		return [];
	// 	}

	// 	// Filter the exercises to include only the unlocked ones
	// 	// const unlockedExercises = muscle.exercises.filter(exercise => exercise.isUnlocked);
	// 	return muscle.exercises.filter(exercise => exercise.isUnlocked);
	// }


	saveExercises(){
		const updatedData = JSON.stringify( this.exercises, null, 2);
		fs.writeFileSync( this.dataPath, updatedData, 'utf8');
	}


	private convertDataToExercises(dataPath: string) {
		// Read and parse the JSON file
		const rawData = fs.readFileSync(dataPath, 'utf8');
		const parsedData = JSON.parse(rawData);

		// Process each exercise from the parsed data
		parsedData.forEach((rawExercise: any) => {

			const exercise = new Exercise(
				rawExercise.name,
				rawExercise.variation,
				rawExercise.sets,
				rawExercise.reps,
				rawExercise.weight,
				rawExercise.time,
				rawExercise.weightIncrease,
				rawExercise.boosted,
				rawExercise.note,
				rawExercise.isSuccess,
				rawExercise.isCompleted,
				rawExercise.isUnlocked
			)

			this.exercises.push(exercise)
		});
	}
}
