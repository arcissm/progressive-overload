import {ExerciseData} from "../data/ExerciseData";
import {Exercise} from "../../models/Exercise";
import {Muscle} from "../../models/Muscle";
import {Workout} from "../../models/Workout";
import { DBService } from "./DBService";
import { getRandomInt, getTodayDateUTC, isSameDate } from "utils/AlgorithmUtils";
import * as path from "path";
import { WORKOUT_WARMUP_MAP, YOGA_CHANCE, YOGA_WORKOUT } from "utils/Constants";

//In future use to create workout stats
export class WorkoutService {
	private db: DBService;
	private exerciseData: ExerciseData;

	constructor(db: DBService) {
		this.db = db;
	}



	deleteWorkout(workoutType: string , date: Date, index: number){
		this.db.deleteWorkout(workoutType, date, index);
	}

	createWorkout(workoutType: string){
		const muscles = this.db.getMusclesForWorkoutType(workoutType);
		if (muscles == null){return null}

		this.useSteroids(muscles);
		const exercises = this.createExercises(muscles)
		exercises.forEach(exercise =>{
			exercise.progressiveOverload();
		})

		const workout = new Workout(
			workoutType,
			getTodayDateUTC(),
			this.getMotivationalNote(),
			false,
			false,
			this.getWarmUForWorkout(workoutType),
			exercises) 

		this.db.updateMuscles();
		this.db.updateExercises()
		this.db.addWorkout(workout)

		return workout
	}

	getWorkoutFromNote(workoutType: string, date: Date, index: number) {
		const workoutsOfType = this.db.getWorkoutsOfType(workoutType);
	
		if (workoutsOfType) {
			// Filter workouts by date
			const filteredWorkouts = workoutsOfType.filter(workout => isSameDate(workout.date, date));
	
			// Check if the index is within the bounds of the filtered workouts array
			if (index >= 0 && index < filteredWorkouts.length) {
				// filteredWorkouts[index] is a reference to the same workout object in workoutsOfType
				return filteredWorkouts[index];
			} else {
				console.error("Index out of range for the filtered workouts");
				return null;
			}
		} else {
			console.error("No workouts found for the specified type");
			return null;
		}
	}

	succeedExercise(workout:Workout | null, exerciseId: string){
		const exercise = this.db.getExerciseById(exerciseId)
		if(exercise){
			exercise.isSuccess = true
		}
		if(workout){
			const index = workout.exercises.findIndex(exercise => exercise.id == exerciseId)
			if(index!= -1){
				workout.exercises[index].isSuccess = true
				console.log(workout.exercises[index])
			}
		}

		this.db.updateExercises()
		this.db.updateWorkouts();
	}

	completeExercise(workout:Workout | null, exerciseId: string){
		const exercise = this.db.getExerciseById(exerciseId)
		if(exercise){
			exercise.isCompleted = true
		}
		if(workout){
			const index = workout.exercises.findIndex(exercise => exercise.id == exerciseId)
			if(index!= -1){
				workout.exercises[index].isCompleted = true
			}
		}

		this.db.updateExercises()
		this.db.updateWorkouts();
	}
	
	succeedWorkout(workout:Workout){
		workout.isSuccess = true;
		this.db.updateWorkouts();
	}
	

	completeWorkout(workout:Workout){
		workout.isCompleted = true;
		this.db.updateWorkouts();
	}
	
	// Steroids
	private useSteroids(muscles: Array<Muscle>){

		if(muscles == null){
			return;
		}

		muscles.forEach(muscle => {
			const lastTwoWorkouts = this.db.getLastTwoWorkoutsWithMuscle(muscle.name);
			
			let isCompleted = true;
			let isSuccess = true;

			lastTwoWorkouts.forEach(workout => {
				isCompleted = isCompleted && workout.isCompleted
				isSuccess = isSuccess && workout.isSuccess
			});

			if(isCompleted && isSuccess){
				this.chillOnTheRoids(muscle)
			}
			if(isCompleted && !isSuccess){
				this.addCreatine(lastTwoWorkouts, muscle);
			}
		})

	}

	
	private chillOnTheRoids(muscle: Muscle){
		if(muscle.boosted > 0){
			muscle.boosted--;
			muscle.maxSets--;
			muscle.minSets--;
			return
		}

		const exercises = this.db.getExercisesForMuscle(muscle.name)
		if(exercises == null){
			return
		}

		exercises.forEach(exercise => {
			if(exercise.boosted > 0){
				exercise.boosted--;
				exercise.sets--;
				return
			}
		})
	}

