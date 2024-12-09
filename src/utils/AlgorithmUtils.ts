export function newDate(date: string){
	const dateParts = date.split('-').map(Number);
	const year = dateParts[0];
	const month = dateParts[1] - 1; // Months are zero-based in JavaScript Date
	const day = dateParts[2];
	return new Date(year, month, day)
}

export function isSameDate(date1: Date, date2:Date) {
    return (
        date1.getFullYear() === date2.getFullYear() &&  // Compare year
        date1.getMonth() === date2.getMonth() &&        // Compare month (0-11)
        date1.getDate() === date2.getDate()             // Compare day of the month (1-31)
    );
}

export function getTodayLocalDate() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

// includes min ands max
export function getRandomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
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

export function chooseRandomIndex(totalPictures: number): number {
    // Handle the case where no images are available
    if (totalPictures === 0) {
        return -1;
    }

    const numberOfGroups = Math.floor(Math.random() * 4) + 2;
    const groupSize = totalPictures / numberOfGroups;
    const selectedIndices: number[] = [];

    for (let i = 0; i < numberOfGroups; i++) {
        const startIndex = Math.floor(i * groupSize);
        let endIndex: number;

        // Handle the last group to include any remaining images
        if (i === numberOfGroups - 1) {
            endIndex = totalPictures - 1;
        } else {
            endIndex = Math.floor((i + 1) * groupSize) - 1;
        }

        // Ensure the group has at least one image
        if (startIndex > endIndex) {
            continue;
        }

        // Pick a random index within the current group
        const indexInGroup = Math.floor(Math.random() * (endIndex - startIndex + 1)) + startIndex;
        selectedIndices.push(indexInGroup);
    }

    const finalIndex = selectedIndices[Math.floor(Math.random() * selectedIndices.length)];
    return finalIndex;
}

