import * as fs from 'fs';
import { MUSCLE_EXERCISE_DATA_PATH, WORKOUT_MUSCLE_DATA_PATH } from "utils/Constants";

export class RelationalData {
	private workoutMuscleDataPath: string;
    private muscleExerciseDataPath: string;
    workoutMuscleMap: Map<string, string[]>;
    muscleExerciseMap: Map<string, string[]>;


	constructor(dirPath: string) {
		this.workoutMuscleDataPath = dirPath + WORKOUT_MUSCLE_DATA_PATH;
        this.muscleExerciseDataPath = dirPath + MUSCLE_EXERCISE_DATA_PATH;
		this.initializeWorkoutMuscleMap(this.workoutMuscleDataPath);
        this.initializeMuscleExerciseMap(this.muscleExerciseDataPath)
	}

    getWorkoutTypes(){
        return Array.from(this.workoutMuscleMap.keys());
    }
    
    getNormalWorkoutTypes() {
        return Array.from(this.workoutMuscleMap.keys()).filter(type => type !== "break");
    }
    

    getMusclesForWorkoutType(workoutType:string) {
        return this.workoutMuscleMap.get(workoutType);
    }

    getWorkoutsForMuscle(muscleName: string): string[] {
        const workouts: string[] = [];
        this.workoutMuscleMap.forEach((muscles, workout) => {
            if (muscles.includes(muscleName)) {
                workouts.push(workout); 
            }
        });
        return workouts;
    }

    getExercisesForMuscle(muscleName: string){
        if(this.muscleExerciseMap.has(muscleName)){
            return this.muscleExerciseMap.get(muscleName)
        }else{
            return []
        }
    }

    updateMuscle(oldMuscleName: string, newMuscleName: string) {
        // Check if the Muscle Exercise contains the old muscle name as a key
        if (this.muscleExerciseMap.has(oldMuscleName)) {
            const exercises = this.muscleExerciseMap.get(oldMuscleName);
            if (exercises) {
                this.muscleExerciseMap.delete(oldMuscleName);
                this.muscleExerciseMap.set(newMuscleName, exercises);
            }
        }

        // Check if the Workout Muscle contains the old muscle name as a key
        this.workoutMuscleMap.forEach((muscleList) => {
            const index = muscleList.indexOf(oldMuscleName);
            if (index !== -1) {
                muscleList[index] = newMuscleName;
            }
        });

        this.saveMuscleExerciseMap()
        this.saveWorkoutMuscleMap()

    }
    
    addWorkoutType(workoutType: string, muscles: string[]){
		const existingMuscles = this.workoutMuscleMap.get(workoutType);
		if (existingMuscles) {
		  this.workoutMuscleMap.set(workoutType, [...existingMuscles, ...muscles]);
		} else {
		  this.workoutMuscleMap.set(workoutType, muscles);
		}
		this.saveWorkoutMuscleMap();
        return this.getWorkoutTypes()
    }

    removeWorkoutType(workoutType: string): string[] {
		this.workoutMuscleMap.delete(workoutType);
		this.saveWorkoutMuscleMap();
		return this.getWorkoutTypes()
	  }

      deleteMuscle(muscleName: string){
        if (this.muscleExerciseMap.has(muscleName)) {
            this.muscleExerciseMap.delete(muscleName);
        }

        this.workoutMuscleMap.forEach((muscleList, workoutName) => {
            const index = muscleList.indexOf(muscleName);
            if (index !== -1) {
                muscleList.splice(index, 1);
                this.workoutMuscleMap.set(workoutName, muscleList);
            }
        });

        this.saveMuscleExerciseMap()
        this.saveWorkoutMuscleMap()
      }
	  

    saveMuscleExerciseMap() {
        // Convert Map to JSON structure
        const mapAsArray = Array.from(this.muscleExerciseMap.entries()).map(([muscle, exercises]) => {
            return {
                muscle: muscle,
                exercises: exercises.map(exercise => ({ name: exercise }))
            };
        });

        // Save the updated JSON back to the file
        fs.writeFileSync(this.muscleExerciseDataPath, JSON.stringify(mapAsArray, null, 2), 'utf8');
    }

    saveWorkoutMuscleMap() {
        // Convert Map to JSON structure
        const mapAsArray = Array.from(this.workoutMuscleMap.entries()).map(([workout, muscles]) => {
            return {
                workout: workout,
                muscles: muscles.map(muscle => ({ name: muscle }))
            };
        });

        console.log(mapAsArray)

        // Save the updated JSON back to the file
        fs.writeFileSync(this.workoutMuscleDataPath, JSON.stringify(mapAsArray, null, 2), 'utf8');
    }

    
    private initializeMuscleExerciseMap(dataPath: string) {
        // Read and parse the JSON file
        const rawData = fs.readFileSync(dataPath, 'utf8');
        const parsedData = JSON.parse(rawData);

        this.muscleExerciseMap = new Map<string, string[]>();

        // Process each muscle from the parsed data
        parsedData.forEach((muscleEntry: any) => {
            const muscleName = muscleEntry.muscle;
            const exerciseNames = muscleEntry.exercises.map((exercise: any) => exercise.name);

            this.muscleExerciseMap.set(muscleName, exerciseNames);
        });
    }

	private initializeWorkoutMuscleMap(dataPath: string) {
        // Read and parse the JSON file
        const rawData = fs.readFileSync(dataPath, 'utf8');
        const parsedData = JSON.parse(rawData);

        this.workoutMuscleMap = new Map<string, string[]>();

        // Process each workout from the parsed data
        parsedData.forEach((workoutEntry: any) => {
            const workoutName = workoutEntry.workout;
            const muscleNames = workoutEntry.muscles.map((muscle: any) => muscle.name);

            this.workoutMuscleMap.set(workoutName, muscleNames);
        });
    }
}
