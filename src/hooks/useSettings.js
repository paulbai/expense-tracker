import { useState, useEffect } from 'react';
import { getSettings, saveSettings as persistSettings } from '../utils/storage';

export const useSettings = () => {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await getSettings();
            setSettings(data);
            setLoading(false);
        };
        load();
    }, []);

    const updateSettings = async (newSettings) => {
        const updated = { ...settings, ...newSettings };
        setSettings(updated);
        await persistSettings(updated);
    };

    return { settings, loading, updateSettings };
};
