import * as fs from 'fs';
import { BREAK, BREAK_DATA_PATH } from "utils/Constants";
import { getRandomInt, getTodayLocalDate } from "utils/AlgorithmUtils";
import { Workout } from 'models/Workout';

export class BreakData {
    private dataPath: string;
    private breaks: Array<Workout> = [];

    constructor(dirPath: string) {
        this.dataPath = dirPath + BREAK_DATA_PATH;
        this.convertDataToBreaks(this.dataPath);
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

    saveBreak() {
        const notes = this.breaks.map((workout) => workout.note);
        const updatedData = JSON.stringify(notes, null, 2);
        fs.writeFileSync(this.dataPath, updatedData, 'utf8');
    }

    private convertDataToBreaks(dataPath: string) {
        const rawData = fs.readFileSync(dataPath, 'utf8');
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
