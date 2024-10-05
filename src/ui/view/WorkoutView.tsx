import { ItemView, WorkspaceLeaf } from "obsidian";
import { createRoot } from "react-dom/client";
import { WorkoutControllerProvider } from "controller/WorkoutControllerProvider";
import ChecklistComponent from "ui/react/components/ChecklistComponent";
import StatsComponent from "ui/react/components/StatsComponent";
import { WorkoutController } from "controller/WorkoutController";
import Calendar from "ui/react/components/calendar/Calendar";

export const WORKOUT_VIEW = "workout-view";

export class WorkoutView extends ItemView {
    private controller: WorkoutController;

    constructor(leaf: WorkspaceLeaf, controller: WorkoutController) {
        super(leaf);
        this.controller = controller;
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
            <WorkoutControllerProvider controller={this.controller}>
                <div>
                    <Calendar />
                    <ChecklistComponent />
                    <StatsComponent />
                </div>
            </WorkoutControllerProvider>
        );
    }
}
