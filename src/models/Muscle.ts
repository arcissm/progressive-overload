import { Exercise } from "./Exercise";

export class Muscle {
	name: string;
	minSets: number;
	maxSets: number;
	boosted: number;
	coreExercises: string[];
	warmUps: Exercise[];
  
	constructor(name: string, minSets: number, maxSets: number, boosted: number, coreExercises: string[], warmUps: Exercise[]) {
	  this.name = name;
	  this.minSets = minSets;
	  this.maxSets = maxSets;
	  this.boosted = boosted;
	  this.coreExercises = coreExercises; // Corrected assignment
	  this.warmUps = warmUps;
	}
  
	equals(muscle2: Muscle): boolean {
	  return this.name === muscle2.name &&
			 this.minSets === muscle2.minSets &&
			 this.maxSets === muscle2.maxSets &&
			 this.boosted === muscle2.boosted &&
			 this.coreExercises.length === muscle2.coreExercises.length &&
			 this.coreExercises.every((exercise, index) => exercise === muscle2.coreExercises[index]) &&
			 this.warmUps.length === muscle2.warmUps.length &&
			 this.warmUps.every((exercise, index) => exercise === muscle2.warmUps[index]);
	}


	clone(): Muscle {
		return new Muscle(
		  this.name,
		  this.minSets,
		  this.maxSets,
		  this.boosted,
		  [...this.coreExercises], // Spread operator for shallow copy
		  [...this.warmUps]        // Spread operator for shallow copy
		);
	  }
  }
  