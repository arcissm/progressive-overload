import {Exercise} from "./Exercise";

export class Workout {
	workoutType: string;
	date: string;
	exercises: Exercise[];
	note: string;
	completed: boolean;


	constructor(workoutType: string, date: string, exercises: Exercise[] = [], note = "", completed = false) {
		this.workoutType = workoutType;
		this.date = date;
		this.exercises = exercises;
		this.note = note;
		this.completed = completed;

	}

	increaseDifficulty() {
		this.exercises.forEach(exercise => exercise.increaseDifficulty());
	}

	toMarkdown() {
		let result = `### ${this.workoutType}\n`;
		if (this.note) {
			result += `${this.note}\n`;
		}
		this.exercises.forEach(exercise => {
			result += `${exercise.toMarkdown()}\n`;
		});
		return result;
	}
}
