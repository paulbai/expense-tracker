import { useState, useEffect, useCallback } from 'react';
import {
    getExpenses,
    addExpenseToStorage,
    updateExpenseInStorage,
    deleteExpenseFromStorage
} from '../utils/storage';

export const useExpenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadExpenses = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getExpenses();
            setExpenses(data);
            setError(null);
        } catch (err) {
            setError('Failed to load expenses');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadExpenses();

        const handleUpdate = () => loadExpenses();
        window.addEventListener('expenses-updated', handleUpdate);
        return () => window.removeEventListener('expenses-updated', handleUpdate);
    }, [loadExpenses]);

    const addExpense = async (expense) => {
        const success = await addExpenseToStorage(expense);
        if (success) {
            await loadExpenses();
            window.dispatchEvent(new Event('expenses-updated'));
            return true;
        }
        return false;
    };

    const updateExpense = async (expense) => {
        const success = await updateExpenseInStorage(expense);
        if (success) {
            await loadExpenses();
            window.dispatchEvent(new Event('expenses-updated'));
            return true;
        }
        return false;
    };

    const deleteExpense = async (id) => {
        const success = await deleteExpenseFromStorage(id);
        if (success) {
            await loadExpenses();
            window.dispatchEvent(new Event('expenses-updated'));
            return true;
        }
        return false;
    };

    return {
        expenses,
        loading,
        error,
        addExpense,
        updateExpense,
        deleteExpense,
        refreshExpenses: loadExpenses
    };
};
