import {Exercise} from "../models/Exercise";

export const REHAB = [
    new Exercise(
        "Shoulder Rehab - Forward", 0, 3, "10-12", 30, 30, 10, 0, "", false, false, false
    ),
    new Exercise(
        "Shoulder Rehab - Full Side", 0, 3, "10-12", 30, 30, 10, 0, "", false, false, false
    ),
    new Exercise(
        "Shoulder Rehab - Ground Twist", 0, 3, "10-12", 30, 30, 10, 0, "", false, false, false
    )
];

export const ARMS_WARM_UP = [
    new Exercise(
        "Knee Push Up", 0, 2, "12-15", 30, 30, 10, 0, "", false, false, false
    ),
    new Exercise(
        "Easy Peasy Curl", 10, 1, "10-12", 30, 30, 10, 0, "", false, false, false
    ),
    new Exercise(
        "Easy Peasy Curl", 20, 1, "10-12", 30, 30, 10, 0, "", false, false, false
    )
];

export const ABS_WARM_UP = [
    new Exercise(
        "Twist in place", 0, 1, "12-15", 30, 30, 10, 0, "", false, false, false
    )
];

export const LEGS_WARM_UP = [
    new Exercise(
        "Deep Squat Holds", 0, 2, "", 30, 30, 10, 0, "", false, false, false
    ),
    new Exercise(
        "Clockwork Lunge", 0, 1, "10-12", 30, 30, 10, 0, "One set per leg", false, false, false
    )
];

export const CHEST_WARM_UP = [
    new Exercise(
        "Knee Push Up", 0, 1, "12-15", 30, 30, 10, 0, "", false, false, false
    ),
    new Exercise(
        "Plank - Touch Shoulder", 0, 2, "10 each side", 30, 30, 10, 0, "", false, false, false
    )
];

export const BACK_WARM_UP = [
    new Exercise(
        "Band Superman", 0, 1, "10-12", 30, 30, 10, 0, "", false, false, false
    ),
    new Exercise(
        "Band Row", 0, 1, "", 30, 30, 10, 0, "", false, false, false
    )
];
