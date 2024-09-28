import { Exercise } from "./Exercise";
import { Muscle } from "./Muscle";


export class ExerciseConfig{
    exercise: Exercise;
    muscles: string[];

    constructor(exercise: Exercise, muscles: string[]){
        this.exercise = exercise
        this.muscles = muscles
    }
  };