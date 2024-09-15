export function getTodayDateUTC(): Date {
	const now = new Date();
	return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
}

export function isSameDate(date1: Date, date2:Date) {
    return (
        date1.getFullYear() === date2.getFullYear() &&  // Compare year
        date1.getMonth() === date2.getMonth() &&        // Compare month (0-11)
        date1.getDate() === date2.getDate()             // Compare day of the month (1-31)
    );
}

// includes min ands max
export function getRandomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}


export function findConstrainedSetList(n: number, min: number, max: number): string[] {
	const result: string[] = [];

	function findPartitionsRec(target: number, maxLimit: number, currentPartition: number[]) {
		if (target === 0) {
			result.push(currentPartition.join(','));
			return;
		}

		for (let i = Math.min(maxLimit, target); i >= min; i--) {
			findPartitionsRec(target - i, i, [...currentPartition, i]);
		}
	}

	findPartitionsRec(n, max, []);
	return result;
}

export function getTitleInfo(filename: string){
	const fileParts = filename.split(' ')
	const date = fileParts[0];
	let workoutType = fileParts[1].toLowerCase()
	let index = 0
	if(workoutType.contains(".md")){
		workoutType = workoutType.replace(".md", "")
	}else{
		const count = fileParts[2].replace(".md", "")
		index = parseInt(count) - 1;
	}
	return {workoutType, date, index}
}



export function findSetsList(n: number): string[] {
	const result: string[] = [];

	function findPartitionsRec(target: number, max: number, currentPartition: number[]) {
		if (target === 0) {
			if (!hasTwoOrMoreOnes(currentPartition)) {
				result.push(currentPartition.join(','));
			}
			return;
		}

		for (let i = Math.min(max, target); i >= 1; i--) {
			findPartitionsRec(target - i, i, [...currentPartition, i]);
		}
	}

	function hasTwoOrMoreOnes(partition: number[]): boolean {
		return partition.filter(num => num === 1).length >= 2;
	}

	findPartitionsRec(n, n, []);
	return result;
}

export function findIndexOfSetList(partitions: string[], targetPartition: string): number {
	return partitions.indexOf(targetPartition);
}
