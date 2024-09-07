import { moment } from "obsidian";
import WorkoutPlugin from "../../main";

export class CalendarComponent {
	private plugin: WorkoutPlugin;
	currentMonth: moment.Moment;

	constructor(plugin: WorkoutPlugin) {
		this.plugin = plugin;
		this.currentMonth = moment();
	}

	render(container: HTMLElement) {
		container.empty(); // Clear existing content

		this.renderHeader(container);
		this.renderDaysOfWeek(container);

		const grid = container.createEl("div", { cls: "calendar-grid" });

		this.renderPrevMonthDays(grid);
		this.renderCurrentMonthDays(grid);
		this.renderNextMonthDays(grid);
	}

	private renderHeader(container: HTMLElement) {
		const header = container.createEl("div", { cls: "calendar-header" });
		const prevBtn = header.createEl("button", { cls: "calendar-btn", text: "<" });
		const title = header.createEl("span", { cls: "calendar-title", text: this.currentMonth.format("MMMM YYYY") });
		const nextBtn = header.createEl("button", { cls: "calendar-btn", text: ">" });

		prevBtn.onclick = () => {
			this.currentMonth = this.currentMonth.clone().subtract(1, "month");
			this.render(container);
		};

		nextBtn.onclick = () => {
			this.currentMonth = this.currentMonth.clone().add(1, "month");
			this.render(container);
		};
	}

	private renderDaysOfWeek(container: HTMLElement) {
		const grid = container.createEl("div", { cls: "calendar-grid" });
		["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach(day => {
			grid.createEl("div", { cls: "calendar-header-day", text: day.toUpperCase() });
		});
	}

	private renderPrevMonthDays(grid: HTMLElement) {
		const firstDayOfMonth = this.currentMonth.startOf("month").day();
		const prevMonth = this.currentMonth.clone().subtract(1, "month");
		const daysInPrevMonth = prevMonth.daysInMonth();

		for (let i = firstDayOfMonth - 1; i >= 0; i--) {
			const dayOfPrevMonth = daysInPrevMonth - i;
			const currentDate = prevMonth.clone().date(dayOfPrevMonth).format("YYYY-MM-DD");
			this.createDayElement(grid, dayOfPrevMonth.toString(), currentDate, true, true);
		}
	}

	private renderCurrentMonthDays(grid: HTMLElement) {
		const daysInMonth = this.currentMonth.daysInMonth();

		for (let day = 1; day <= daysInMonth; day++) {
			const currentDate = this.currentMonth.clone().date(day).format("YYYY-MM-DD");
			this.createDayElement(grid, day.toString(), currentDate, false, false);
		}
	}

	private renderNextMonthDays(grid: HTMLElement) {
		const lastDayOfMonth = this.currentMonth.endOf("month").day();
		const daysToFill = 6 - lastDayOfMonth; // Number of days needed to fill the week

		for (let i = 1; i <= daysToFill; i++) {
			const currentDate = this.currentMonth.clone().add(1, "month").date(i).format("YYYY-MM-DD");
			this.createDayElement(grid, i.toString(), currentDate, true, true);
		}

		const extraDays = 7; // Number of extra days to display in the additional row
		for (let i = 1; i <= extraDays; i++) {
			const currentDate = this.currentMonth.clone().add(1, "month").date(daysToFill + i).format("YYYY-MM-DD");
			this.createDayElement(grid, (daysToFill + i).toString(), currentDate, true, true);
		}
	}

	private createDayElement(grid: HTMLElement, dayText: string, currentDate: string, isGreyedOut: boolean, isOutsideMonth: boolean) {
		const dayEl = grid.createEl("div", { cls: `calendar-day ${isGreyedOut ? "greyed-out" : ""}` });

		// Flex container for date and circles
		const flexContainer = dayEl.createEl("div", { cls: "calendar-day__container" });

		// Date element
		const dateEl = flexContainer.createEl("div", { cls: "calendar-day__container-date", text: dayText });

		// Circle indicators
		const circlesEl = flexContainer.createEl("div", { cls: "calendar-day__container-circles" });

		const workouts = this.plugin.getWorkoutByDate(currentDate);

		if (workouts.length > 0) {
			workouts.forEach(workout => {
				let dotClass: string;

				if (isOutsideMonth) {
					dotClass = workout.completed ? "calendar-day__container-circles-dot completed-outside-month"
						: "calendar-day__container-circles-dot started-outside-month";
				} else {
					dotClass = workout.completed ? "calendar-day__container-circles-dot completed"
						: "calendar-day__container-circles-dot started";
				}

				circlesEl.createEl("div", { cls: dotClass });
			});
		}

		// Highlight the current day
		if (!isGreyedOut && this.currentMonth.date(parseInt(dayText)).isSame(moment(), "day")) {
			dayEl.classList.add("current-day");
		}

		// Handle day click
		dayEl.onclick = () => {
			this.plugin.openNote(currentDate);
		};
	}

}
