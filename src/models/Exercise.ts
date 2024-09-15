import {findIndexOfSetList, findSetsList, getRandomInt} from "../utils/AlgorithmUtils";
import {LUCKY, PROGRESSION, SPECIAL, TIME_PER_REP} from "../utils/ExerciseConstants";

export class Exercise {
	name: string;
	id: string;
	variation: number; // -1 is core exercise, 0 is a normal exercise, 1,2,3... is a variation with a difficulty level
	sets: number;
	reps: string;
	weight: number;
	time: number;
	weightIncrease: number;
	boosted: number;
	note: string;
	isCore: boolean;
	isSuccess: boolean;
	isCompleted: boolean;
	isUnlocked: boolean;

	constructor(
		name: string, 
		variation = 0,
		sets = 0, 
		reps = "5",
		weight = 0, 
		time = 30, 
		weightIncrease = 10, 
		boosted = 0,
		note = "",
		isSuccess = false, 
		isCompleted = false, 
		isUnlocked = false) {
			
		this.name = name;
		this.id = this.nameToId(this.name);
		this.variation = variation;
		this.weight = weight;
		this.sets = sets;
		this.reps = reps;
		this.time = time;
		this.note = note;
		this.isCore = this.variation < 0;
		this.isSuccess = isCompleted;
		this.isCompleted = isSuccess;
		this.isUnlocked = isUnlocked;
		this.weightIncrease = weightIncrease;
		this.boosted = boosted;
	}

	private nameToId(name: string){
		return name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
	}

	static from(exercise: Exercise, newSets: number): Exercise {
		return new Exercise(
			exercise.name,
			exercise.variation,
			newSets,
			exercise.reps,
			exercise.weight,
			exercise.time,
			exercise.weightIncrease,
			exercise.boosted,
			exercise.note,
			exercise.isSuccess,
			exercise.isCompleted,
			exercise.isUnlocked
		);
	}


	weightlessProgression(){
		// HANDSTAND
		if(this.name.contains("handstand")){
			const handstandRepList = findSetsList(10)
			const indexLastReps = findIndexOfSetList(handstandRepList, this.reps) - 1
			if(indexLastReps <= 0 ){
				this.note =
					"Congrats 🎉\n" +
					"find a new variant, change the reps, or add an exercise"
				this.reps = "12"
			} else{
				this.reps = handstandRepList[indexLastReps]
			}
		}
		// ROLLING EXERCISE
		else if(this.name.contains("rolling")){
			this.reps = "15-20"
		// OTHERS
		}else{
			const currentRepIndex = PROGRESSION.indexOf(this.reps) + 1;
			// MAXED OUT
			if(currentRepIndex >= PROGRESSION.length) {
				if(this.reps.contains("20")){
					this.note = "Can you try a harder variant?"
				}
				this.reps = "15-20"
			}
			// NORMAL PROGRESSION
			else{
				this.reps = PROGRESSION[currentRepIndex]
			}
		}
	}

	setTime(){
		const repsNumber = parseInt(this.reps.split("-")[1] || this.reps);
		this.time = TIME_PER_REP * repsNumber
	}


	progressiveOverload() {
		this.time = 10000
	}

	// progressiveOverload() {

	// 	if (!this.isSuccess){
	// 		return
	// 	}

	// 	this.isSuccess = false;

	// 	this.setTime()

	// 	// Weightless Exercises
	// 	if (this.weightIncrease == 0){
	// 		this.weightlessProgression()
	// 		return;
	// 	}

	// 	// More than 4 sets, we get funky
	// 	if (this.isCore && this.sets > 4){
	// 		this.specialNote()
	// 	}


	// 	const currentRepIndex = PROGRESSION.indexOf(this.reps);
	// 	if (currentRepIndex === -1) {
	// 		this.reps = "5"
	// 	}

	// 	const nextRepIndex = currentRepIndex + 1

	// 	// if you're about to do 12-15 reps and you're not lucky, you will actually do them
	// 	if ((nextRepIndex == PROGRESSION.length - 1) && (Math.random() > LUCKY)){
	// 		this.reps = "12-15"
	// 	}

	// 	// if we reached the max reps -> you're about to do 12-15 or you've already done them
	// 	else if (nextRepIndex >= (PROGRESSION.length - 1)){
	// 		this.reps = PROGRESSION[0]
	// 		this.weight += this.weightIncrease
	// 	}
	// 	// add more reps
	// 	else {
	// 		this.reps = PROGRESSION[nextRepIndex];
	// 	}
	// }

	specialNote(){
		const index = getRandomInt(0, SPECIAL.length-1)
		let special = SPECIAL[index]
		if (special.toLowerCase() === "normal"){
			this.note = "";
			return
		}
		else if (special.toLowerCase().contains("weight")){
			special += this.weightIncrease
		}
		this.note = `** 1-4 sets**: Normal reps  \n` +
			`> > **5-${this.sets} sets**: ${special}\n`
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
		if (this.note) {
			return `${this.note}`;
		}
	}

	toMarkdown() {
		let result = `## 🚀 **${this.name.toUpperCase()}**\n`;

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
