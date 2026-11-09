/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo } from 'react';
import { useSettings } from './useSettings';

const ThemeContext = createContext(null);

export const THEMES = [
    { id: 'dark', label: 'Dark' },
    { id: 'light', label: 'Light' },
    { id: 'aurora', label: 'Aurora' },
    { id: 'ocean', label: 'Ocean' },
    { id: 'sunset', label: 'Sunset' },
    { id: 'bioluminescence', label: 'Electric bioluminescence' },
    { id: 'deep_teal', label: 'Deep teal naturals' },
    { id: 'retro', label: 'Vibrant retro' },
    { id: 'neon', label: 'Neon' }
];

export const ThemeProvider = ({ children }) => {
    const { settings, updateSettings } = useSettings();
    const theme = settings.theme || 'dark';

    useEffect(() => {
        const root = window.document.documentElement;
        THEMES.forEach((item) => root.classList.remove(item.id));
        root.classList.add(theme);
        root.style.colorScheme = theme === 'light' ? 'light' : 'dark';
    }, [theme]);

    const value = useMemo(() => ({
        theme,
        themes: THEMES,
        changeTheme: (nextTheme) => updateSettings({ theme: nextTheme })
    }), [theme, updateSettings]);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used inside ThemeProvider.');
    }
    return context;
};
