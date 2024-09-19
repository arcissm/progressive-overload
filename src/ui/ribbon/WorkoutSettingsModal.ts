import { WorkoutController } from 'controller/WorkoutController';
import { Muscle } from 'models/Muscle';
import { App, Modal } from 'obsidian';
import { ReactEventHandler, StrictMode } from "react";
import { ReactHead } from "ReactHead"
import { Root, createRoot } from "react-dom/client";


export class WorkoutSettingsModal extends Modal {
    controller: WorkoutController;
    currentTab: string;
  	root: Root | null = null;

    constructor(app: App, controller: WorkoutController) {
      super(app);

      this.controller = controller;
      this.currentTab = 'workouts'; // Default to the "Workouts" tab
    }
  
    onOpen() {
      const { contentEl } = this;

      this.root = createRoot(this.containerEl.children[1]);


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
          tabContent.createEl('h3', { text: 'workout or smth' });
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
}