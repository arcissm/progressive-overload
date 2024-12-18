import React, { createContext, useContext } from "react";
import { ConfigController } from "./ConfigController";

const ConfigControllerContext = createContext<ConfigController | undefined>(undefined);

export const useWorkoutController = () => {
  const context = useContext(ConfigControllerContext);
  if (!context) {
    throw new Error("use WorkoutController must be used within a ConfigControllerProvider");
  }
  return context;
};





interface ConfigControllerProviderProps {
  controller: ConfigController;
  children: React.ReactNode;
}

export const ConfigControllerProvider: React.FC<ConfigControllerProviderProps> = ({ controller, children }) => {
  return (
    <ConfigControllerContext.Provider value={controller}>
      {children}
    </ConfigControllerContext.Provider>
  );
};
