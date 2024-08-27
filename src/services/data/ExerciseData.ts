import {Exercise} from "../../models/Exercise";
import * as fs from 'fs';
import {Muscle} from "../../models/Muscle";

export class ExerciseData {
	private dataPath: string
	private muscleExercises: Array<Muscle> = [];

	constructor(dataPath: string) {
		this.dataPath = dataPath;
		// init workouts
		this.convertDataToExercises(this.dataPath);
	}

		findExerciseById(id: string): Exercise | null {
		// Iterate through each Muscle in the muscleExercises array
		for (const muscle of this.muscleExercises) {
			// Use the find method to locate the exercise with the matching id
			const exercise = muscle.exercises.find(ex => ex.id === id);
			// If an exercise is found, return it
			if (exercise) {
				return exercise;
			}
		}
		// If no exercise is found, return undefined
		return null;
	}

	setSuccessful(exercises: Array<Exercise>){
		const allExercises: Exercise[] = this.muscleExercises.flatMap(muscle => muscle.exercises);

		exercises.forEach(exercise => {
			const successfulExercises = allExercises.filter(ex => ex.name === exercise.name)
			successfulExercises.forEach(successfulExercise =>
				successfulExercise.isSuccess = true
			)
		})
	}

	getMuscleByName(muscleName: string) {
		return this.muscleExercises.find(muscle => muscle.name === muscleName) || null;
	}

	getLockedExercisesByMuscle(muscleName: string): Exercise[] {
		// Find the muscle with the specified name
		const muscle = this.muscleExercises.find(muscle => muscle.name === muscleName);

		if (!muscle) {
			// Return an empty array if the muscle is not found
			return [];
		}

		// Filter the exercises to include only the unlocked ones
		// const unlockedExercises = muscle.exercises.filter(exercise => exercise.isUnlocked);
		return muscle.exercises.filter(exercise => !exercise.isUnlocked);
	}

	saveExercises(){
		const updatedData = JSON.stringify( this.muscleExercises, null, 2);
		fs.writeFileSync( this.dataPath, updatedData, 'utf8');
	}

	getUnlockedExercisesByMuscle(muscleName: string): Exercise[] {
		// Find the muscle with the specified name
		const muscle = this.muscleExercises.find(muscle => muscle.name === muscleName);

		if (!muscle) {
			// Return an empty array if the muscle is not found
			return [];
		}

		// Filter the exercises to include only the unlocked ones
		// const unlockedExercises = muscle.exercises.filter(exercise => exercise.isUnlocked);
		return muscle.exercises.filter(exercise => exercise.isUnlocked);
	}


	private convertDataToExercises(dataPath: string) {
		// Read and parse the JSON file
		const rawData = fs.readFileSync(dataPath, 'utf8');
		const parsedData = JSON.parse(rawData);

		// Process each exercise from the parsed data
		parsedData.forEach((rawMuscle: any) => {

			const exercises:Array<Exercise> = []
			rawMuscle.exercises.forEach((rawExercise:any) => {
				exercises.push(new Exercise(
					rawExercise.name,
					rawExercise.weight,
					rawExercise.sets,
					rawExercise.reps,
					rawExercise.time,
					rawExercise.note,
					rawExercise.isCore,
					rawExercise.isSuccess,
					rawExercise.isUnlocked
				))
			})
			const muscle = new Muscle(rawMuscle.name, rawMuscle.minSets, rawMuscle.maxSets, rawMuscle.failed, exercises)
			this.muscleExercises.push(muscle)
		});
	}
}
