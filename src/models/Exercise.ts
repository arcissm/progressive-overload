import {Muscle} from "./Muscle";

export class Exercise {
	name: string;
	sets: number;
	reps: string;
	weight: number;
	time: number;
	note: string;
	isCore: boolean;
	success: boolean;
	muscles: Array<Muscle>

	constructor(name: string, muscles = [], weight = 0, sets = 0, reps = "", time = 30, url = "", isCore= false, success = false) {
		this.name = name;
		this.muscles = muscles;
		this.weight = weight;
		this.sets = sets;
		this.reps = reps;
		this.time = time;
		this.note = url;
		this.isCore = isCore;
		this.success = success
	}

	increaseDifficulty() {
		console.log(this.name + "leveling up")

		this.reps = "100"
		this.sets = 100
		this.weight = 200
		// const repProgressions = ["5", "6-8", "8-10", "10-12", "12-15"];
		//
		// if (this.reps === "5") {
		// 	this.reps = "6-8";
		// } else {
		// 	const currentRepIndex = repProgressions.indexOf(this.reps);
		//
		// 	if (currentRepIndex === -1) {
		// 		return;
		// 	}
		//
		// 	const nextRepRange = repProgressions[currentRepIndex + 1] || "";
		//
		// 	if (nextRepRange === "12-15" && Math.random() > 0.9) {
		// 		this.reps = "12-15";
		// 	} else if (nextRepRange === "10-12" || nextRepRange === "12-15") {
		// 		this.reps = nextRepRange;
		// 	} else {
		// 		this.weight += 5;
		// 		this.reps = "6-8";
		// 	}
		// }
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
			result += `> 📝 *${this.note}*\n`;
		}

		result += "\n- [ ] **Completed:** No ❌\n"

		result += `\n---\n`;

		return result;
	}

}
