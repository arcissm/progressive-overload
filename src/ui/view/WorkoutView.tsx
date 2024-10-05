import { ItemView, WorkspaceLeaf } from "obsidian";
import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

import { WorkoutController } from "controller/WorkoutController";
import { WorkoutControllerProvider } from "controller/WorkoutControllerProvider";
import CalendarComponent from "ui/react/components/CalendarComponent";
import ChecklistComponent from "ui/react/components/ChecklistComponent";
import StatsComponent from "ui/react/components/StatsComponent";

export const WORKOUT_VIEW = "workout-view";

export class WorkoutView extends ItemView {
    private reactComponent: React.ReactElement;
    private controller: WorkoutController;
    private triggerReRender: Function | null = null; // State update function
private subscribers: Function[] = [];

    subscribe(callback: Function) {
        this.subscribers.push(callback);
    }

    notifySubscribers() {
        this.subscribers.forEach(callback => callback());
    }
    constructor(leaf: WorkspaceLeaf, controller: WorkoutController) {
        super(leaf);
        this.controller = controller;
    }

    getViewType(): string {
        return WORKOUT_VIEW;
    }

    getDisplayText(): string {
        return "aaaaaa";
    }

    getIcon(): string {
        return "dice";
    }

    // Method to trigger re-render
    updateCalendar() {
        if (this.triggerReRender) {
            this.triggerReRender((prev: number) => prev + 1); // Increment state to trigger re-render
        }
    }

    async onOpen(): Promise<void> {
        // Create a root for the React component
        const root = createRoot((this as any).contentEl);

        // State used to trigger re-renders
        const WorkoutWrapper = () => {
            const [, setRenderCount] = useState(0);  // Unused value just to trigger re-renders

            // Expose the setRenderCount function to trigger re-renders
            useEffect(() => {
                this.triggerReRender = setRenderCount;
            }, []);

            return (
                <WorkoutControllerProvider controller={this.controller}>
                    <div>
                        <CalendarComponent />
                        <ChecklistComponent />
                        <StatsComponent />
                    </div>
                </WorkoutControllerProvider>
            );
        };

        root.render(<WorkoutWrapper />);
    }
}
