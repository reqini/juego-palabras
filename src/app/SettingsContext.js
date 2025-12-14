import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useCallback } from 'react';
import { usePersistentState } from '../hooks/usePersistentState';
export const DEFAULT_SETTINGS = {
    duration: 60,
    category: 'general',
    tiltThreshold: 25,
    soundEnabled: true,
    vibrationEnabled: true,
    mixCategories: false
};
const SettingsContext = createContext(undefined);
export function SettingsProvider({ children }) {
    const [settings, setSettings] = usePersistentState('game-settings', DEFAULT_SETTINGS);
    const updateSettings = useCallback((newSettings) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    }, [setSettings]);
    const resetSettings = useCallback(() => {
        setSettings(DEFAULT_SETTINGS);
    }, [setSettings]);
    return (_jsx(SettingsContext.Provider, { value: { settings, updateSettings, resetSettings }, children: children }));
}
export function useSettings() {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within SettingsProvider');
    }
    return context;
}
