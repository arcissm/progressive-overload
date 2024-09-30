export class Muscle {
	name: string;
	minSets: number;
	maxSets: number;
	boosted: number;
	coreExercises: string[];

	constructor(name: string, minSets: number, maxSets: number, boosted: number, coreExercises: string[]) {
		this.name = name;
		this.minSets = minSets;
		this.maxSets = maxSets;
		this.boosted = boosted;
		this.coreExercises = coreExercises; // Corrected assignment
	}

	equals(muscle2: Muscle): boolean {
		return this.name === muscle2.name &&
		       this.minSets === muscle2.minSets &&
		       this.maxSets === muscle2.maxSets &&
		       this.boosted === muscle2.boosted &&
		       this.coreExercises.length === muscle2.coreExercises.length &&
		       this.coreExercises.every((exercise, index) => exercise === muscle2.coreExercises[index]);
	}
}
