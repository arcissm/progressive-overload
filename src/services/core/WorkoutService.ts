import {WorkoutData} from "../data/WorkoutData";
import {ExerciseData} from "../data/ExerciseData";
import {
	MAXIMUM_ALLOWED_MUSCLE_FAILURES, MINIMUM_MUSCLE_SUCCESS_STREAK,
	MINIMUM_SUCCESS_TO_UNLOCK_NEW_EXERCISE,
	WORKOUT_MUSCLE_MAP,
	WORKOUT_WARMUP_MAP,
	YOGA_CHANCE,
	YOGA_WORKOUT
} from "../../utils/Constants";
import {Exercise} from "../../models/Exercise";
import {getRandomInt, getTodayDateUTC} from "../../utils/AlgorithmUtils";
import {Muscle} from "../../models/Muscle";
import {Workout} from "../../models/Workout";
import * as path from "path";

//In future use to create workout stats
export class WorkoutService {
	private workoutData: WorkoutData;
	private exerciseData: ExerciseData;

	constructor(workoutData: WorkoutData, exerciseData: ExerciseData) {
		this.workoutData = workoutData;
		this.exerciseData = exerciseData;
	}

	createCardioWorkout(workoutType:string){
		const musclesName = this.getMuscleGroupsForWorkout(workoutType)[0];
		const exercisesList = this.exerciseData.getMuscleByName(musclesName)?.exercises;
		const todayDateUTC = getTodayDateUTC();
		const date = todayDateUTC.toISOString().split('T')[0];
		const capitalWorkout = workoutType.charAt(0).toUpperCase() + workoutType.slice(1)
		const workout =  new Workout(
			workoutType,
			date,
			[],
			exercisesList,
			"",
			false,
			0
		)

		this.workoutData.addWorkout(workout);

		this.updateWorkoutComplete(date + " " + capitalWorkout + ".md")

		return workout;
	}

	createNewWorkout(workoutType:string){

		const musclesNames = this.getMuscleGroupsForWorkout(workoutType)
		const successStreak = this.unlockNewExercise(workoutType, musclesNames);
		const exercisesList: Exercise[] = []

		musclesNames.forEach(muscleName => {

			const exercises = this.makeWorkoutExerciseList(muscleName, successStreak)

			// Apply progressive overload
			exercises.forEach(exercise => {
				exercise.progressiveOverload();
			});

			// If 2 muscle groups selected the same exercise
			// you only do the exercise once.
			// but you do it with the most sets between the 2
			exercises.forEach(newExercise => {
				const commonExercise = exercisesList.find(savedExercise => newExercise.name === savedExercise.name);
				if(commonExercise != undefined){
					commonExercise.sets = Math.max(commonExercise.sets, newExercise.sets);
				}
			})

			// Remove exercises that have been updated in the list
			const filteredExercises = exercises.filter(newExercise =>
				!exercisesList.some(savedExercise => newExercise.name === savedExercise.name)
			);

			// Add non-duplicate exercises to the exercisesList
			exercisesList.push(...filteredExercises);

			// save the exercise data to JSON
			// this.exerciseData.updateExercises(muscleName, filteredExercises)

		})

		const todayDateUTC = getTodayDateUTC();
		const todayDateString = todayDateUTC.toISOString().split('T')[0];


		const workout =
			new Workout(
				workoutType,
				todayDateString,
				this.getWarmUForWorkout(workoutType),
				exercisesList,
				this.getMotivationalNote(),
				false,
				0
			)

		// save the workout data to JSON
		this.workoutData.addWorkout(workout);
		this.exerciseData.saveExercises();

		return workout;
	}

	deleteWorkout(workoutType: string ,date: string){

		// remove failure debt
		const musclesNames = this.getMuscleGroupsForWorkout(workoutType);
		musclesNames.forEach(muscleName => {
			const muscle = this.exerciseData.getMuscleByName(muscleName)
			if(muscle != null){
				muscle.failed = Math.max(0, muscle.failed-1);
			}
		});

		this.workoutData.deleteWorkout(workoutType,date);
	}

