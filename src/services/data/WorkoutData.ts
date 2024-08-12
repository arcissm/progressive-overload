import {Workout} from "../../models/Workout";
import * as fs from 'fs';
import {Exercise} from "../../models/Exercise";
import {WORKOUT_TYPES} from "../../utils/Constants";

export class WorkoutData{
	private dataPath: string
	private workouts: Map<string, Workout[]> = new Map();

	constructor(dataPath:string) {
		this.dataPath = dataPath;
		// init workouts
		this.convertDataToWorkout(this.dataPath);
	}


	// Cache functions
	private updateCache(workouts: Workout[]) {
		// Initialize the cache map with empty arrays for each workout type
		WORKOUT_TYPES.forEach(type => this.workouts.set(type, []));

		// Populate the cache with workouts
		workouts.forEach(workout => {
			if (WORKOUT_TYPES.includes(workout.workoutType)) {
				const list = this.workouts.get(workout.workoutType) || [];
				list.push(workout);
				// Ensure the list is sorted from oldest to newest
				list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
				this.workouts.set(workout.workoutType, list);
			}
		});
	}

	private isSameDate(date1: string, date2:string){
		const [year1, month1, day1] = date1.split('-').map(Number);
		const [year2, month2, day2] = date2.split('-').map(Number);

		return year1 === year2 &&
			month1 === month2 &&
			day1 === day2;
	}


	getAllWorkouts(): Workout[] {
		// Combine all workouts from the map into a single array
		const allWorkouts: Workout[] = [];
		this.workouts.forEach(workoutsList => {
			allWorkouts.push(...workoutsList);
		});

		// Sort the combined array from newest to oldest
		return allWorkouts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
	}


	getLastWorkoutOfType(workoutType: string) : Workout{
		const list = this.workouts.get(workoutType);
		// @ts-ignore
		return list[list.length - 1];

	}

	//adding a new workout to the list
	addWorkout(workout: Workout) {
		// Get the list of workouts for the specified workoutType
		const list = this.workouts.get(workout.workoutType) || [];

		// Check if the workout already exists in the list
		if (!list.some(existingWorkout => this.isSameDate(existingWorkout.date, workout.date))) {
			// Append the new workout to the list
			list.push(workout);
			// Update the map with the new list
			this.workouts.set(workout.workoutType, list);
			// Save the updated workouts to the file
			this.saveWorkouts();
		} else {
			console.debug("Workout already exists");
		}
	}


	updateWorkout(newWorkout: Workout) {
		// Get the list of workouts for the specified workoutType
		const list = this.workouts.get(newWorkout.workoutType);

		// Check if the list exists and is not empty
		if (list) {
			// Find the index of the workout to update
			const index = list.findIndex(workout => this.isSameDate(workout.date, newWorkout.date));

			if (index !== -1) {
				// Replace the old workout with the new workout
				list[index] = newWorkout;
				// Ensure the list is still sorted from oldest to newest
				list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
				// Update the map with the modified list
				this.workouts.set(newWorkout.workoutType, list);
				// Save the updated list to the JSON file
				this.saveWorkouts();
			} else {
				console.error("Workout not found");
			}
		} else {
			console.error("Workout type not found");
		}
	}


	deleteWorkout(workoutType: string, date: string) {

		// Get the list of workouts for the specified workoutType
		const list = this.workouts.get(workoutType);

		// Check if the list exists
		if (list) {
			// Find the index of the workout to delete
			const index = list.findIndex(workout => this.isSameDate(workout.date, date));

			if (index !== -1) {
				// Remove the workout from the list
				list.splice(index, 1);

				// Update the map with the modified list
				this.workouts.set(workoutType, list);

				// Save the updated list to the JSON file
				this.saveWorkouts();
			} else {
				console.error("Workout not found");
			}
		} else {
			console.error("Workout type not found");
		}
	}


	private saveWorkouts(){
		const updatedData = JSON.stringify( this.getAllWorkouts(), null, 2);
		fs.writeFileSync( this.dataPath, updatedData, 'utf8');
	}

	private convertDataToWorkout(dataPath: string) {
		const rawData = fs.readFileSync(dataPath, 'utf8');
		const parsedData = JSON.parse(rawData);

		// Assuming parsedData is an array of workouts
		const workouts: Workout[] = parsedData.map((rawWorkout: any) => {
			const exercises = rawWorkout.exercises.map((rawExercise: any) => {
				return new Exercise(
					rawExercise.name,
					rawExercise.weight,
					rawExercise.sets,
					rawExercise.reps,
					rawExercise.note,
					rawExercise.success
				);
			});

			return new Workout(
				rawWorkout.workoutType,
				rawWorkout.date,
				exercises,
				rawWorkout.note,
				rawWorkout.completed
			);
		});

		// Update the cache with the loaded workouts
		this.updateCache(workouts);
	}
}
