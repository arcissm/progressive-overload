import { moment } from "obsidian";

export class CalendarComponent {
	currentMonth: moment.Moment;

	constructor() {
		this.currentMonth = moment();
	}

	render(container: HTMLElement) {
		container.empty(); // Clear existing content

		const header = container.createEl("div", {cls: "calendar-header"});
		const prevBtn = header.createEl("button", {text: "<"});
		const title = header.createEl("span", {text: this.currentMonth.format("MMMM YYYY")});
		const nextBtn = header.createEl("button", {text: ">"});

		prevBtn.onclick = () => {
			this.currentMonth = this.currentMonth.clone().subtract(1, "month");
			this.render(container);
		};

		nextBtn.onclick = () => {
			this.currentMonth = this.currentMonth.clone().add(1, "month");
			this.render(container);
		};

		const grid = container.createEl("div", {cls: "calendar-grid"});

		// Days of the week
		["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach(day => {
			grid.createEl("div", {cls: "calendar-day-header", text: day});
		});

		// Calculate how many days of the previous month to show
		const firstDayOfMonth = this.currentMonth.startOf("month").day();
		const prevMonth = this.currentMonth.clone().subtract(1, "month");
		const daysInPrevMonth = prevMonth.daysInMonth();

		// Days from the previous month
		for (let i = firstDayOfMonth - 1; i >= 0; i--) {
			const dayEl = grid.createEl("div", {
				cls: "calendar-day greyed-out",
				text: (daysInPrevMonth - i).toString()
			});
		}

		// Days of the current month
		const daysInMonth = this.currentMonth.daysInMonth();
		for (let day = 1; day <= daysInMonth; day++) {
			const dayEl = grid.createEl("div", {cls: "calendar-day", text: day.toString()});

			// Highlight the current day
			if (this.currentMonth.date(day).isSame(moment(), "day")) {
				dayEl.classList.add("current-day");
			}

			// Handle day click
			dayEl.onclick = () => {
				// Add your click handler here (e.g., open daily note)
			};
		}
	}
}
