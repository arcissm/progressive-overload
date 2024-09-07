import WorkoutPlugin from "../../main";


export class StatsComponent {
	private plugin: WorkoutPlugin;

	constructor(plugin: WorkoutPlugin) {
		this.plugin = plugin;
	}
	render(container: HTMLElement) {
		container.createEl("h3", { text: "Stats Graph" });
	}
}
