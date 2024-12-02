import * as fs from 'fs';
import { YOGA_DATA_PATH } from "utils/Constants";
import { Workout } from 'models/Workout';
import { Yoga } from 'models/Yoga';

export class YogaData {
    private dataPath: string;
    yoga:Yoga;

    constructor(dirPath: string) {
        this.dataPath = dirPath + YOGA_DATA_PATH;
        this.convertDataToYoga(this.dataPath);
    }

    updateYoga(breaks: Workout[]) {
        
    }

    saveYoga() {
        const updatedData = JSON.stringify(this.yoga, null, 2);
        fs.writeFileSync(this.dataPath, updatedData, 'utf8');
    }

    private convertDataToYoga(dataPath: string) {
        const rawData = fs.readFileSync(dataPath, 'utf8');
        const parsedData = JSON.parse(rawData);
        this.yoga = new Yoga(Number(parsedData.chance), parsedData.urls)
  
    }
}
