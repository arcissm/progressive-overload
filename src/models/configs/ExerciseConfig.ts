import { Exercise } from "models/Exercise";


export class ExerciseConfig{
    exercise: Exercise;
    muscles: string[];

    constructor(exercise: Exercise, muscles: string[]){
        this.exercise = exercise
        this.muscles = muscles
    }
  };