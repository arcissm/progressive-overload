import * as fs from 'fs';
import * as path from 'path';

export class StringListData {
    private dataPath: string;
    private stringList: string[];

    constructor(dirPath: string) {
        this.dataPath = path.join(dirPath);
        this.loadStringList();
    }

    getStringList() {
        return this.stringList;
    }

    updateStringList(newStringList: string[]) {
        this.stringList = newStringList;
    }

    saveStringList() {
        const updatedData = JSON.stringify(this.stringList, null, 2);
        fs.writeFileSync(this.dataPath, updatedData, 'utf8');
    }

    private loadStringList() {
        this.stringList = [];

        if (fs.lstatSync(this.dataPath).isDirectory()) {
            throw new Error(`Expected a file but found a directory at: ${this.dataPath}`);
        }

        const rawData = fs.readFileSync(this.dataPath, 'utf8');
        const parsedData = JSON.parse(rawData);
        if (Array.isArray(parsedData)) {
            this.stringList = parsedData;
        } else {
            throw new Error('Data format error: Expected an array in the JSON file.');
        }
    }
}
