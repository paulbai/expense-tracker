import { useState, useEffect } from 'react';
import { getUserProfile, removeUserProfile, saveUserProfile } from '../utils/storage';

export const useUser = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadUser = async () => {
            setLoading(true);
            try {
                const profile = await getUserProfile();
                setUser(profile);
                setError(null);
            } catch (caughtError) {
                setError(caughtError.message || 'Your profile could not be loaded.');
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, []);

    const login = async (username) => {
        const cleanedName = username.trim();
        if (!cleanedName) return false;

        const profile = {
            name: cleanedName,
            joinedAt: new Date().toISOString(),
        };
        try {
            await saveUserProfile(profile);
            setUser(profile);
            setError(null);
            return true;
        } catch (caughtError) {
            setError(caughtError.message || 'Your profile could not be saved.');
            return false;
        }
    };

    const resetUser = async () => {
        try {
            await removeUserProfile();
            setUser(null);
            setError(null);
            return true;
        } catch (caughtError) {
            setError(caughtError.message || 'Your profile could not be reset.');
            return false;
        }
    };

    return { user, loading, error, login, resetUser };
};
