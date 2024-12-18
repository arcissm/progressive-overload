import {Exercise} from "../../models/Exercise";
import {Muscle} from "../../models/Muscle";
import {Workout} from "../../models/Workout";
import { DBService } from "./DBService";
import { getRandomInt, getTodayLocalDate, isSameDate } from "utils/AlgorithmUtils";
import { PRGRESSIVE_OVERLOAD_REPS } from "utils/Constants";
import { SPECIAL } from "utils/ExerciseConstants";
import { SettingsController } from "controller/SettingsController";

export class WorkoutService {
	private db: DBService;
	private settings: SettingsController;

	constructor(db: DBService, settings: SettingsController) {
		this.db = db;
		this.settings = settings;
	}



	deleteWorkout(workoutType: string , date: Date, index: number){
		this.db.deleteWorkout(workoutType, date, index);
	}

	createWorkout(workoutType: string){
		const muscles = this.db.getMusclesForWorkoutType(workoutType);
		if (muscles == null){return null}

		const workoutExercises = this.createWorkoutExercises(muscles)

		const workout = new Workout(
			workoutType,
			getTodayLocalDate(),
			"",
			false,
			false,
			this.getWarmUp(muscles),
			workoutExercises) 

		this.db.addWorkout(workout)
		return workout
	}


	getWorkoutFromNote(workoutType: string, date: Date, index: number) {
		const workoutsOfType = this.db.getWorkoutsOfType(workoutType);

		if (workoutsOfType) {
			const filteredWorkouts = workoutsOfType.filter(workout => isSameDate(workout.date, date));
			if (index >= 0 && index < filteredWorkouts.length) {
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
			}
		}

		this.db.saveExercises()
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

		this.db.saveExercises()
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
	// private useSteroids(muscles: Array<Muscle>){

	// 	if(muscles == null){
	// 		return;
	// 	}

	// 	muscles.forEach(muscle => {
	// 		const lastTwoWorkouts = this.db.getLastTwoWorkoutsWithMuscle(muscle.name);
			
	// 		let isCompleted = true;
	// 		let isSuccess = true;

	// 		lastTwoWorkouts.forEach(workout => {
	// 			isCompleted = isCompleted && workout.isCompleted
	// 			isSuccess = isSuccess && workout.isSuccess
	// 		});

	// 		if(isCompleted && isSuccess){
	// 			this.chillOnTheRoids(muscle)
	// 		}
	// 		if(isCompleted && !isSuccess){
	// 			this.addCreatine(lastTwoWorkouts, muscle);
	// 		}
	// 	})

	// }

	
	// private chillOnTheRoids(muscle: Muscle){
	// 	if(muscle.boosted > 0){
	// 		muscle.boosted--;
	// 		muscle.maxSets--;
	// 		muscle.minSets--;
	// 		return
	// 	}

	// 	const exercises = this.db.getExercisesForMuscle(muscle.name)
	// 	if(exercises == null){
	// 		return
	// 	}

	// 	exercises.forEach(exercise => {
	// 		if(exercise.boosted > 0){
	// 			exercise.boosted--;
	// 			exercise.sets--;
	// 			return
	// 		}
	// 	})
	// }

	// private addCreatine(lastTwoWorkouts: Array<Workout>, muscle: Muscle) {
	// 	// you can't fail if you have done less than 2 of these workouts
	// 	if (lastTwoWorkouts.length < 2) {
	// 		return;
	// 	}
	
	// 	const w1FailedExercises = this.getFailedExercises(lastTwoWorkouts[0]);
	// 	const w2FailedExercises = this.getFailedExercises(lastTwoWorkouts[1]);
	
	// 	if (w1FailedExercises.length > 0 && w2FailedExercises.length > 0) {
	// 		const w2FailedIds = new Set(w2FailedExercises.map(exercise => exercise.id));
			
	// 		const commonExercises = w1FailedExercises.filter(exercise => w2FailedIds.has(exercise.id));
			
	// 		if (commonExercises.length > 0) {
	// 			commonExercises.forEach(exercise =>{
	// 				exercise.sets++;
	// 				exercise.boosted++;
	// 			})
	// 		}else{
	// 			muscle.boosted++;
	// 			muscle.maxSets++;
	// 			muscle.minSets++;
	// 		}
	// 	}
	// }
	
	
	// private getFailedExercises(workout: Workout){
	// 	const failedExercises: Array<Exercise> = []
	// 	workout.exercises.forEach(exercise => {
	// 		if(!exercise.isSuccess){
	// 			failedExercises.push(exercise)
	// 		}
	// 	})
	// 	return failedExercises;
	// }


	private createWorkoutExercises(muscles: Muscle[]){
		// this.useSteroids(muscles);
		this.db.updateMuscles();

		const exercises = this.createExercises(muscles) // returns a deepCopied subset of Exercises list from DB (because we edit the exercises so we can't use the direct reference)
		exercises.forEach(exercise =>{
			this.progressiveOverload(exercise)
			this.db.updateExercise(exercise)
		})

		this.db.saveExercises();

		// fun stuff that shouldn't be saved
		this.makeExtraSetsFun(exercises)
		this.tasteTestNextVariation(exercises)
		
		return exercises;
	}

	private progressiveOverload(exercise: Exercise){
		if(exercise.isSuccess){
			exercise.isSuccess = false;
			exercise.isCompleted = false;

			const nextVariation = this.db.getNextVariation(exercise)
			exercise.progressiveOverload(nextVariation);
		}
	}


	makeExtraSetsFun(exercises:Exercise[]){
		exercises.forEach(exercise => {
			if(exercise.sets > 4){
				const index = getRandomInt(0, SPECIAL.length-1)
				let special = SPECIAL[index]
				if (special.toLowerCase() === "normal"){
					return
				}
				else if (special.toLowerCase().contains("weight")){
					special += exercise.weightIncrease
				}
				exercise.note = `** 1-4 sets**: Normal reps  \n` +
					`> > **5-${exercise.sets} sets**: ${special}\n` +
					`\n` + exercise.note
			}
		})
	}


	// Exercise List
	private createExercises(muscles: Array<Muscle>): Exercise[] {
		const exercises: Map<string, Exercise> = new Map();
	
		muscles.forEach(muscle => {
			// Deep copy because we are going to edit this
			const coreExercises = this.db.getUnlovkedCoreExercises(muscle.name).map(exercise => 
				exercise.clone()
			);
			const chooseFromExercises = this.db.getUnlockedExercisesForMuscle(muscle.name).map(exercise => 
				exercise.clone()
			);
	
			const coreSets = coreExercises.reduce((sum, exercise) => {
				return sum + exercise.sets;
			}, 0);
	
			let totalSets = getRandomInt(muscle.minSets, muscle.maxSets) - coreSets;
	
			const pickedExercises = this.pickExercises(totalSets, coreExercises, chooseFromExercises);
			pickedExercises.forEach(pickedExercise => {
				const existingExercise = exercises.get(pickedExercise.id);
				if(existingExercise){
					existingExercise.sets += pickedExercise.sets;
				} else {
					exercises.set(pickedExercise.id, pickedExercise);
				}
			});
		});
		return Array.from(exercises.values());
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
			const existingExerciseIndex = pickedExercises.findIndex(e => e.id === exercise.id);

			// if exercise already exists in the list, add the sets
			if (existingExerciseIndex !== -1) {
				pickedExercises[existingExerciseIndex].sets += exercise.sets;
			} else {
				pickedExercises.push(exercise); 
			}
			remainingSets -= exercise.sets;
        }

        // Continue picking exercises
        return this.pickExercises(remainingSets, pickedExercises, chooseFromExercises);
    }

	

