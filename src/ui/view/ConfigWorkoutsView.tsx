import { ItemView, WorkspaceLeaf } from "obsidian";
import React from "react";


import { WorkoutController } from "controller/WorkoutController";
import { createRoot } from "react-dom/client";
import { Tabs } from "ui/react/components/Tabs";
import { ConfigControllerProvider } from "controller/ConfigControllerProvider";

export const CONFIG_WORKOUT_VIEW = "config-workouts-view";

export class ConfigWorkoutsView extends ItemView {
  private reactComponent: React.ReactElement;

  private controller: WorkoutController; // Replace with the correct type for the controller class

  constructor(leaf: WorkspaceLeaf, controller: WorkoutController) {
    super(leaf);
    this.controller = controller;
  }


  getViewType(): string {
    return CONFIG_WORKOUT_VIEW;
  }

  getDisplayText(): string {
    return "Manage Workouts";
  }

  getIcon(): string {
    return "swords";
  }

  async onOpen(): Promise<void> {
    this.reactComponent = (
      <ConfigControllerProvider controller={this.controller}>
        <Tabs />
      </ConfigControllerProvider>
    );
  
    // Use createRoot instead of ReactDOM.render
    const root = createRoot((this as any).contentEl);
    root.render(this.reactComponent);
  }
}