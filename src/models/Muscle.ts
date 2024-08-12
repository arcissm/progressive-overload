import {MUSCLE_GROUP} from "../utils/Constants";


export class Muscle{
	name:string;
	minSets:number;
	maxSets:number;

	constructor(name:string, minSets:number, maxSets:number){
		if (MUSCLE_GROUP.includes(name)) {
			this.name = name;
		} else {
			console.log(`${name} is not in the list of Muscles`);
		}
		this.minSets = minSets;
		this.maxSets = maxSets;
	}
}
