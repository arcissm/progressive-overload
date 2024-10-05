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