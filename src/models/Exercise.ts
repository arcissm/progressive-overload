export class Exercise {
	name: string;
	sets: number;
	reps: string;
	weight: number;
	note: string;
	success: boolean

	constructor(name: string, weight = 0, sets = 0, reps = "", url = "", success = false) {
		this.name = name;
		this.weight = weight;
		this.sets = sets;
		this.reps = reps;
		this.note = url;
		this.success = success

		if (this.reps === "") {
			this.reps = "5";
		}
	}

	increaseDifficulty() {
		const repProgressions = ["5", "6-8", "8-10", "10-12", "12-15"];

		if (this.reps === "5") {
			this.reps = "6-8";
		} else {
			const currentRepIndex = repProgressions.indexOf(this.reps);

			if (currentRepIndex === -1) {
				return;
			}

			const nextRepRange = repProgressions[currentRepIndex + 1] || "";

			if (nextRepRange === "12-15" && Math.random() > 0.9) {
				this.reps = "12-15";
			} else if (nextRepRange === "10-12" || nextRepRange === "12-15") {
				this.reps = nextRepRange;
			} else {
				this.weight += 5;
				this.reps = "6-8";
			}
		}
	}

	toMarkdown() {
		let result = `### **${this.name.toUpperCase()}**\n`;

		if (this.sets > 0) {
			result += `- **Sets**: ${this.sets}\n`;
		}

		if (this.weight > 0) {
			result += `- **Weight**: ${this.weight} lbs\n`;
		}

		if (this.reps) {
			result += `- **Reps**: ${this.reps}\n`;
		}

		if (this.note) {
			result += `- **Note**: ${this.note}\n`;
		}

		if (this.success){
			result += `- [x] Did you get it?\n`;
		}else {
			result += `- [ ] Did you get it?\n`;
		}

		return result;
	}
}
