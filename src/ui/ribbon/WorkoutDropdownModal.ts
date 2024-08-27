import { App, Modal, Notice } from 'obsidian';
import {WORKOUT_TYPES} from "../../utils/Constants";
import WorkoutPlugin from "../../main";

export class WorkoutDropdownModal extends Modal {
	private plugin: WorkoutPlugin;
	private inputField: HTMLInputElement;
	private resultsContainer: HTMLDivElement;
	private items: HTMLDivElement[];

	constructor(app: App, plugin: WorkoutPlugin) {
		super(app);
		this.plugin = plugin;
		this.items = [];
	}

	onOpen() {
		const { contentEl } = this;

		// Add a specific class to the modal content
		contentEl.addClass('workout-modal');

		// Create the input container
		const inputContainer = document.createElement('div');
		inputContainer.className = 'workout-modal-input-container';
		contentEl.appendChild(inputContainer);

		// Create the input field
		this.inputField = document.createElement('input');
		this.inputField.className = 'workout-input';
		this.inputField.type = 'text';
		this.inputField.autocapitalize = 'off';
		this.inputField.enterKeyHint = 'done';
		this.inputField.placeholder = 'Enter a workout type...'; // Placeholder text
		this.inputField.addEventListener('input', () => this.filterOptions());
		inputContainer.appendChild(this.inputField);

		// Create the results container
		this.resultsContainer = document.createElement('div');
		this.resultsContainer.className = 'workout-options-container';
		contentEl.appendChild(this.resultsContainer);


		// BREAK BUTTON IF onBreak
		if (this.plugin.isOnBreak()){
			const item = document.createElement('div');
			const workoutType = "break"
			item.className = 'workout-option';
			item.textContent = workoutType;
			item.onclick = () => {
				new Notice(`You selected: ${workoutType}`);
				this.close();

				this.plugin.createNote(workoutType);
			};
			this.resultsContainer.appendChild(item)
			this.items.push(item)
		}else{
			// Create buttons for each workout type
			this.items = WORKOUT_TYPES.map(workoutType => {
				const item = document.createElement('div');
				item.className = 'workout-option';
				item.textContent = workoutType;
				item.onclick = () => {
					new Notice(`You selected: ${workoutType}`);
					this.close();

					this.plugin.createNote(workoutType);
				};
				this.resultsContainer.appendChild(item);
				return item;
			});
		}
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}

	// Filter the options based on input value
	private filterOptions() {
		const filterText = this.inputField.value.toLowerCase();
		console.log(filterText)
		this.items.forEach(item => {
			const text = item.textContent?.toLowerCase() || '';
			item.style.display = text.includes(filterText) ? 'block' : 'none';
		});
	}
}
