/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { CATEGORIES } from '../utils/constants';
import { calculateStreak } from '../utils/calculations';
import { getExpenses, saveExpenses, saveStreakData } from '../utils/storage';

const ExpensesContext = createContext(null);

const isIsoDate = (value) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return false;
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year
        && date.getMonth() === month - 1
        && date.getDate() === day;
};

const validateExpense = (expense) => {
    if (!expense?.id || typeof expense.id !== 'string') {
        return 'An expense needs a unique id.';
    }
    if (!Number.isFinite(Number(expense.amount)) || Number(expense.amount) <= 0) {
        return 'Enter an amount greater than zero.';
    }
    if (!CATEGORIES.some((category) => category.id === expense.category)) {
        return 'Choose a valid category.';
    }
    if (!isIsoDate(expense.date)) {
        return 'Choose a valid date.';
    }
    if (typeof expense.note !== 'string' || expense.note.length > 100) {
        return 'Notes can contain up to 100 characters.';
    }
    return null;
};

export const ExpensesProvider = ({ children }) => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const refreshExpenses = useCallback(async () => {
        try {
            setLoading(true);
            const savedExpenses = await getExpenses();
            setExpenses(savedExpenses);
            setError(null);
        } catch (caughtError) {
            setError(caughtError.message || 'Expenses could not be loaded.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshExpenses();

        const handleStorageChange = (event) => {
            if (event.key === 'expenses') refreshExpenses();
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [refreshExpenses]);

    const commitExpenses = useCallback(async (nextExpenses) => {
        await saveExpenses(nextExpenses);
        setExpenses(nextExpenses);
        setError(null);

        // This remains a compatibility cache for existing installations. Expense
        // history is the source of truth, so edits and deletes stay accurate.
        try {
            await saveStreakData(calculateStreak(nextExpenses));
        } catch {
            // Saving the cache must never make a completed expense mutation fail.
        }
    }, []);

    const addExpense = useCallback(async (expense) => {
        const validationMessage = validateExpense(expense);
        if (validationMessage) {
            setError(validationMessage);
            return false;
        }
        if (expenses.some((item) => item.id === expense.id)) {
            setError('That expense was already saved.');
            return false;
        }

        try {
            await commitExpenses([...expenses, { ...expense, amount: Number(expense.amount) }]);
            return true;
        } catch (caughtError) {
            setError(caughtError.message || 'The expense could not be saved.');
            return false;
        }
    }, [commitExpenses, expenses]);

    const updateExpense = useCallback(async (expense) => {
        const validationMessage = validateExpense(expense);
        if (validationMessage) {
            setError(validationMessage);
            return false;
        }
        if (!expenses.some((item) => item.id === expense.id)) {
            setError('This expense no longer exists.');
            return false;
        }

        try {
            await commitExpenses(expenses.map((item) => (
                item.id === expense.id ? { ...expense, amount: Number(expense.amount) } : item
            )));
            return true;
        } catch (caughtError) {
            setError(caughtError.message || 'The expense could not be updated.');
            return false;
        }
    }, [commitExpenses, expenses]);

    const deleteExpense = useCallback(async (id) => {
        if (!expenses.some((item) => item.id === id)) {
            setError('This expense no longer exists.');
            return false;
        }

        try {
            await commitExpenses(expenses.filter((item) => item.id !== id));
            return true;
        } catch (caughtError) {
            setError(caughtError.message || 'The expense could not be deleted.');
            return false;
        }
    }, [commitExpenses, expenses]);

    const clearExpenses = useCallback(async () => {
        try {
            await commitExpenses([]);
            return true;
        } catch (caughtError) {
            setError(caughtError.message || 'Expenses could not be cleared.');
            return false;
        }
    }, [commitExpenses]);

    const value = useMemo(() => ({
        expenses,
        loading,
        error,
        addExpense,
        updateExpense,
        deleteExpense,
        clearExpenses,
        refreshExpenses,
        clearError: () => setError(null)
    }), [addExpense, clearExpenses, deleteExpense, error, expenses, loading, refreshExpenses, updateExpense]);

    return <ExpensesContext.Provider value={value}>{children}</ExpensesContext.Provider>;
};

export const useExpenses = () => {
    const context = useContext(ExpensesContext);
    if (!context) {
        throw new Error('useExpenses must be used inside ExpensesProvider.');
    }
    return context;
};
