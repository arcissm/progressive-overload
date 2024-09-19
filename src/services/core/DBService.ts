import { Exercise } from "models/Exercise";
import { Muscle } from "models/Muscle";
import { Workout } from "models/Workout";
import { BreakData } from "services/data/BreakData";
import { ExerciseData } from "services/data/ExerciseData";
import { MuscleData } from "services/data/MuscleData";
import { RelationalData } from "services/data/RelationalData";
import { WorkoutData } from "services/data/WorkoutData";
import { isSameDate } from "utils/AlgorithmUtils";
import { BREAK } from "utils/Constants";



export class DBService {
	private workoutData: WorkoutData;
	private muscleData: MuscleData;
	private exerciseData: ExerciseData;
    private relationalData: RelationalData;
	private breakData: BreakData;
	private muscleExerciseMap: Map<Muscle, Exercise[]>;
	private workoutTypeMuscleMap: Map<string, Muscle[]>;


	constructor(dirPath: string) {
		this.muscleData = new MuscleData(dirPath);
        this.exerciseData = new ExerciseData(dirPath);
        this.relationalData = new RelationalData(dirPath);
		this.breakData = new BreakData(dirPath);

		this.initMuscleExerciseMap();
		this.initWorkoutTypeMuscleMap();

		this.workoutData = new WorkoutData(dirPath, this.getWorkoutTypes());
	}
	
	addMuscle(muscle: Muscle){
		this.muscleData.addMuscle(muscle);
	}

	
	// D
	deleteWorkout(workoutType: string , date: Date, index: number){
		this.workoutData.deleteWorkout(workoutType, date, index);
	}

	deleteMuscle(muscle:Muscle){
		this.relationalData.deleteMuscle(muscle.name);
		this.muscleData.deleteMuscle(muscle);
		this.initMuscleExerciseMap();
		this.initWorkoutTypeMuscleMap();
	}


	removeWorkoutType(workoutType: string){
		const workoutTypes = this.relationalData.removeWorkoutType(workoutType)
		this.initWorkoutTypeMuscleMap()
		return workoutTypes
	}	



	// R
	getNormalWorkoutTypes(){
		return this.relationalData.getNormalWorkoutTypes();
	}
	
	getWorkoutTypes(){
		return this.relationalData.getWorkoutTypes();
	}

	getWorkoutsOfType(workoutType: string){
		return this.workoutData.getWorkoutsOfType(workoutType)
	}

	getExerciseById(id: string){
		return this.exerciseData.getExerciseById(id);
	}

	getCoreExercises(muscleName: string){
		const exercies = this.getExercisesForMuscle(muscleName);
		if(exercies == null) {
			return [];
		} else{
			return exercies.filter(ex => ex.isCore)
		}
	}

	getMuscles(){
		return this.muscleData.getMuscles()
	}

	getMusclesForWorkoutType(workoutType: string) {
		if(this.workoutTypeMuscleMap.has(workoutType)){
			return this.workoutTypeMuscleMap.get(workoutType)
		}
		return null;
	}

	getExercisesForMuscle(muscleName: string) {
		for (let [muscle, exercises] of this.muscleExerciseMap.entries()) {
			if (muscle.name === muscleName) {
				return exercises;
			}
		}
		return null; 
	}
	
	getUnlockedExercisesForMuscle(muscleName: string){
		const exercises = this.getExercisesForMuscle(muscleName);
   		 return exercises ? exercises.filter(exercise => exercise.isUnlocked) : [];
	}

	getLastTwoWorkoutsWithMuscle(muscleName: string): Workout[] {
		const workoutTypes = this.relationalData.getWorkoutsForMuscle(muscleName);
		const workouts: Workout[] = [];
	
		workoutTypes.forEach((type: string) => {
			const lastTwoWorkouts = this.workoutData.getLast2WorkoutsOfType(type);
			workouts.push(...lastTwoWorkouts);
		});

		// if a muscle appears in 2 workout types, there might be more than 2 workouts in this list
		// we want the most recent 2 regardles of type
		const sortedWorkouts = workouts.sort((a, b) => b.date.getTime() - a.date.getTime());
		return sortedWorkouts.slice(0, 2);
	}

	
	getMotivationalImage(){
		return this.workoutData.getMotivationalImage();
	}

	
	// BREAK FUNCTIONS
	// could be optimized by putting the logic inside workoutData
	countCompletedWorkouts(){
		return this.workoutData.getCompletedWorkouts().length;
	}
    
	countCompletedWorkoutsInPeriod(numberWeeks: number){
		let completedWorkoutsCount = 0;
		const twoWeeksAgo = new Date();
		twoWeeksAgo.setDate(twoWeeksAgo.getDate() - (numberWeeks * 7));


		this.workoutData.getCompletedWorkouts().forEach(workout =>{
			if(workout.date >= twoWeeksAgo){
				completedWorkoutsCount++;
			}
		})
		
		return completedWorkoutsCount;
	}

	getRandomBreakWorkout(){
		const breakWorkout = this.breakData.getRandomBreakWorkout();
		this.workoutData.addWorkout(breakWorkout)
		return breakWorkout;
	}


	// U
	updateMuscle(oldMuscle: Muscle, newMuscle:Muscle){
		this.relationalData.updateMuscle(oldMuscle.name, newMuscle.name)
		this.muscleData.updateMuscle(oldMuscle, newMuscle)
		this.initMuscleExerciseMap();
		this.initWorkoutTypeMuscleMap();
	}

	updateExercises(){
		this.exerciseData.saveExercises()
	}

	updateWorkouts(){
		this.workoutData.saveWorkouts();
	}
	
	addWorkout(workout: Workout){
		this.workoutData.addWorkout(workout)
	}

	addWorkoutType(workoutType: string, muscles: Muscle[]) {
		const muscleNames = muscles.map(muscle => muscle.name);
		const workoutTypes = this.relationalData.addWorkoutType(workoutType, muscleNames)
		this.initWorkoutTypeMuscleMap();
		return workoutTypes
	}
	  




	// init
	private initMuscleExerciseMap(){
		this.muscleExerciseMap = new Map();
		const stringMap = this.relationalData.muscleExerciseMap;

		stringMap.forEach((exStringListg, muscleString) => {
			const muscle = this.muscleData.getMuscleByName(muscleString);
			if(muscle == null){
				return
			}

			const exercises: Array<Exercise> = [];
			exStringListg.forEach(exString => {
				const exercise = this.exerciseData.getExerciseById(exString);
				if(exercise == undefined){
					return;
				}
				exercises.push(exercise)
			})

			this.muscleExerciseMap.set(muscle, exercises);
		});
	}

	private initWorkoutTypeMuscleMap(){
		this.workoutTypeMuscleMap = new Map();
		const stringMap = this.relationalData.workoutMuscleMap;

		stringMap.forEach((muscleStringList, workoutType) => {

			const muscles: Array<Muscle> = [];
			muscleStringList.forEach(muscleString => {
				const muscle = this.muscleData.getMuscleByName(muscleString);
				if(muscle == null){
					return
				}
				muscles.push(muscle)
			})

			this.workoutTypeMuscleMap.set(workoutType, muscles);
		});
	}
}