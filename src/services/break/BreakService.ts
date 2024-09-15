import {BREAK, MINIMUM_WORKOUT_DAYS_2_WEEKS} from "../../utils/Constants";
import { DBService } from "services/core/DBService";


export class BreakService{
	private db: DBService;

	constructor(db: DBService) {
		this.db = db;
	}

	getRandomBreakWorkout(){
		const workout = this.db.getRandomBreakWorkout();
		return workout;
	}

	isOnBreak(){
		console.log("IS ON BREAK ???")
		let isBreak = false;
		const totalWorkouts = this.db.countCompletedWorkouts();

		console.log("Total workouts " + totalWorkouts)
		console.log("MINIMUM_WORKOUT_DAYS_2_WEEKS " + MINIMUM_WORKOUT_DAYS_2_WEEKS)

		if(totalWorkouts >= MINIMUM_WORKOUT_DAYS_2_WEEKS){
			const wokoutsIn2Weeks = this.db.countCompletedWorkoutsInPeriod(2);

			console.log("wokoutsIn2Weeks " + wokoutsIn2Weeks)

			if(wokoutsIn2Weeks < MINIMUM_WORKOUT_DAYS_2_WEEKS){
				isBreak = true;
			}
		}

		return isBreak;
	}
}
