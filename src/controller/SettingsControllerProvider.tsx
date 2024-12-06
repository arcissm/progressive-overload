// SettingsControllerProvider.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { PluginSettings } from "services/settings/Settings";
import { SettingsController } from "controller/SettingsController";

interface SettingsControllerContextType {
  settings: PluginSettings;
  updateSettings: (newSettings: Partial<PluginSettings>) => void;
}

const SettingsControllerContext = createContext<SettingsControllerContextType | undefined>(undefined);

export const useSettingsController = (): SettingsControllerContextType => {
  const context = useContext(SettingsControllerContext);
  if (!context) {
    throw new Error("useSettingsController must be used within a SettingsControllerProvider");
  }
  return context;
};

interface SettingsControllerProviderProps {
  controller: SettingsController;
  children: React.ReactNode;
}

export const SettingsControllerProvider: React.FC<SettingsControllerProviderProps> = ({ controller, children }) => {
  const [settings, setSettings] = useState(controller.settings);

  // Use a functional state update and useCallback to ensure updateSettings is stable.
  const updateSettings = React.useCallback((newSettings: Partial<PluginSettings>) => {
    setSettings(prevSettings => {
      const updatedSettings = { ...prevSettings, ...newSettings };
      controller.updateFullSettings(updatedSettings);
      return updatedSettings;
    });
  }, [controller]);

  // Sync with controller if needed, but ensure controller.settings is stable.
  useEffect(() => {
    setSettings(controller.settings);
  }, [controller.settings]);

  return (
    <SettingsControllerContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsControllerContext.Provider>
  );
};
