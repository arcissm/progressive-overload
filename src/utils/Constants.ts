import * as path from 'path';

export const DATA_PATH = path.join("/", ".obsidian", "plugins", "progressive-overload", "data");
export const WORKOUT_DATA_PATH = path.join(DATA_PATH, "workouts.json");
export const EXERCISE_DATA_PATH = path.join(DATA_PATH, "exercises.json");
export const MUSCLE_DATA_PATH = path.join(DATA_PATH, "muscles.json");
export const MUSCLE_EXERCISE_DATA_PATH = path.join(DATA_PATH, "muscle-exercise.json");
export const WORKOUT_MUSCLE_DATA_PATH = path.join(DATA_PATH, "workout-muscle.json");
export const BREAK_DATA_PATH = path.join(DATA_PATH, "break.json");
export const VARIATION_DATA_PATH = path.join(DATA_PATH, "variations.json");
export const YOGA_DATA_PATH = path.join(DATA_PATH, "yoga.json");

export const MINIMUM_SUCCESS_TO_UNLOCK_NEW_EXERCISE = 3;
export const MINIMUM_MUSCLE_SUCCESS_STREAK = 2;

export const NEW_EXERCISE_NAME = "New Exercise";
export const NEW_EXERCISE_ID = "new-exercise";
export const ERROR_MESSAGE_NOT_UNIQUE_NAME = "NOPE! Come Up with a Unique Name for your Exercise.";


export const NEW_VARIAITON = "New Variations";
export const BREAK = "break"
export const REPS = ["N/A", "5", "6-8", "8-10", "10-12", "12-15", "15-20", "max"];
export const PRGRESSIVE_OVERLOAD_REPS = ["5", "6-8", "8-10", "10-12"];


export const CONFIG_TABS = [
	{ key: 'workouts', label: 'Workout Types' },
	{ key: 'muscles', label: 'Muscles' },
	{ key: 'exercises', label: 'Exercises' },
	{ key: 'variations', label: 'Variations' },
	{ key: 'warmups', label: 'Warm Ups' },
	{ key: 'breaks', label: 'Punishments' }
  ];