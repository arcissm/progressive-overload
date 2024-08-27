import {BreakData} from "../data/BreakData";
import {WorkoutData} from "../data/WorkoutData";
import {MAXIMUM_BREAK_DAYS, NUMBER_TIMES_WORKOUT_PER_WEEK} from "../../utils/Constants";


export class BreakService{
	private breakData: BreakData;
	private workoutData: WorkoutData;


	constructor(breakData: BreakData, workoutData: WorkoutData) {
		this.workoutData = workoutData;
		this.breakData = breakData;
	}

	revertBreakData(){
		this.breakData.breakDaysCount = Math.max(0, this.breakData.breakDaysCount - this.workoutData.getDaysSinceLastWorkout());
		this.breakData.workoutDaysCount = Math.max(0, this.breakData.workoutDaysCount - 1);
		this.breakData.saveCountData();
	}

	updateBreakData(){
		this.breakData.breakDaysCount += this.workoutData.getDaysSinceLastWorkout();
		this.breakData.workoutDaysCount ++;
		this.breakData.saveCountData();
	}

	isOnBreak(){
		let isBreak = false;

		if(this.breakData.breakDaysCount >= MAXIMUM_BREAK_DAYS){
			this.breakData.workoutDaysCount = 0;
			this.breakData.breakDaysCount = 0;
			isBreak = true;
		}

		const weekWorkoutCount = this.workoutData.getCompletedWorkoutsLastWeeks(1)
		if(weekWorkoutCount >= NUMBER_TIMES_WORKOUT_PER_WEEK){
			this.breakData.breakDaysCount = 0;
		}

		const twoWeeksWorkoutCount = this.workoutData.getCompletedWorkoutsLastWeeks(2);
		if(twoWeeksWorkoutCount >= (NUMBER_TIMES_WORKOUT_PER_WEEK * 2)){
			this.breakData.breakDaysCount = 0;
		}

		this.breakData.saveCountData();
		return isBreak;
	}
}
