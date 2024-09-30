import { ExerciseConfig } from "models/configs/ExerciseConfig";
import { Exercise } from "models/Exercise";
import { Muscle } from "models/Muscle";
import { Workout } from "models/Workout";
import { BreakData } from "services/data/BreakData";
import { ExerciseData } from "services/data/ExerciseData";
import { MuscleData } from "services/data/MuscleData";
import { RelationalData } from "services/data/RelationalData";
import { VariationData } from "services/data/VariationData";
import { WorkoutData } from "services/data/WorkoutData";
import { TreeNode } from "utils/data-structure/TreeNode";



export class DBService {
	private workoutData: WorkoutData;
	private muscleData: MuscleData;
	private exerciseData: ExerciseData;
    private relationalData: RelationalData;
	private breakData: BreakData;
	private variationData: VariationData
	private muscleExerciseMap: Map<Muscle, Exercise[]>;
	private workoutTypeMuscleMap: Map<string, Muscle[]>;
	private exerciseConfigs: ExerciseConfig[];

	constructor(dirPath: string) {
		this.muscleData = new MuscleData(dirPath);
        this.exerciseData = new ExerciseData(dirPath);
        this.relationalData = new RelationalData(dirPath);
		this.breakData = new BreakData(dirPath);
		this.variationData = new VariationData(dirPath);

		this.initMuscleExerciseMap();
		this.initWorkoutTypeMuscleMap();
		this.initExerciseConfig();

		this.workoutData = new WorkoutData(dirPath, this.getWorkoutTypes());
	}


	getVariations(){
		return this.variationData.variations
	}

	setVariationForExercise(exerciseName: string, data: string) {
		const id = exerciseName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
		const exercise = this.exerciseData.getExerciseById(id)

		if(exercise){
			exercise.variation = data
			this.updateExercises()
		}
	}

	getVariationForExercise(exerciseName: string){
		const id = exerciseName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
		const exercise = this.exerciseData.getExerciseById(id)
		if(exercise){
			return exercise.variation;
		}
		return null
	}

	updateExerciseForVariation(oldExerciseName: string, newExerciseName: string){
		this.variationData.updateVariationData(oldExerciseName, newExerciseName)
		this.variationData.saveVariations()
		return this.variationData.variations;
	}

	addNode(exerciseName: string, node: TreeNode<string>){
		const variations = this.variationData.addNode(exerciseName, node)
		this.variationData.saveVariations()
		return variations;
	}

	removeNode(exerciseName: string, node: TreeNode<string>){
		const variations = this.variationData.removeNode(exerciseName, node)
		this.variationData.saveVariations()
		return variations;
	}

	updateVariationName(exerciseName: string, oldValue: string, newValue: string) {
		const variations = this.variationData.updateVariationName(exerciseName, oldValue, newValue);
		this.variationData.saveVariations()
		return variations;
	}

	addTree(){
		const variations = this.variationData.addTree();
		this.variationData.saveVariations()
		return variations;
	}


	// WORKOUT
	getMotivationalImage(){
		return this.workoutData.getMotivationalImage();
	}

	updateWorkouts(){
		this.workoutData.saveWorkouts();
	}

	deleteWorkout(workoutType: string , date: Date, index: number){
		this.workoutData.deleteWorkout(workoutType, date, index);
	}
	
