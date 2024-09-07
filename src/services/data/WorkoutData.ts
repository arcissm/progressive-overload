import {Workout} from "../../models/Workout";
import * as fs from 'fs';
import * as path from 'path'
import {Exercise} from "../../models/Exercise";
import {WORKOUT_TYPES} from "../../utils/Constants";
import {isSameDate, getTodayDateUTC} from "../../utils/AlgorithmUtils";

export class WorkoutData{
	private dataPath: string;
	private imageDirPath: string;
	private workouts: Map<string, Workout[]> = new Map();

	constructor(dataPath:string, imageDirPath: string) {
		this.dataPath = dataPath;
		this.imageDirPath = imageDirPath;
		// init workouts
		this.convertDataToWorkout(this.dataPath);
	}


	getWorkout(workoutType:string, date:string){
		const workoutsOfType = this.workouts.get(workoutType)
			if(workoutsOfType != undefined){
				return workoutsOfType.find(workout => workout.date === date)
			}
			return undefined
	}

	getWorkoutsByDate(date: string): Workout[] {
		let result: Workout[] = [];
		for (const [workoutType, workoutList] of this.workouts) {
			const filteredWorkouts = workoutList.filter(workout => isSameDate(workout.date,date));
			result = result.concat(filteredWorkouts);
		}
		return result;
	}

	getCompletedWorkoutsLastWeeks(numberWeeks:number): number {
		const twoWeeksAgo = new Date();
		twoWeeksAgo.setDate(twoWeeksAgo.getDate() - (numberWeeks * 7));

		let completedWorkoutsCount = 0;

		this.workouts.forEach((workoutArray) => {
			workoutArray.forEach((workout) => {
				const workoutDate = new Date(workout.date);

				if (workoutDate >= twoWeeksAgo) {
					completedWorkoutsCount++;
				}
			});
		});

		return completedWorkoutsCount;
	}

	getDaysSinceLastWorkout(): number {
		let mostRecentDate: Date = new Date("1999-01-01T00:00:00Z");

		const todayDateUTC = getTodayDateUTC();

		// Iterate over each array of workouts in the Map
		for (const workoutArray of this.workouts.values()) {
			// Find the most recent workout in the current array
			for (const workout of workoutArray) {
				// Parse the workout date assuming it is in 'YYYY-MM-DD' format
				const workoutDateUTC = new Date(`${workout.date}T00:00:00Z`);

				// Update mostRecentDate if the workoutDate is more recent
				if (workoutDateUTC > mostRecentDate && workoutDateUTC <= todayDateUTC) {
					mostRecentDate = workoutDateUTC;
				}
			}
		}

		// Calculate the difference in days
		const diffTime = Math.abs(todayDateUTC.getTime() - mostRecentDate.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		return diffDays;
	}





	getMotivationalImage(){

		let files;
		try {
			files = fs.readdirSync(this.imageDirPath);
		} catch (err) {
			console.error("Error reading the image folder:", err);
			return "";
		}

		const randomImage = files[Math.floor(Math.random() * files.length)];
		return path.join(this.imageDirPath, randomImage)
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


	getAllWorkouts(): Workout[] {
		// Combine all workouts from the map into a single array
		const allWorkouts: Workout[] = [];
		this.workouts.forEach(workoutsList => {
			allWorkouts.push(...workoutsList);
		});

		// Sort the combined array from newest to oldest
		return allWorkouts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
	}

	getLastSuccessStreak(workoutType: string){
		try {
			const list = this.workouts.get(workoutType);
			// @ts-ignore
			const workout = list[list.length - 2];
			return workout.successStreak;
		} catch (error){
			return 0;
		}
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
		if (!list.some(existingWorkout => isSameDate(existingWorkout.date, workout.date))) {
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


	deleteWorkout(workoutType: string, date: string) {

		if(workoutType === "break"){
			return
		}
		// Get the list of workouts for the specified workoutType
		const list = this.workouts.get(workoutType);

		// Check if the list exists
		if (list) {
			// Find the index of the workout to delete
			const index = list.findIndex(workout => isSameDate(workout.date, date));

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


	saveWorkouts(){
		const updatedData = JSON.stringify( this.getAllWorkouts(), null, 2);
		fs.writeFileSync( this.dataPath, updatedData, 'utf8');
	}

	private convertDataToWorkout(dataPath: string) {
		const rawData = fs.readFileSync(dataPath, 'utf8');
		const parsedData = JSON.parse(rawData);

		// Assuming parsedData is an array of workouts
		const workouts: Workout[] = parsedData.map((rawWorkout: any) => {
			const warmUps = rawWorkout.exercises.map((rawWarmUp: any) => {
				return new Exercise(
					rawWarmUp.name,
					rawWarmUp.weight,
					rawWarmUp.sets,
					rawWarmUp.reps,
					rawWarmUp.time,
					rawWarmUp.note,
					rawWarmUp.isCore,
					rawWarmUp.isSuccess,
					rawWarmUp.isUnlocked,
					rawWarmUp.weightIncrease
				);
			});
			const exercises = rawWorkout.exercises.map((rawExercise: any) => {
				return new Exercise(
					rawExercise.name,
					rawExercise.weight,
					rawExercise.sets,
					rawExercise.reps,
					rawExercise.time,
					rawExercise.note,
					rawExercise.isCore,
					rawExercise.isSuccess,
					rawExercise.isUnlocked,
					rawExercise.weightIncrease
				);
			});

			return new Workout(
				rawWorkout.workoutType,
				rawWorkout.date,
				warmUps,
				exercises,
				rawWorkout.note,
				rawWorkout.completed,
				rawWorkout.successStreak
			);
		});

		// Update the cache with the loaded workouts
		this.updateCache(workouts);
	}
}
