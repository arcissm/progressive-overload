import { DBService } from "services/core/DBService";


export class BreakService{
	private db: DBService;
	private numberWorkoutDays2Weeks: number;

	constructor(db: DBService, numberWorkoutDays2Weeks: number) {
		this.db = db;
		this.numberWorkoutDays2Weeks = numberWorkoutDays2Weeks;
	}

	getRandomBreakWorkout(){
		const workout = this.db.getRandomBreakWorkout();
		return workout;
	}

	isOnBreak(){
		let isBreak = false;
		const totalWorkouts = this.db.countCompletedWorkouts();

		if(totalWorkouts >= this.numberWorkoutDays2Weeks){
			const wokoutsIn2Weeks = this.db.countCompletedWorkoutsInPeriod(2);

			if(wokoutsIn2Weeks < this.numberWorkoutDays2Weeks){
				isBreak = true;
			}
		}

		return isBreak;
	}
}
