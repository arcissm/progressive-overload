import {WorkoutData} from "../data/WorkoutData";

//In future use to create workout stats
export class WorkoutService {
	private workoutData: WorkoutData;

	constructor(workoutData: WorkoutData) {
		this.workoutData = workoutData;
	}

	deleteWorkout(workoutType: string ,date: string){
		this.workoutData.deleteWorkout(workoutType,date);
	}

	createNewWorkout(workoutType:string){

		const workout = this.workoutData.getLastWorkoutOfType(workoutType);

		const newWorkout = workout.cloneWithTodayDate();

		console.log(this.workoutData.getAllWorkouts())
		// updates the workout Data
		newWorkout.progressiveOverload();

		// save the workout data to JSON
		this.workoutData.addWorkout(newWorkout);
		console.log(this.workoutData.getAllWorkouts())

		return newWorkout;
	}

}
