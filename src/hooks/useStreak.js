import { useMemo } from 'react';
import { calculateStreak } from '../utils/calculations';
import { useExpenses } from './useExpenses';

export const useStreak = () => {
    const { expenses } = useExpenses();
    const streakData = useMemo(() => calculateStreak(expenses), [expenses]);

    return { streakData };
};
