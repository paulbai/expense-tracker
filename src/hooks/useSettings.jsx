/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_SETTINGS, STORAGE_KEYS } from '../utils/constants';
import { getSettings, saveSettings } from '../utils/storage';

const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const refreshSettings = useCallback(async () => {
        try {
            setLoading(true);
            const savedSettings = await getSettings();
            setSettings(savedSettings);
            setError(null);
        } catch (caughtError) {
            setError(caughtError.message || 'Settings could not be loaded.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshSettings();

        const handleStorageChange = (event) => {
            if (event.key === STORAGE_KEYS.SETTINGS) refreshSettings();
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [refreshSettings]);

    const updateSettings = useCallback(async (updates) => {
        const nextSettings = { ...settings, ...updates };
        try {
            await saveSettings(nextSettings);
            setSettings(nextSettings);
            setError(null);
            return true;
        } catch (caughtError) {
            setError(caughtError.message || 'Settings could not be saved.');
            return false;
        }
    }, [settings]);

    const resetSettings = useCallback(async () => {
        try {
            await saveSettings(DEFAULT_SETTINGS);
            setSettings(DEFAULT_SETTINGS);
            setError(null);
            return true;
        } catch (caughtError) {
            setError(caughtError.message || 'Settings could not be reset.');
            return false;
        }
    }, []);

    const value = useMemo(() => ({
        settings,
        loading,
        error,
        updateSettings,
        resetSettings,
        refreshSettings
    }), [error, loading, refreshSettings, resetSettings, settings, updateSettings]);

    return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used inside SettingsProvider.');
    }
    return context;
};
