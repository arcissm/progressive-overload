import { ItemView, Plugin, WorkspaceLeaf } from "obsidian";
import React from "react";
import ReactDOM from "react-dom";

import MultiSelect from "../react/components/MultiSelect";
import { Tabs } from "ui/react/components/Tabs";
import { WorkoutController } from "controller/WorkoutController";
import { WorkoutControllerProvider } from "ui/react/w";
import { createRoot } from "react-dom/client";

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
      <WorkoutControllerProvider controller={this.controller}>
        <Tabs />
      </WorkoutControllerProvider>
    );
  
    // Use createRoot instead of ReactDOM.render
    const root = createRoot((this as any).contentEl);
    root.render(this.reactComponent);
  }
}