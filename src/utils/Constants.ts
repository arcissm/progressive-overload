import {ABS_WARM_UP, ARMS_WARM_UP, BACK_WARM_UP, CHEST_WARM_UP, LEGS_WARM_UP, REHAB} from "./WarmUps";
import {Exercise} from "../models/Exercise";


export const WORKOUT_DATA_PATH = "/.obsidian/plugins/obsidian-but-better/src/data/workouts.json";
export const EXERCISE_DATA_PATH = "/.obsidian/plugins/obsidian-but-better/src/data/exercises.json";
export const BREAK_DATA_PATH = "/.obsidian/plugins/obsidian-but-better/src/data/break.json";
export const IMAGES_DIR = "/.obsidian/plugins/obsidian-but-better/assets/images/motivation";

export const YOGA_CHANCE = 0.25;
export const MINIMUM_SUCCESS_TO_UNLOCK_NEW_EXERCISE = 3;
export const MAXIMUM_ALLOWED_MUSCLE_FAILURES = 4;
export const MINIMUM_MUSCLE_SUCCESS_STREAK = 2;
export const MAXIMUM_BREAK_DAYS = 11;
export const NUMBER_TIMES_WORKOUT_PER_WEEK = 4;

// WORKOUT TYPE
export const ARMS = "arms";
export const LEGS = "legs";
// TO BE ADDED TO OPTIONS
export const FULLBODY = "fullbody"
export const BREAK = "break"


const BICEPS = "biceps";
const TRICEP = "tricep";
const FOREARM = "forearm";
const FRONT_DELT = "front delt";
const SIDE_DELT = "side delt";
const REAR_DELT = "rear delt";
const CHEST = "chest";
const BACK = "back";
const QUADS = "quads";
const HAMSTRING = "hamstring";
const ABS = "abs";
const CARDIO = "cardio";

export const WORKOUT_TYPES = [LEGS, ABS, BACK, CARDIO];

export const MUSCLE_GROUP = [BICEPS, TRICEP, FOREARM, FRONT_DELT, SIDE_DELT, REAR_DELT, CHEST, BACK, QUADS, HAMSTRING, ABS, CARDIO]

// Define the mapping between workout types and muscle groups
// TODO: Make configurable
export const WORKOUT_MUSCLE_MAP: Record<string, string[]> = {
	abs: [ABS], // Example mapping
	fff: [CARDIO],
	arms: [BICEPS, TRICEP, FOREARM],
	legs: [QUADS, HAMSTRING, FRONT_DELT],
	chest: [CHEST, FRONT_DELT],
	back: [BACK, QUADS],
	cardio: [CARDIO]
};

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

