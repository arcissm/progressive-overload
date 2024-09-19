import { ItemView, WorkspaceLeaf } from "obsidian";
import {CalendarComponent} from "./CalendarComponent";
import {ChecklistComponent} from "./ChecklistComponent";
import {StatsComponent} from "./StatsComponent";
import WorkoutPlugin from "../../main";

export const WORKOUT_VIEW = "workout-view";

// Call it TrackerView
export class WorkoutView extends ItemView {
	private plugin: WorkoutPlugin;
	private calendar: CalendarComponent;
	private checkList: ChecklistComponent;
	private stats: StatsComponent;


	constructor(leaf: WorkspaceLeaf, plugin: WorkoutPlugin) {
		super(leaf);
		this.plugin = plugin;
		this.calendar = new CalendarComponent(plugin);
		this.checkList = new ChecklistComponent(plugin);
		this.stats = new StatsComponent(plugin);
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

	public updateCalendar() {
		const calendarSection = this.containerEl.querySelector('.calendar-section') as HTMLElement;
		if (calendarSection) {
			this.calendar.render(calendarSection); // Re-render the calendar
		}
	}

	public updateChecklist() {
		const checklistSection = this.containerEl.querySelector('.checklist-section') as HTMLElement;
		if (checklistSection) {
			this.checkList.render(checklistSection); // Re-render the checklist
		}
	}

	public updateStats() {
		const graphSection = this.containerEl.querySelector('.graph-section') as HTMLElement;
		if (graphSection) {
			this.stats.render(graphSection); // Re-render the stats
		}
	}

}