	addWorkout(workout: Workout){
		this.workoutData.addWorkout(workout)
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




	// MUSCLES 
	updateMuscles(){
		this.muscleData.saveMuscles()
	}

	addMuscle(muscle: Muscle){
		this.muscleData.addMuscle(muscle);
	}


	updateMuscle(oldMuscle: Muscle, newMuscle:Muscle){
		this.relationalData.updateMuscle(oldMuscle.name, newMuscle.name)
		this.muscleData.updateMuscle(oldMuscle, newMuscle)
		this.initMuscleExerciseMap();
		this.initWorkoutTypeMuscleMap();
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


	deleteMuscle(muscle:Muscle){
		this.relationalData.deleteMuscle(muscle.name);
		this.muscleData.deleteMuscle(muscle);
		this.initMuscleExerciseMap();
		this.initWorkoutTypeMuscleMap();
	}




	// EXERCISES
	getExerciseById(id: string){
		return this.exerciseData.getExerciseById(id);
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


	// TODO: CHANGE THIS
	getCoreExercises(muscleName: string){
		const muscle = this.muscleData.getMuscleByName(muscleName)
		if(muscle == null) {
			return [];
		} else{
			const exerciseIds = muscle.coreExercises;
			const coreExercises: (Exercise)[] = []
			exerciseIds.forEach(id => {
				const exercise = this.exerciseData.getExerciseById(id)
				if(exercise){
					coreExercises.push(exercise)
				}
			})
			return coreExercises
		}
	}


	getExercises(){
		return this.exerciseData.getAllExercises()
	}
	
	getExerciseConfigs(){
		return this.exerciseConfigs;
	}

	getMuscleExerciseMap(){
		return this.relationalData.muscleExerciseMap;
	}

	
	updateExercises(){
		this.exerciseData.saveExercises()
		this.initExerciseConfig()

	}

	saveExerciseConfigs(oldConfig:ExerciseConfig, newConfig:ExerciseConfig) {
		const oldId = oldConfig.exercise.id
		const newId = newConfig.exercise.id

		this.saveExercise(oldId, newConfig.exercise)
		this.updateExercises()


		this.saveExerciseMuscleRelation(oldId, oldConfig.muscles, newId, newConfig.muscles)
		this.relationalData.saveMuscleExerciseMap();
		this.initMuscleExerciseMap();

		this.initExerciseConfig();
		return this.exerciseConfigs;
	}

	addExerciseConfig(newExercise: Exercise){
		this.exerciseData.addExercise(newExercise)
		this.updateExercises()
		return this.exerciseConfigs
	}

	deleteExerciseConfig(id:string){
		this.exerciseData.deleteExercise(id);
		this.updateExercises()
		
		this.relationalData.deleteExercise(id);
		this.relationalData.saveMuscleExerciseMap();
		this.initMuscleExerciseMap();
		this.initExerciseConfig()
		return this.exerciseConfigs
	}

	private saveExercise(oldId:string, newExercise:Exercise){
		const exercise = this.exerciseData.getExerciseById(oldId)
		if (exercise) {
			exercise.name = newExercise.name;
			exercise.sets = newExercise.sets;
			exercise.reps = newExercise.reps;
			exercise.weight = newExercise.weight;
			exercise.time = newExercise.time;
			exercise.weightIncrease = newExercise.weightIncrease;
			exercise.note = newExercise.note;
			exercise.isUnlocked = newExercise.isUnlocked;
			exercise.nameToId();
		}
		this.updateExercises()
	}

	private saveExerciseMuscleRelation(oldId:string, oldMuscles:string[], newId:string, newMuscles:string[]){

		const musclesToRemove = oldMuscles.filter(item => !newMuscles.includes(item));
		const musclesToAdd = newMuscles.filter(item => !oldMuscles.includes(item));

		// Add Old exercise Id to muscles
		musclesToAdd.forEach(muscle => {
			if (this.relationalData.muscleExerciseMap.has(muscle)) {
				const exerciseIds = this.relationalData.muscleExerciseMap.get(muscle);
				if (exerciseIds && !exerciseIds.includes(oldId)) {
					exerciseIds.push(oldId);
				}
			} else {
				// If the muscle is not found, create a new entry with the oldId as the first exercise
				this.relationalData.muscleExerciseMap.set(muscle, [oldId]);
			}
		});

		// Remove Old exercise Id from muscles if necessary
		musclesToRemove.forEach(muscle => {
			if (this.relationalData.muscleExerciseMap.has(muscle)) {
				const exerciseIds = this.relationalData.muscleExerciseMap.get(muscle);
				if (exerciseIds) {
					const index = exerciseIds.indexOf(oldId);
					if (index > -1) {
					exerciseIds.splice(index, 1);
					// If no exercise IDs are left for this muscle, remove the muscle entry entirely
					if (exerciseIds.length === 0) {
						this.relationalData.muscleExerciseMap.delete(muscle);
					}
					}
				}
			}
		})

		// If name changed -> update the ID in the map
		if (newId !== oldId) {
			newMuscles.forEach((muscle: string) => {
				const exercises = this.relationalData.muscleExerciseMap.get(muscle);
				if (exercises) {
					const index = exercises.indexOf(oldId);
					if (index !== -1) {
						exercises[index] = newId;
					}
					this.relationalData.muscleExerciseMap.set(muscle, exercises);
				}
			});
		}
	}
	



	// WORKOUT TYPE
	getNormalWorkoutTypes(){
		return this.relationalData.getNormalWorkoutTypes();
	}
	
	getWorkoutTypes(){
		return this.relationalData.getWorkoutTypes();
	}

	getWorkoutsOfType(workoutType: string){
		return this.workoutData.getWorkoutsOfType(workoutType)
	}

	getWorkoutTypeMuscleArray() {
		const map = this.relationalData.workoutMuscleMap;
		const workoutMuscleArray: [string, string[]][] = [];
		map.forEach((value, key) => {
			workoutMuscleArray.push([key, value]);
		});
		return workoutMuscleArray;
	}

	updateWorkoutTypeMuscleMap(workoutMuscleArray:  [string, string[]][]){
		const workoutMuscleMap: Map<string, string[]> = new Map(workoutMuscleArray);
		this.relationalData.workoutMuscleMap = workoutMuscleMap;
		this.relationalData.saveWorkoutMuscleMap()
		this.initWorkoutTypeMuscleMap()
	}

	
	addWorkoutType() {
		this.relationalData.addWorkoutType()
		this.initWorkoutTypeMuscleMap()
	}

	removeWorkoutType(workoutType: string){
		this.relationalData.removeWorkoutType(workoutType)
		this.initWorkoutTypeMuscleMap()
	}	





	// INIT
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

	initExerciseConfig(){
		this.exerciseConfigs = []
		const exercises = this.exerciseData.getAllExercises()
		const exerciseMuscleMap = this.getExerciseMuscleMap()
		exercises.forEach(ex => {
			const config = new ExerciseConfig(ex, exerciseMuscleMap.get(ex.id) || [])
			this.exerciseConfigs.push(config)
		})
	}


	private getExerciseMuscleMap() {
		const muscleExerciseMap = this.relationalData.muscleExerciseMap;
		const reverseMap = new Map<string, string[]>();
		muscleExerciseMap.forEach((exercises, muscle) => {
		  exercises.forEach(exercise => {
			if (!reverseMap.has(exercise)) {
			  reverseMap.set(exercise, []);
			}
			reverseMap.get(exercise)!.push(muscle); // Use non-null assertion operator (!)
		  });
		});
	  
		return reverseMap;
	}
}