	private getMinimumSets(chooseFromExercises: Exercise[]): number {
        if (chooseFromExercises.length === 0) {
            return 0;
        }

        let minSets = chooseFromExercises[0].sets;

        for (const exercise of chooseFromExercises) {
            if (exercise.sets < minSets) {
                minSets = exercise.sets;
            }
        }

        return minSets;
    }

	private tasteTestNextVariation(exercises: Exercise[]) {
		const variedExercises = exercises.filter(exercise => exercise.variation);
	
		variedExercises.forEach(exercise => {
			
			if(exercise.sets > 2){
				const nextVariationExercise = exercise.clone();
				nextVariationExercise.id += "_variation"

				let sharedSets = 1;
				if(exercise.sets > 4){
					sharedSets = 2;
					nextVariationExercise.note = ""
				}
				exercise.sets = exercise.sets - sharedSets
				nextVariationExercise.sets = sharedSets
				
				nextVariationExercise.reps = PRGRESSIVE_OVERLOAD_REPS[0]
				nextVariationExercise.variation = this.db.getNextVariation(exercise);
				const index = exercises.findIndex(e => e.id === exercise.id);
				// Insert the next variation right after the original exercise
				if (index !== -1) {
					exercises.splice(index + 1, 0, nextVariationExercise);
				}
			}
		});
	}
	
	private getWarmUp(muscles: Muscle[]): Exercise[] {

		let isCardio = false
		if(muscles.find(muscle => muscle.name === "cardio")){
			isCardio = true
		}
		
		const yoga = this.db.getYoga()
		const urls = yoga

		// 25% of the time, you do yoga as a warmup
		if(Math.random() < this.settings.settings.yogaChance && !isCardio){
			const index = getRandomInt(0, urls.length -1)
			const yoga = new Exercise("yoga", 0, "", 0, 0, 0, "", 0, urls[index], false, false, false,)
			return [yoga];
		}
		else{
			let warmUps: Exercise[] = [];
			muscles.forEach(muscle => {
				warmUps = warmUps.concat(muscle.warmUps); // Concatenate warm-ups from each muscle
			});
			return warmUps;
		}
	}
}