import {ABS_WARM_UP, ARMS_WARM_UP, BACK_WARM_UP, CHEST_WARM_UP, LEGS_WARM_UP, REHAB} from "./WarmUps";
import {Exercise} from "../models/Exercise";


export const WORKOUT_DATA_PATH = "/.obsidian/plugins/obsidian-but-better/src/data/workouts.json";
export const EXERCISE_DATA_PATH = "/.obsidian/plugins/obsidian-but-better/src/data/exercises.json";
export const MUSCLE_DATA_PATH = "/.obsidian/plugins/obsidian-but-better/src/data/muscles.json";
export const MUSCLE_EXERCISE_DATA_PATH = "/.obsidian/plugins/obsidian-but-better/src/data/muscle-exercise.json";
export const WORKOUT_MUSCLE_DATA_PATH = "/.obsidian/plugins/obsidian-but-better/src/data/workout-muscle.json";
export const BREAK_DATA_PATH = "/.obsidian/plugins/obsidian-but-better/src/data/break.json";
export const BREAK_TRACKER_DATA_PATH = "/.obsidian/plugins/obsidian-but-better/src/data/break-tracker.json";
export const VARIATION_DATA_PATH = "/.obsidian/plugins/obsidian-but-better/src/data/variations.json";

export const IMAGES_DIR = "/.obsidian/plugins/obsidian-but-better/assets/images/motivation";

export const YOGA_CHANCE = 0.25;
export const MINIMUM_SUCCESS_TO_UNLOCK_NEW_EXERCISE = 3;
export const MAXIMUM_ALLOWED_MUSCLE_FAILURES = 4;
export const MINIMUM_MUSCLE_SUCCESS_STREAK = 2;
export const MINIMUM_WORKOUT_DAYS_2_WEEKS = 8;

export const BREAK = "break"
export const REPS = ["N/A", "5", "6-8", "8-10", "10-12", "12-15", "15-20", "max"];

export const WORKOUT_WARMUP_MAP: Record<string, Exercise[]> = {
	fff: REHAB, // Example mapping
	abs: [...REHAB, ...ABS_WARM_UP], // Example mapping
	arms: [...REHAB, ...ARMS_WARM_UP],
	legs: [...REHAB, ...LEGS_WARM_UP],
	chest: [...REHAB, ...CHEST_WARM_UP],
	back: [...REHAB, ...BACK_WARM_UP],
};

export const YOGA_WORKOUT: string[] = [
	"https://www.youtube.com/watch?v=iY-rGdoLX_8",
	"https://www.youtube.com/watch?v=lbElK4wUZJA",
	"https://www.youtube.com/watch?v=CJLDkGC4FxM",
	"https://www.youtube.com/watch?v=qYTUGCDj8Y0",
	"https://www.youtube.com/watch?v=D1CBQTCSDvY",
	"https://www.youtube.com/watch?v=eWCe_KE-l5o",
	"https://www.youtube.com/watch?v=Pt3mQT8vsQA",
	"https://www.youtube.com/watch?v=BieNFcV8Uw8",
	"https://www.youtube.com/watch?v=KpN2DkU4DN8"
];

