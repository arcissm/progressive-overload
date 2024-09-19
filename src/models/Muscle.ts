export class Muscle {
	name: string;
	minSets: number;
	maxSets: number
	boosted: number;

	constructor(name: string, minSets: number, maxSets: number, boosted: number) {
		this.name = name;
		this.minSets = minSets;
		this.maxSets = maxSets;
		this.boosted = boosted
	}

	equals(muscle2: Muscle): boolean {
        return this.name === muscle2.name &&
               this.minSets === muscle2.minSets &&
               this.maxSets === muscle2.maxSets &&
               this.boosted === muscle2.boosted;
    }
}
