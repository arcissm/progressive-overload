import { PRGRESSIVE_OVERLOAD_REPS } from "utils/Constants";
import { TIME_PER_REP, UNLUCKY} from "../utils/ExerciseConstants";

export class Exercise {
	name: string;
	id: string;
	sets: number;
	reps: string;
	weight: number;
	time: number;
	weightIncrease: number;
	variation: string;
	boosted: number;
	note: string;
	isSuccess: boolean;
	isCompleted: boolean;
	isUnlocked: boolean;

	constructor(
		name: string, 
		sets: number = 1, 
		reps = "5",
		weight: number = 0, 
		time: number = 30, 
		weightIncrease: number = 10, 
		variation = "",
		boosted: number = 0,
		note = "",
		isSuccess = false, 
		isCompleted = false, 
		isUnlocked = false) {
			
		this.name = name;
		this.nameToId();
		this.weight = weight;
		this.sets = sets;
		this.reps = reps;
		this.time = time;
		this.note = note;
		this.variation = variation;
		this.isSuccess = isSuccess;
		this.isCompleted = isCompleted;
		this.isUnlocked = isUnlocked;
		this.weightIncrease = weightIncrease;
		this.boosted = boosted;
	}

	nameToId(){
		this.id = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
		return this.id
	}

	
	private setTime(){
		const repsNumber = parseInt(this.reps.split("-")[1] || this.reps);
		this.time = TIME_PER_REP * repsNumber
	}



	static from(exercise: Exercise, newSets: number): Exercise {
		return new Exercise(
			exercise.name,
			newSets,
			exercise.reps,
			exercise.weight,
			exercise.time,
			exercise.weightIncrease,
			exercise.variation,
			exercise.boosted,
			exercise.note,
			exercise.isSuccess,
			exercise.isCompleted,
			exercise.isUnlocked
		);
	}

	// Deep Copy
	clone(): Exercise {
		return new Exercise(
		  this.name,
		  this.sets,
		  this.reps,
		  this.weight,
		  this.time,
		  this.weightIncrease,
		  this.variation,
		  this.boosted,
		  this.note,
		  this.isSuccess,
		  this.isCompleted,
		  this.isUnlocked
		);
	  }
	

	private isMaxedOutReps(){
		// last rep in the list? then we maxed out
		return this.reps === "12-15" || 
		this.reps === "15-20" || 
		this.reps === "max" || 
		((PRGRESSIVE_OVERLOAD_REPS.length-1) === PRGRESSIVE_OVERLOAD_REPS.findIndex(reps => reps === this.reps))
	}



	progressiveOverload(variation:string) {
		// no reps
		if(this.reps === "N/A")return

		this.setTime()

		// we upgrade the exercise weight or variation
		if(this.isMaxedOutReps()){

			// You've maxed out the skill
			if(this.weightIncrease === 0)return

			this.reps = PRGRESSIVE_OVERLOAD_REPS[0]
			if(this.weight === 0 && this.variation){
				this.variation = variation;
			}else{
				this.weight += this.weightIncrease
			}
		}else{ // we add sets
			const index = PRGRESSIVE_OVERLOAD_REPS.findIndex(reps => reps === this.reps)
			if ((this.reps === "10-12") && (Math.random() > UNLUCKY)){ // 10% chanche you do 12-15 reps
				this.reps = "12-15"
			}else{
				this.reps = PRGRESSIVE_OVERLOAD_REPS[index + 1]

			}
		}
	}


	toMarkdownWarmUp() {
		let result = `## 🔥 **${this.name.toUpperCase()}**\n`;

		if (this.sets > 0) {
			result += `> **Sets**: ${this.sets}\n`;
		}

		if (this.weight > 0) {
			result += `> **Weight**: ${this.weight} lbs 🏋️\n`;
		}

		if (this.reps) {
			result += `> **Reps**: ${this.reps}\n`;
		}

		if (this.note) {
			result += `> > ${this.note}\n`;
		}

		// Add a unique ID to the checkbox
		result += `\n- [ ] **Completed:** No ❌ <!-- id: ${this.id} -->\n`;
		// result += "\n- [ ] **Completed:** No ❌\n"

		result += `\n---\n`;

		return result;
	}

	toMarkdownCardio(){
		let result = `\n\n`;
		if (this.note) {
			result += `# ${this.note}`;
		}
		result += `\n- [ ] **Completed:** No ❌ <!-- id: completed_${this.id} -->\n`;
		return result;
	}

	toMarkdown() {
		let result = `## 🚀 **${this.name.toUpperCase()}**\n`;

		if (this.variation){
			result += `#### ${this.variation}\n`;

		}

		if (this.sets > 0) {
			result += `> **Sets**: ${this.sets}\n`;
		}

		if (this.weight > 0) {
			result += `> **Weight**: ${this.weight} lbs 🏋️\n`;
		}

		if (this.reps) {
			result += `> **Reps**: ${this.reps}\n`;
		}

		if (this.note) {
			result += `> > ${this.note}\n`;
		}

		result += `\n- [ ] **Completed:** No ❌ <!-- id: completed_${this.id} -->\n`;
		result += `\n- [ ] **Success:** 🏆 <!-- id: success_${this.id} -->\n`;


		result += `\n---\n`;

		return result;
	}
}
