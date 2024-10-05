import { MINIMUM_WORKOUT_DAYS_2_WEEKS} from "../../utils/Constants";
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
		let isBreak = false;
		const totalWorkouts = this.db.countCompletedWorkouts();

		if(totalWorkouts >= MINIMUM_WORKOUT_DAYS_2_WEEKS){
			const wokoutsIn2Weeks = this.db.countCompletedWorkoutsInPeriod(2);

			if(wokoutsIn2Weeks < MINIMUM_WORKOUT_DAYS_2_WEEKS){
				isBreak = true;
			}
		}

		return isBreak;
	}
}
