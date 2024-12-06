import { ItemView, WorkspaceLeaf } from "obsidian";
import { createRoot } from "react-dom/client";
import { WorkoutControllerProvider } from "controller/WorkoutControllerProvider";
import { WorkoutController } from "controller/WorkoutController";
import Calendar from "ui/react/components/calendar/Calendar";
import Checklist from "ui/react/components/checklist/Checklist";
import WorkoutStats from "ui/react/components/stats/WorkoutStats";
import { SettingsControllerProvider } from "controller/SettingsControllerProvider";
import { SettingsController } from "controller/SettingsController";

export const WORKOUT_VIEW = "workout-view";

export class WorkoutView extends ItemView {
    private workoutController: WorkoutController;
    private settingsController: SettingsController

    constructor(leaf: WorkspaceLeaf, workoutController: WorkoutController, settingsController:SettingsController) {
        super(leaf);
        this.workoutController = workoutController;
        this.settingsController = settingsController
    }

    getViewType(): string {
        return WORKOUT_VIEW;
    }

    getDisplayText(): string {
        return "Workout View";
    }

    getIcon(): string {
        return "sword";
    }

    async onOpen(): Promise<void> {
        const root = createRoot((this as any).contentEl);
        root.render(
            <SettingsControllerProvider controller={this.settingsController}>
                <WorkoutControllerProvider controller={this.workoutController}>
                    <div>
                        <Calendar />
                        {/* Uncomment the following components when they are ready */}
                        {/* <Checklist />
                        <WorkoutStats /> */}
                    </div>
                </WorkoutControllerProvider>
            </SettingsControllerProvider>
        );
    }
}
