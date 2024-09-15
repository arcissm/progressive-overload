import {Exercise} from "./Exercise";

export class Muscle {
	name: string;
	minSets: number;
	maxSets: number
	boosted: number;
	exercises: Exercise[];


	constructor(name: string, minSets: number, maxSets: number, boosted: number) {
		this.name = name;
		this.minSets = minSets;
		this.maxSets = maxSets;
		this.boosted = boosted
	}
}
