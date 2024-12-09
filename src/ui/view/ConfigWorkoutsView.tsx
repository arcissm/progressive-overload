import { ItemView, WorkspaceLeaf } from "obsidian";
import React from "react";
import { createRoot } from "react-dom/client";
import { ConfigControllerProvider } from "controller/ConfigControllerProvider";
import { ConfigController } from "controller/ConfigController";
import ConfigPanel from "ui/react/panels/ConfigPanel";
import { SettingsControllerProvider } from "controller/SettingsControllerProvider";
import { SettingsController } from "controller/SettingsController";

export const CONFIG_WORKOUT_VIEW = "config-workouts-view";

export class ConfigWorkoutsView extends ItemView {
  private reactComponent: React.ReactElement;
  private configController: ConfigController;
  private settingsController: SettingsController;

  constructor(leaf: WorkspaceLeaf, configController: ConfigController, settingsController: SettingsController) {
    super(leaf);
    this.configController = configController;
    this.settingsController = settingsController;
  }


  getViewType(): string {
    return CONFIG_WORKOUT_VIEW;
  }

  getDisplayText(): string {
    return "Manage Workouts";
  }

  getIcon(): string {
    return "shield";
  }

  async onOpen(): Promise<void> {
    this.reactComponent = (
      <SettingsControllerProvider controller={this.settingsController}>
        <ConfigControllerProvider controller={this.configController}>
          <div className="config-workout-view">
            <ConfigPanel />
        </div>
        </ConfigControllerProvider>
      </SettingsControllerProvider>
    );
  
    const root = createRoot((this as any).contentEl);
    root.render(this.reactComponent);
  }
}