	private addCreatine(lastTwoWorkouts: Array<Workout>, muscle: Muscle) {
		// you can't fail if you have done less than 2 of these workouts
		if (lastTwoWorkouts.length < 2) {
			return;
		}
	
		const w1FailedExercises = this.getFailedExercises(lastTwoWorkouts[0]);
		const w2FailedExercises = this.getFailedExercises(lastTwoWorkouts[1]);
	
		if (w1FailedExercises.length > 0 && w2FailedExercises.length > 0) {
			const w2FailedIds = new Set(w2FailedExercises.map(exercise => exercise.id));
			
			const commonExercises = w1FailedExercises.filter(exercise => w2FailedIds.has(exercise.id));
			
			if (commonExercises.length > 0) {
				commonExercises.forEach(exercise =>{
					exercise.sets++;
					exercise.boosted++;
				})
			}else{
				muscle.boosted++;
				muscle.maxSets++;
				muscle.minSets++;
			}
		}
	}
	
	
	private getFailedExercises(workout: Workout){
		const failedExercises: Array<Exercise> = []
		workout.exercises.forEach(exercise => {
			if(!exercise.isSuccess){
				failedExercises.push(exercise)
			}
		})
		return failedExercises;
	}


	// Exercise List
	private createExercises(muscles: Array<Muscle>){
		const exercises: Array<Exercise> = []

		muscles.forEach(muscle =>{
			const coreExercises = this.db.getCoreExercises(muscle.name);
			const chooseFromExercises = this.db.getUnlockedExercisesForMuscle(muscle.name)

			const coreSets = coreExercises.reduce((sum, exercise) => {
				return sum + exercise.sets;
			}, 0);
			let totalSets = getRandomInt(muscle.minSets, muscle.maxSets) - coreSets;

			const pickedExercises = this.pickExercises(totalSets, coreExercises, chooseFromExercises);
			exercises.push(... pickedExercises);
		})

		return exercises;
	}


	private pickExercises(remainingSets: number, pickedExercises: Exercise[], chooseFromExercises: Exercise[]): Exercise[] {
        if (remainingSets <= 0) {
            return pickedExercises;
        }

        if(remainingSets < this.getMinimumSets(chooseFromExercises)){

            const lastExerciseIndex = getRandomInt(0, pickedExercises.length - 1)
            const lastExercise = pickedExercises[lastExerciseIndex]
            lastExercise.sets += remainingSets
            return pickedExercises;
        }

		const exercise = chooseFromExercises[getRandomInt(0, chooseFromExercises.length - 1)];
        
        // Check if we can include this exercise
        if (exercise.sets <= remainingSets) {
            pickedExercises.push(exercise);
            remainingSets -= exercise.sets;
        }

        // Continue picking exercises
        return this.pickExercises(remainingSets, pickedExercises, chooseFromExercises);
    }

	private getMinimumSets(chooseFromExercises: Exercise[]): number {
        if (chooseFromExercises.length === 0) {
            return 0; // Return null if there are no exercises
        }

        let minSets = chooseFromExercises[0].sets;

        for (const exercise of chooseFromExercises) {
            if (exercise.sets < minSets) {
                minSets = exercise.sets;
            }
        }

        return minSets;
    }

	// Utils to create Workout
	private getWarmUForWorkout(workoutType: string): Exercise[] {
		// 25% of the time, you do yoga as a warmup
		if(Math.random() < YOGA_CHANCE){
			const index = getRandomInt(0, YOGA_WORKOUT.length -1)
			// const yoga = new Exercise("yoga",0,0,"",0, YOGA_WORKOUT[index])
			const yoga = new Exercise("yoga", 0, "", 0, 0, 0, 0, YOGA_WORKOUT[index], false, false, false, true)
			return [yoga];
		}

		return WORKOUT_WARMUP_MAP[workoutType] || [];
	}

		
	private getMotivationalNote() {
		const imagePath = this.db.getMotivationalImage();
		const fileName = path.basename(imagePath);
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
		return `![Motivation](${imagePath})\n\n${message}\n`;
	}
}