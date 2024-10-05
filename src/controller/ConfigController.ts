import { ExerciseConfig } from "models/configs/ExerciseConfig";
import { Exercise } from "models/Exercise";
import { Muscle } from "models/Muscle";
import { App } from "obsidian";
import { DBService } from "services/core/DBService";
import { PluginSettings } from "services/settings/Settings";
import { TreeNode } from "utils/data-structure/TreeNode";

export class ConfigController {

    private app: App;
    private db: DBService;

	
	constructor(app: App, settings: PluginSettings ) {
		this.app = app;

        // @ts-ignore
        const dirPath = app.vault.adapter.basePath;
        this.db = new DBService(dirPath);
	}


	// WORKOUT TYPE
	getWorkoutTypeMuscleArray() {
		return this.db.getWorkoutTypeMuscleArray();
	}

	updateWorkoutTypeMuscleMap(workoutMuscleArray:  [string, string[]][]){
		this.db.updateWorkoutTypeMuscleMap(workoutMuscleArray)
	}

	addWorkoutType(){
		this.db.addWorkoutType();
	}

	removeWorkoutType(workoutType: string){
		this.db.removeWorkoutType(workoutType)
	}





	// MUSCLES
	addMuscle(muscle: Muscle){
		this.db.addMuscle(muscle)
	}

	getMuscles(){
		return this.db.getMuscles();
	}


	updateMuscle(oldMuscle: Muscle, newMuscle:Muscle){
		this.db.updateMuscle(oldMuscle, newMuscle)
	}

	deleteMuscle(muscle:Muscle){
		this.db.deleteMuscle(muscle)
	}





	// EXERCISES
	getExercises(){
		return this.db.getExercises();
	}

	getExerciseConfigs(){
		return this.db.getExerciseConfigs();
	}
	
	getMuscleExerciseMap(){
		return this.db.getMuscleExerciseMap();
	}

	saveExerciseConfigs(oldConfig:ExerciseConfig, newConfig:ExerciseConfig) {
		return this.db.saveExerciseConfigs(oldConfig, newConfig);
	}

	deleteExerciseConfig(id:string){
		return this.db.deleteExerciseConfig(id)
	}

	addExerciseConfig(newExercise: Exercise){
		return this.db.addExerciseConfig(newExercise)
	}





    // VARIATIONS
	getVariations(){
		return this.db.getVariations()
	}

	getVariationForExercise(exerciseName: string){
		return this.db.getVariationForExercise(exerciseName);
	}

	setVariationForExercise(exerciseName: string, data: string) {
		this.db.setVariationForExercise(exerciseName, data)
	}

	updateExerciseForVariation(oldExerciseName: string, newExerciseName: string){
		return this.db.updateExerciseForVariation(oldExerciseName, newExerciseName)
	}

	addNode(exerciseName: string, node: TreeNode<string>){
		return this.db.addNode(exerciseName, node)
	}
	removeNode(exerciseName: string, node: TreeNode<string>){
		return this.db.removeNode(exerciseName, node)
	}

	updateVariationName(exerciseName: string, oldValue: string, newValue: string) {
		return this.db.updateVariationName(exerciseName, oldValue, newValue)
	}
	addTree(){
		return this.db.addTree()
	}

	deleteTree(root: string){
		return this.db.deleteTree(root)
	}
}