	getWorkoutsByDate(date:string){
		return this.workoutData.getWorkoutsByDate(date);
	}


	updateWorkoutComplete(fileName:string){
		const { date, workoutType } = this.extractDateAndWorkoutType(fileName)

		this.getMuscleGroupsForWorkout(workoutType).forEach(muscleName => {
			const muscle = this.exerciseData.getMuscleByName(muscleName)
			if(muscle != null) muscle.failed = Math.max(0, muscle.failed-1);
		})

		// completed workout
		const workout = this.workoutData.getWorkout(workoutType, date)

		if(workout == undefined) return
		workout.completed = true;

		// the exercise is successful everywhere,
		// even under another muscle
		// this.exerciseData.setSuccessful(workout.exercises);

		// add to successful streak
		let successStreak = this.workoutData.getLastSuccessStreak(workoutType);
		successStreak++;
		workout.successStreak = successStreak;

		this.exerciseData.saveExercises();
		this.workoutData.saveWorkouts();

	}



	updateExerciseSuccess(id:string) {
		console.log("SUCCESS")

		const exercise = this.exerciseData.findExerciseById(id)
		console.log(exercise)
		if(exercise == null){
			// a warmup or rehab exercise not saved in the .json
			return;
		}
		if(exercise.isSuccess == false){
			exercise.isSuccess = true;
		}

		exercise.note = "AAAAAAAAAA"
		console.log(exercise)
		this.exerciseData.saveExercises();

	}


	private unlockNewExercise(workoutType:string, musclesNames:string[]){

		const successStreak = this.workoutData.getLastSuccessStreak(workoutType);

		// Did not succeed 3workouts in a row
		// not unlocking new exercises
		// Success is defined as 3 workouts with all exercises marked as success = true
		if(successStreak < MINIMUM_SUCCESS_TO_UNLOCK_NEW_EXERCISE){
			return successStreak
		}

		const locked: Array<Exercise> = []

		musclesNames.forEach(muscleName => {
			locked.push(...this.exerciseData.getLockedExercisesByMuscle(muscleName));

		})

		// nothing to unlock
		if(locked.length == 0){
			return successStreak
		}
		const randomIndex = Math.floor(Math.random() * locked.length);
		const newExercise = locked[randomIndex];
		newExercise.isUnlocked = true;

		return 0
	}

	// Function to get muscle groups for a given workout type
	private getMuscleGroupsForWorkout(workoutType: string): string[] {
		return WORKOUT_MUSCLE_MAP[workoutType] || [];
	}

	// Function to get muscle groups for a given workout type
	private getWarmUForWorkout(workoutType: string): Exercise[] {
		// 25% of the time, you do yoga as a warmup
		if(Math.random() < YOGA_CHANCE){
			const index = getRandomInt(0, YOGA_WORKOUT.length -1)
			const yoga = new Exercise("yoga",0,0,"",0, YOGA_WORKOUT[index])
			return [yoga];
		}

		return WORKOUT_WARMUP_MAP[workoutType] || [];
	}

	private addMuscleSets(muscle: Muscle){
		muscle.minSets += 1;
		muscle.maxSets += 1;
	}

	removeMuscleSets(muscle: Muscle){
		muscle.minSets -= 1;
		muscle.maxSets -= 1;

	}

	private setUpSetRangeBasedOnFailure(muscle: Muscle, successStreak: number){
		// muscle debt
		muscle.failed++;

		// If I fail 4 times in a row, I have to do more sets
		if(muscle.failed >= MAXIMUM_ALLOWED_MUSCLE_FAILURES){
			this.addMuscleSets(muscle);
		}

		if(successStreak >= MINIMUM_MUSCLE_SUCCESS_STREAK){
			muscle.failed = 0;
			this.removeMuscleSets(muscle)
		}


		this.exerciseData.saveExercises();
	}

