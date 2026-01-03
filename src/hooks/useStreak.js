import { useState, useEffect, useCallback } from 'react';
import { getStreakData, saveStreakData, getExpenses } from '../utils/storage';
import { isToday, isYesterday, parseISO, differenceInCalendarDays } from 'date-fns';

export const useStreak = () => {
    const [streakData, setStreakData] = useState({
        currentStreak: 0,
        lastLoggedDate: null,
        longestStreak: 0
    });

    const calculateStreak = async () => {
        const storedData = await getStreakData();
        const expenses = await getExpenses();

        // If no expenses, streak is 0
        if (expenses.length === 0) {
            setStreakData({ currentStreak: 0, lastLoggedDate: null, longestStreak: 0 });
            return;
        }

        // Sort expenses by date descending
        const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
        const latestExpense = sortedExpenses[0];

        // Simple recalculation based on expense history if needed, but we rely on stored streak data and update it incrementally
        // However, to ensure accuracy on load, we check if streak is broken

        let { currentStreak, lastLoggedDate, longestStreak } = storedData;

        if (lastLoggedDate) {
            const lastDate = parseISO(lastLoggedDate);
            const today = new Date();

            if (!isToday(lastDate) && !isYesterday(lastDate)) {
                // Streak broken if last log was older than yesterday
                // But wait, what if we just haven't logged TODAY yet?
                // Streak is only broken if we missed YESTERDAY.
                // If last log was 2 days ago, streak is broken.
                const daysDiff = differenceInCalendarDays(today, lastDate);
                if (daysDiff > 1) {
                    currentStreak = 0;
                }
            }
        }

        setStreakData({ currentStreak, lastLoggedDate, longestStreak });
        // Update storage just in case we reset it
        await saveStreakData({ currentStreak, lastLoggedDate, longestStreak });
    };

    useEffect(() => {
        calculateStreak();
    }, []);

    const updateStreakOnAdd = async (expenseDate) => {
        // expenseDate should be ISO string "YYYY-MM-DD"
        let { currentStreak, lastLoggedDate, longestStreak } = streakData;
        const newDate = parseISO(expenseDate);

        // If we already logged today (or on this date), don't increment, just update lastLoggedDate if newer
        if (lastLoggedDate && expenseDate === lastLoggedDate) {
            return;
        }

        // Check if this extends the streak
        if (!lastLoggedDate) {
            // First ever expense
            currentStreak = 1;
        } else {
            const lastDate = parseISO(lastLoggedDate);
            const diff = differenceInCalendarDays(newDate, lastDate);

            if (diff === 1) {
                // Consecutive day
                currentStreak += 1;
            } else if (diff > 1) {
                // Broken streak, reset to 1 (this is the new start)
                currentStreak = 1;
            } else if (diff === 0) {
                // Same day, do nothing (already handled by date check above)
            }
            // If diff < 0 (backdating), we don't change current streak usually regarding "current" momentum
        }

        if (currentStreak > longestStreak) {
            longestStreak = currentStreak;
        }

        const newData = {
            currentStreak,
            lastLoggedDate: expenseDate,
            longestStreak
        };

        setStreakData(newData);
        await saveStreakData(newData);
    };

    return {
        streakData,
        updateStreakOnAdd,
        refreshStreak: calculateStreak
    };
};
