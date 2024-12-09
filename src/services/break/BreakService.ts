import { SettingsController } from "controller/SettingsController";
import { DBService } from "services/core/DBService";
import { PluginSettings } from "services/settings/Settings";


export class BreakService{
	private db: DBService;
	private settings: SettingsController;

	constructor(db: DBService, settings: SettingsController) {
		this.db = db;
		this.settings = settings;
	}

	getRandomBreakWorkout(){
		const workout = this.db.getRandomBreakWorkout();
		return workout;
	}

	isOnBreak(){
		let isBreak = false;
		const totalWorkouts = this.db.countCompletedWorkouts();

		if(totalWorkouts >= this.settings.settings.numberWorkoutDays2Weeks){
			const wokoutsIn2Weeks = this.db.countCompletedWorkoutsInPeriod(2);

			if(wokoutsIn2Weeks < this.settings.settings.numberWorkoutDays2Weeks){
				isBreak = true;
			}
		}

		return isBreak;
	}
}