	private makeWorkoutExerciseList(muscleName: string, successStreak: number) {
		const muscle = this.exerciseData.getMuscleByName(muscleName);
		if(muscle == null){
			return []
		}

		this.setUpSetRangeBasedOnFailure(muscle, successStreak)

		const sets = getRandomInt(muscle.minSets, muscle.maxSets);
		const unlocked = this.exerciseData.getUnlockedExercisesByMuscle(muscleName);

		if (unlocked.length === 0 || sets === 0) {
			return [];
		}

		const selectedExercises: Array<Exercise> = [];

		// Step 1: Find all core exercises and calculate the total sets they consume.
		let coreSets = 0;
		unlocked.forEach(exercise => {
			if (exercise.isCore) {
				selectedExercises.push(Exercise.from(exercise, exercise.sets));
				coreSets += exercise.sets;
			}
		});

		// Step 2: Calculate the remaining sets after accounting for core exercises.
		let setsLeft = sets - coreSets;

		//If you only have one set for an exercise
		if(setsLeft === 1){
			const randomIndex = getRandomInt(0, unlocked.length - 1);
			const randomExercise = unlocked[randomIndex];
			selectedExercises.push(Exercise.from(randomExercise, 2));
			setsLeft = 0;
		}

		// Step 3: Randomly allocate the remaining sets.
		while (setsLeft > 0) {
			const randomIndex = getRandomInt(0, unlocked.length - 1);
			const randomExercise = unlocked[randomIndex];


			// If only 2 sets are left, assign them all to a new exercise.
			if (setsLeft === 2) {
				selectedExercises.push(Exercise.from(randomExercise, 2));
				setsLeft -= 2;
			}
			// If only 1 set is left, add it to an already selected exercise.
			else if (setsLeft === 1) {
				const existingExercise = selectedExercises[getRandomInt(0, selectedExercises.length - 1)];
				existingExercise.sets += 1;
				setsLeft -= 1;
			}
			// Otherwise, allocate sets as before.
			else {
				const setsToAdd = Math.min(setsLeft, getRandomInt(2, 4));

				selectedExercises.push(Exercise.from(randomExercise, setsToAdd));
				setsLeft -= setsToAdd;
			}
		}

		return this.aggregateUniqueExercises(selectedExercises);
	}


	private aggregateUniqueExercises(exercises: Array<Exercise>): Array<Exercise> {
		// Create a map to aggregate sets by exercise name and store references to the original Exercise objects
		const exerciseMap = new Map<string, Exercise>();

		// Iterate through the exercises and aggregate sets by name
		exercises.forEach(exercise => {
			const existingExercise = exerciseMap.get(exercise.name);
			if (existingExercise) {
				// Aggregate sets by adding to the existing exercise's sets
				existingExercise.sets += exercise.sets;
			} else {
				// Store a reference to the original exercise
				exerciseMap.set(exercise.name, exercise);
			}
		});

		// Convert the map values to an array of Exercise instances
		return Array.from(exerciseMap.values());
	}

	private getMotivationalNote() {
		const imagePath = this.workoutData.getMotivationalImage();

		// Extract the filename from the path
		const fileName = path.basename(imagePath);

		// Determine the message based on the filename prefix
		let message = "";
		if (fileName.startsWith("bad_")) {
			message = "<div class=\"motivationalSpeech\">\n" +
				"Do you want to look like that forever?" +
				"</div>"
		} else if (fileName.startsWith("good_")) {
			message = "<div class=\"motivationalSpeech\">\n" +
				"You can look like this too." +
				"</div>"
		}

		// Return the markdown string with the image and the message
		return `![Motivation](${imagePath})\n\n${message}\n`;
	}

	private extractDateAndWorkoutType(fileName: string): { date: string, workoutType: string } {
		// Regular expression to match the date and workout type
		const regex = /^(\d{4}-\d{2}-\d{2})\s+(.+)\.md$/;
		const match = fileName.match(regex);

		// If the file name matches the expected pattern
		if (match) {
			const date = match[1];                       // Extracted date
			const workoutType = match[2].trim().toLowerCase();  // Extracted workout type, trimmed and converted to lower case
			return { date, workoutType };
		}

		// Return null if the file name doesn't match the expected pattern
		throw new Error("Invalid file name format");
	}
}
