import { Exercise } from "./Exercise";

export class Workout {
  workoutType: string;
  date: Date;
  isCompleted: boolean;
  isSuccess: boolean;
  note: string;
  exercises: Exercise[];
  warmUps: Exercise[];

  constructor(workoutType: string, date: Date, note = "", isCompleted = false, isSuccess = false, warmUps: Exercise[], exercises: Exercise[] = []) {
    this.workoutType = workoutType;
    this.date = date;
    this.isCompleted = isCompleted;
    this.isSuccess = isSuccess;
    this.note = note;
    this.warmUps = warmUps;
    this.exercises = exercises;
  }
  
  // Check if two workouts are equal
  equals(otherWorkout: Workout): boolean {
    return this.workoutType === otherWorkout.workoutType &&
           this.date.getTime() === otherWorkout.date.getTime() &&
           this.isCompleted === otherWorkout.isCompleted &&
           this.isSuccess === otherWorkout.isSuccess &&
           this.note === otherWorkout.note &&
           JSON.stringify(this.exercises) === JSON.stringify(otherWorkout.exercises) &&
           JSON.stringify(this.warmUps) === JSON.stringify(otherWorkout.warmUps);
  }

  // Markdown representation (unchanged)
  toMarkdown() {
    let result = ``;

    if (this.note) {
      result += `\n${this.note}\n\n`;
    }
    this.warmUps.forEach(warmUp => {
      result += `${warmUp.toMarkdownWarmUp()}\n`;
    });

    if (this.workoutType === "cardio") {
      this.exercises.forEach(exercise => {
        result += `\n\n# ${exercise.toMarkdownCardio()}`;
      });
      result += `\n\n`;
    } else {
      this.exercises.forEach(exercise => {
        result += `${exercise.toMarkdown()}\n`;
      });
    }
    return result;
  }
}
