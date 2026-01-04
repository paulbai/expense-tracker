import React, { createContext, useContext, useEffect, useState } from 'react';
import { STORAGE_KEYS } from '../utils/constants';

const ThemeContext = createContext();

export const THEMES = [
    { id: 'dark', label: 'Dark' },
    { id: 'light', label: 'Light' },
    { id: 'aurora', label: 'Aurora' },
    { id: 'ocean', label: 'Ocean' },
    { id: 'sunset', label: 'Sunset' },
    { id: 'bioluminescence', label: 'Electric Bioluminescence' },
    { id: 'deep_teal', label: 'Deep Teal Naturals' },
    { id: 'retro', label: 'Vibrant Retro' },
    { id: 'neon', label: 'Neon Neon' }
];

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('dark');

    // Load theme from storage on mount
    useEffect(() => {
        const loadTheme = async () => {
            if (typeof window !== 'undefined' && window.storage) {
                try {
                    const savedSettings = await window.storage.get(STORAGE_KEYS.SETTINGS);
                    if (savedSettings && savedSettings.value) {
                        const parsed = JSON.parse(savedSettings.value);
                        if (parsed.theme) setTheme(parsed.theme);
                    }
                } catch (e) {
                    console.error("Failed to load theme", e);
                }
            }
        };
        loadTheme();
    }, []);

    // Apply theme to document
    useEffect(() => {
        const root = window.document.documentElement;
        // Remove all previous theme classes
        THEMES.forEach(t => root.classList.remove(t.id));
        // Add new theme class
        root.classList.add(theme);
    }, [theme]);

    const changeTheme = async (newTheme) => {
        setTheme(newTheme);
        // Persist to settings
        if (typeof window !== 'undefined' && window.storage) {
            try {
                const savedSettings = await window.storage.get(STORAGE_KEYS.SETTINGS);
                let currentSettings = savedSettings && savedSettings.value ? JSON.parse(savedSettings.value) : {};
                currentSettings.theme = newTheme;
                await window.storage.set(STORAGE_KEYS.SETTINGS, JSON.stringify(currentSettings));
            } catch (e) {
                console.error("Failed to save theme", e);
            }
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, changeTheme, themes: THEMES }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
