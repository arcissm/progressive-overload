import {Workout} from "../../models/Workout";
import * as fs from 'fs';
import * as path from 'path'
import {BREAK, IMAGES_DIR, WORKOUT_DATA_PATH} from "../../utils/Constants";
import {isSameDate} from "../../utils/AlgorithmUtils";
import { Exercise } from "models/Exercise";
import { isDataView } from "util/types";

export class WorkoutData{
	private dataPath: string;
	private imageDirPath: string;
	private workouts: Map<string, Workout[]> = new Map();

	constructor(dirPath:string, workoutTypes: string[]) {
		this.dataPath = dirPath + WORKOUT_DATA_PATH;
		this.imageDirPath = dirPath + IMAGES_DIR;
		// init workouts
		this.convertDataToWorkout(this.dataPath, workoutTypes);
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

	getWorkoutsByDate(date: Date): Workout[] {
		let result: Workout[] = [];
		for (const workoutList of this.workouts.values()) {
			const filteredWorkouts = workoutList.filter(workout => isSameDate(workout.date, date));
			result = result.concat(filteredWorkouts);
		}
		return result;
	}
	
	getCompletedWorkouts(){
		return this.getAllWorkouts().filter(workout => workout.isCompleted);
	}

	getLast2WorkoutsOfType(workoutType: string): Workout[] {
		const workoutsOfType = this.getWorkoutsOfType(workoutType);
		const sortedWorkouts = workoutsOfType.sort((a, b) => b.date.getTime() - a.date.getTime());
		return sortedWorkouts.slice(0, 2);
	}

	getWorkoutsOfType(workoutType:string){
		return this.workouts.get(workoutType) || [];
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

	

	deleteWorkout(workoutType: string, date: Date, index: number) {
		const workoutsOfType = this.workouts.get(workoutType);
	
		if (workoutsOfType) {
			const workoutOnSameDay = workoutsOfType.filter(workout => isSameDate(workout.date, date));
	
			if (index >= 0 && index < workoutOnSameDay.length) {
				const workoutToDelete = workoutOnSameDay[index];
				const workoutIndex = workoutsOfType.findIndex(workout =>
					isSameDate(workout.date, date) && workout === workoutToDelete
				);
	
				if (workoutIndex !== -1) {
					workoutsOfType.splice(workoutIndex, 1);
	
					this.workouts.set(workoutType, workoutsOfType);
					this.saveWorkouts();
				} else {
					console.error("Workout to delete not found in the original list");
				}
			} else {
				console.error("Index out of range for workouts on the specified date");
			}
		} else {
			console.error("Workout type not found");
		}
	}
	

	addWorkout(workout: Workout) {
		if (this.workouts.has(workout.workoutType)) {
			const workoutArray = this.workouts.get(workout.workoutType);
			console.log(workoutArray)
			if (workoutArray) {
				workoutArray.push(workout);
			}
		} else {
			this.workouts.set(workout.workoutType, [workout]);
		}
		this.saveWorkouts()
	}
	
	saveWorkouts(){
		const updatedData = JSON.stringify( this.getAllWorkouts(), null, 2);
		fs.writeFileSync( this.dataPath, updatedData, 'utf8');
	}


	private convertDataToWorkout(dataPath: string, workoutTypes: Array<string>) { 
		const rawData = fs.readFileSync(dataPath, 'utf8');
		const parsedData = JSON.parse(rawData);
	
		// Assuming parsedData is an array of workouts
		const workouts: Workout[] = parsedData.map((rawWorkout: any) => {
			// Create Exercise instances for warm-ups
			const warmUps = (rawWorkout.warmUps || []).map((rawWarmUp: any) => {
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
	
			// Create Exercise instances for exercises
			const exercises = (rawWorkout.exercises || []).map((rawExercise: any) => {
				return new Exercise(
					rawExercise.name,
					rawExercise.sets,
					rawExercise.reps,
					rawExercise.weight,
					rawExercise.time,
					rawExercise.weightIncrease,
					rawExercise.variation,  
					rawExercise.boosted,
					rawExercise.note,
					rawExercise.isSuccess,
					rawExercise.isCompleted,
					rawExercise.isUnlocked
				);
			});
	
			return new Workout(
				rawWorkout.workoutType,
				new Date(rawWorkout.date),
				rawWorkout.note,
				rawWorkout.isCompleted,
				rawWorkout.isSuccess,
				warmUps,
				exercises
			);
		});
	
		// Update the cache with the loaded workouts
		this.updateCache(workouts, workoutTypes);
	}
	

		
	// Cache functions
	private updateCache(workouts: Workout[], workoutTypes: Array<string>) {
		// Initialize the cache map with empty arrays for each workout type
		workoutTypes.forEach(type => this.workouts.set(type, []));

		// Populate the cache with workouts
		workouts.forEach(workout => {
			if (workoutTypes.includes(workout.workoutType)) {
				const list = this.workouts.get(workout.workoutType) || [];
				list.push(workout);

				// Ensure the list is sorted from oldest to newest
				list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
				this.workouts.set(workout.workoutType, list);
			}
		});
	}

	/*
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




	*/

	/*



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

	*/
}
