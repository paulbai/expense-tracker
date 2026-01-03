import { useState, useEffect } from 'react';
import { getUserProfile, saveUserProfile } from '../utils/storage';

export const useUser = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            setLoading(true);
            const profile = await getUserProfile();
            setUser(profile);
            setLoading(false);
        };
        loadUser();
    }, []);

    const login = async (username) => {
        const profile = {
            name: username,
            joinedAt: new Date().toISOString(),
        };
        const success = await saveUserProfile(profile);
        if (success) {
            setUser(profile);
            return true;
        }
        return false;
    };

    return { user, loading, login };
};
