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