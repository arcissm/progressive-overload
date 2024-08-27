import {Exercise} from "./Exercise";

export class Workout {
	workoutType: string;
	date: string;
	exercises: Exercise[];
	warmUps: Exercise[];
	note: string;
	completed: boolean;
	successStreak: number


	constructor(workoutType: string, date: string, warmUps: Exercise[],  exercises: Exercise[] = [], note = "", completed = false, successStreak= 0) {
		this.workoutType = workoutType;
		this.date = date;
		this.warmUps = warmUps
		this.exercises = exercises;
		this.note = note;
		this.completed = completed;
		this.successStreak = successStreak;
	}

	toMarkdown() {
		let result = "";

		if (this.note) {
			result += `\n${this.note}\n\n`;
		}
		this.warmUps.forEach(warmUp => {
			result += `${warmUp.toMarkdownWarmUp()}\n`;
		});
		this.exercises.forEach(exercise => {
			result += `${exercise.toMarkdown()}\n`;
		});
		return result;
	}
}
