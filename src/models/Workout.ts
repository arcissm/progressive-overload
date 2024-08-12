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

	progressiveOverload(){
		// update date to today
		this.exercises.forEach(exercise => exercise.increaseDifficulty());

	}

	toMarkdown() {
		let result = "";
		if (this.note) {
			result += `\n*${this.note}*\n\n`;
		}
		this.exercises.forEach(exercise => {
			result += `${exercise.toMarkdown()}\n`;
		});
		return result;
	}

	cloneWithTodayDate(): Workout {
		// Create a new Workout instance with the current date
		return new Workout(
			this.workoutType,
			new Date().toISOString().split('T')[0], // Set date to today
			this.exercises.map(exercise => Object.assign(Object.create(Object.getPrototypeOf(exercise)), exercise)), // Clone each exercise
			this.note,
			this.completed
		);
	}
}
