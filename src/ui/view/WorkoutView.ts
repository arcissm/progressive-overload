import { ItemView, WorkspaceLeaf } from "obsidian";
import {CalendarComponent} from "./CalendarComponent";
import {CheckBox} from "../../models/Checkbox";
import {ChecklistComponent} from "./ChecklistComponent";
import {StatsComponent} from "./StatsComponent";
// import { createCalendar } from "./calendar";
// import { createGraph } from "./graph";

export const WORKOUT_VIEW = "workout-view";

export class WorkoutView extends ItemView {
	private calendar: CalendarComponent;
	private checkList: ChecklistComponent;
	private stats: StatsComponent;


	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
		this.calendar = new CalendarComponent();
		this.checkList = new ChecklistComponent();
		this.stats = new StatsComponent();
	}

	getViewType(): string {
		return WORKOUT_VIEW;
	}

	getDisplayText(): string {
		return "Workout View";
	}

	async onOpen() {
		const container = this.containerEl.children[1];

		// Create a section for the calendar
		const calendarSection = container.createDiv("calendar-section");
		this.calendar.render(calendarSection);

		// Create a section for the checklist
		const checklistSection = container.createDiv("checklist-section");
		this.checkList.render(checklistSection);

		// Create a section for the graph
		const graphSection = container.createDiv("graph-section");
		this.stats.render(graphSection);
	}

	async onClose() {
		// Cleanup if necessary when the view is closed
	}
}
