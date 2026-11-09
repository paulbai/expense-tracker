import { describe, expect, it } from 'vitest';
import {
    calculateDateTotal,
    calculateMonthTotal,
    calculateStreak,
    calculateWeeklyTotal,
    compareNewestFirst,
    formatCurrency,
    reachedStreakMilestone
} from './calculations';

const expense = (id, date, amount, category = 'food') => ({
    id,
    date,
    amount,
    category,
    note: '',
    createdAt: `${date}T12:00:00.000Z`,
    updatedAt: `${date}T12:00:00.000Z`
});

describe('spending calculations', () => {
    const referenceDate = new Date(2026, 0, 8, 12);
    const expenses = [
        expense('one', '2026-01-04', 15),
        expense('two', '2026-01-05', 20),
        expense('three', '2026-01-06', 25),
        expense('four', '2026-01-08', 30),
        expense('last-month', '2025-12-31', 10)
    ];

    it('calculates current-month, weekly, and daily totals without counting older expenses', () => {
        expect(calculateMonthTotal(expenses, referenceDate)).toBe(90);
        expect(calculateWeeklyTotal(expenses, 1, referenceDate)).toBe(75);
        expect(calculateDateTotal(expenses, '2026-01-05')).toBe(20);
    });

    it('calculates current and longest streaks from expense history', () => {
        expect(calculateStreak(expenses, referenceDate)).toEqual({
            currentStreak: 1,
            longestStreak: 3,
            lastLoggedDate: '2026-01-08'
        });
    });

    it('keeps yesterday’s streak but resets after a skipped day', () => {
        const yesterdayOnly = [expense('one', '2026-01-07', 10)];
        expect(calculateStreak(yesterdayOnly, referenceDate).currentStreak).toBe(1);
        expect(calculateStreak(yesterdayOnly, new Date(2026, 0, 9, 12)).currentStreak).toBe(0);
    });

    it('formats amounts using the chosen currency', () => {
        expect(formatCurrency(1250.5, 'USD')).toMatch(/1,250\.50/);
        expect(formatCurrency(1250.5, 'SLE')).toContain('1,250.50');
    });

    it('celebrates a milestone only when the streak reaches it', () => {
        expect(reachedStreakMilestone(6, 7)).toBe(true);
        expect(reachedStreakMilestone(7, 7)).toBe(false);
        expect(reachedStreakMilestone(7, 8)).toBe(false);
    });

    it('orders same-day expenses by when they were added', () => {
        const sorted = [
            { id: 'older-day', date: '2026-01-07', createdAt: '2026-01-07T09:00:00.000Z' },
            { id: 'first-today', date: '2026-01-08', createdAt: '2026-01-08T09:00:00.000Z' },
            { id: 'latest-today', date: '2026-01-08', createdAt: '2026-01-08T18:00:00.000Z' }
        ].sort(compareNewestFirst);

        expect(sorted.map((item) => item.id)).toEqual(['latest-today', 'first-today', 'older-day']);
    });
});
