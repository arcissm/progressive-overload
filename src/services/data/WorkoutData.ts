import {Workout} from "../../models/Workout";
import * as fs from 'fs';
import {Exercise} from "../../models/Exercise";

export class WorkoutData{
	dataPath: string
	workouts: Array<Workout>

	constructor(dataPath:string) {
		this.dataPath = dataPath;
		this.workouts = this.convertDataToWorkout(dataPath)
	}



	// printWorkouts(){
	// 	this.workouts .forEach(w =>
	// 		console.log(w.toMarkdown())
	// 	)
	// }

	// getWorkout(workoutType: string, date: string): Workout | undefined {
	// 	// Normalize dates by setting hours, minutes, seconds, and milliseconds to 0
	// 	const normalizeDate = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
	//
	// 	// Find the workout that matches both the workoutType and date, ignoring time
	// 	return this.workouts.find(workout =>
	// 		workout.workoutType === workoutType &&
	// 		normalizeDate(new Date(workout.date)).getTime() === normalizeDate(new Date(date)).getTime()
	// 	);
	// }


	getAllWorkouts() : Array<Workout> {
		return this.workouts
	}

	private getWorkoutIndex(workoutType: string, date: string): number {
		return this.workouts.findIndex(workout =>
			workout.workoutType === workoutType && new Date(workout.date).getTime() === new Date(date).getTime()
		)
	}

	getLastWorkoutOfType(workoutType: string) : Workout{

		// Filter workouts by the specified type
		const filteredWorkouts = this.workouts.filter(workout =>
			workout.workoutType === workoutType
		)

		// Sort the filtered workouts by date, with the most recent first
		filteredWorkouts.sort((a, b) =>
			new Date(b.date).getTime() - new Date(a.date).getTime()
		);

		// Return the most recent workout or undefined if none found
		return filteredWorkouts[0];
	}

	//adding a new workout to the list
	addWorkout(workout:Workout){
		this.workouts.push(workout);
		this.saveWorkouts()
	}

	updateWorkout(newWorkout: Workout) {
		const index = this.getWorkoutIndex(newWorkout.workoutType, newWorkout.date)

		if (index !== -1) {
			// Replace the old workout with the new workout
			this.workouts[index] = newWorkout;
			// Save the updated list to the JSON file
			this.saveWorkouts();
		} else {
			console.error("Workout not found");
		}
	}

	deleteWorkout(workoutType: string, date: string) {
		// Find the index of the workout to delete
		const index = this.getWorkoutIndex(workoutType, date)

		if (index !== -1) {
			// Remove the workout from the list
			this.workouts.splice(index, 1);
			// Save the updated list to the JSON file
			this.saveWorkouts();
		} else {
			console.error("Workout not found");
		}
	}

	private saveWorkouts(){
		const updatedData = JSON.stringify(this.workouts, null, 2);
		fs.writeFileSync( this.dataPath, updatedData, 'utf8');
	}

	private convertDataToWorkout(dataPath: string){
		const rawData = fs.readFileSync(dataPath, 'utf8');
		const parsedData  = JSON.parse(rawData);

		return parsedData.map((rawWorkout: any) => {
			const exercises = rawWorkout.exercises.map((rawExercise: any) => {
				return new Exercise(
					rawExercise.name,
					rawExercise.sets,
					rawExercise.reps,
					rawExercise.weight,
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
	}
}
