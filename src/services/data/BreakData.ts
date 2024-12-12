import * as fs from 'fs';
import { BREAK, BREAK_DATA_PATH } from "utils/Constants";
import { getRandomInt, getTodayLocalDate } from "utils/AlgorithmUtils";
import { Workout } from 'models/Workout';

export class BreakData {
    private dataPath: string;
    private breaks: Array<Workout> = [];

    constructor(dirPath: string) {
        this.dataPath = dirPath + BREAK_DATA_PATH;
        this.ensureDirectoryExists(dirPath);
        this.ensureFileExists();
        this.convertDataToBreaks();
    }

    getAllBreaks() {
        return this.breaks;
    }

    getRandomBreakWorkout() {
        const index = getRandomInt(0, this.breaks.length - 1);
        return this.breaks[index];
    }

    updateBreaks(breaks: Workout[]) {
        // Create new Workout instances to avoid reference issues
        this.breaks = breaks.map((workout) => new Workout(
            BREAK,
			getTodayLocalDate(),
			workout.note,
			false,
			false,
			[],
			[]
        ));
    }

    private ensureDirectoryExists(dirPath: string) {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
    }

    private ensureFileExists() {
        if (!fs.existsSync(this.dataPath)) {
            fs.writeFileSync(this.dataPath, JSON.stringify([], null, 2), 'utf8');
        }
    }


    saveBreak() {
        const notes = this.breaks.map((workout) => workout.note);
        const updatedData = JSON.stringify(notes, null, 2);
        fs.writeFileSync(this.dataPath, updatedData, 'utf8');
    }

    private convertDataToBreaks() {
        const rawData = fs.readFileSync(this.dataPath, 'utf8');
        const parsedData = JSON.parse(rawData);

        parsedData.forEach((rawBreak: any) => {
            const workout = new Workout(
                BREAK,
                getTodayLocalDate(),
                rawBreak,
                false,
                false,
                [],
                []
            );
            this.breaks.push(workout);
        });
    }
}
