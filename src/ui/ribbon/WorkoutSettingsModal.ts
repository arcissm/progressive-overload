import { WorkoutController } from 'controller/WorkoutController';
import { Muscle } from 'models/Muscle';
import { App, Modal } from 'obsidian';

export class WorkoutSettingsModal extends Modal {
    controller: WorkoutController;
    currentTab: string;
  
    constructor(app: App, controller: WorkoutController) {
      super(app);
      this.controller = controller;
      this.currentTab = 'workouts'; // Default to the "Workouts" tab
    }
  
    onOpen() {
      const { contentEl } = this;
  
      // Clear any existing content
      contentEl.empty();
  
      // Create tab headers
      const tabGroup = contentEl.createEl('div', { cls: 'tab-group' });
      const workoutsTab = tabGroup.createEl('button', { cls: 'tab-header', text: 'Workout Types' });
      const musclesTab = tabGroup.createEl('button', { cls: 'tab-header', text: 'Muscles' });
      const exercisesTab = tabGroup.createEl('button', { cls: 'tab-header', text: 'Exercises' });
  
      // Add click event listeners for each tab
      workoutsTab.onclick = () => this.switchTab('workouts');
      musclesTab.onclick = () => this.switchTab('muscles');
      exercisesTab.onclick = () => this.switchTab('exercises');
  
      // Highlight the default tab
      workoutsTab.classList.add('active');
  
      // Display the default tab content
      this.displayTabContent(this.currentTab);
    }
  
    switchTab(tab: string) {
      this.currentTab = tab;
      this.displayTabContent(tab);
    }
  
    displayTabContent(tab: string) {
      const { contentEl } = this;
      const tabContent = contentEl.createEl('div', { cls: 'tab-content' });
  
      // Clear previous content
      contentEl.find('.tab-content')?.remove();
  
      // Add new content based on the selected tab
      switch (tab) {
        case 'workouts':
          this.renderWorkoutTypesTab(tabContent);
          break;
  
        case 'muscles':
          tabContent.createEl('h3', { text: 'Manage Muscles' });
          // Form for muscles can go here
          break;
  
        case 'exercises':
          tabContent.createEl('h3', { text: 'Manage Exercises' });
          // Form for exercises can go here
          break;
      }
  
      contentEl.appendChild(tabContent);
    }
  
    renderWorkoutTypesTab(containerEl: HTMLElement) {
        containerEl.createEl('h3', { text: 'Manage Workout Types' });
      
        // Input field to add new workout types
        const inputEl = containerEl.createEl('input', {
          type: 'text',
          placeholder: 'Enter workout type',
        });
      
        // Add button
        const addButton = containerEl.createEl('button', { text: 'Add Workout Type' });
      
        // Add workout types list
        const workoutTypesList = containerEl.createEl('ul', { cls: 'workout-types-list' });
      
        // Fetch existing workout types from the controller
        const workoutTypes = this.controller.getWorkoutTypes();
                   console.log("DEFAULT")

        console.log(workoutTypes)
        this.renderWorkoutTypes(workoutTypesList, workoutTypes);
        
      
        const muscles: Muscle[] = []
        // Add new workout type
        addButton.onclick = () => {
          const newWorkoutType = inputEl.value.trim();
          if (newWorkoutType) {
            // Call controller to add new workout type
            const updatedWorkoutTypes = this.controller.addWorkoutType(newWorkoutType, muscles)
            this.renderWorkoutTypes(workoutTypesList, updatedWorkoutTypes); // Refresh the list
            inputEl.value = ''; // Clear input
          }
        };
      }
      
        // Render workout types in the list
        renderWorkoutTypes(workoutTypesList: HTMLElement, workoutTypes: string[]) {
            workoutTypesList.empty(); // Clear current list
        
            workoutTypes.forEach((type: string) => {
            const li = workoutTypesList.createEl('li', { text: type });
        
            // Add remove button
            const removeButton = li.createEl('button', { text: 'Remove' });
            removeButton.onclick = () => {
                // Call controller to remove the workout type using the workout type as the key
                const updatedWorkoutTypes = this.controller.removeWorkoutType(type);
                console.log("MODAL")

                console.log(updatedWorkoutTypes)
                // Refresh list with the updated workout types
                this.renderWorkoutTypes(workoutTypesList, updatedWorkoutTypes);
            };
            });
        }
  
    onClose() {
      const { contentEl } = this;
      contentEl.empty(); // Clear content when modal is closed
    }
  }
  