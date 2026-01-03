import { STORAGE_KEYS } from './constants';

// Polyfill/Adapter for window.storage if it doesn't exist (for browser dev)
if (typeof window !== 'undefined' && !window.storage) {
    window.storage = {
        get: async (key) => {
            const value = localStorage.getItem(key);
            return value ? { value } : null;
        },
        set: async (key, value) => {
            localStorage.setItem(key, value);
        },
        remove: async (key) => {
            localStorage.removeItem(key);
        }
    };
}

export const getExpenses = async () => {
    try {
        const result = await window.storage.get(STORAGE_KEYS.EXPENSES);
        return result ? JSON.parse(result.value) : [];
    } catch (error) {
        console.error('Error loading expenses:', error);
        return [];
    }
};

export const saveExpenses = async (expenses) => {
    try {
        await window.storage.set(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
        return true;
    } catch (error) {
        console.error('Error saving expenses:', error);
        return false;
    }
};

export const addExpenseToStorage = async (expense) => {
    try {
        const expenses = await getExpenses();
        expenses.push(expense);
        await saveExpenses(expenses);
        return true;
    } catch (error) {
        console.error("Error adding expense", error);
        return false;
    }
}

export const updateExpenseInStorage = async (updatedExpense) => {
    try {
        const expenses = await getExpenses();
        const index = expenses.findIndex(e => e.id === updatedExpense.id);
        if (index !== -1) {
            expenses[index] = updatedExpense;
            await saveExpenses(expenses);
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error updating expense", error);
        return false;
    }
}

export const deleteExpenseFromStorage = async (id) => {
    try {
        const expenses = await getExpenses();
        const filtered = expenses.filter(e => e.id !== id);
        await saveExpenses(filtered);
        return true;
    } catch (error) {
        console.error("Error deleting expense", error);
        return false;
    }
}

export const getSettings = async () => {
    try {
        const result = await window.storage.get(STORAGE_KEYS.SETTINGS);
        return result ? JSON.parse(result.value) : {
            notificationEnabled: true,
            notificationTime: "20:00",
            currency: "USD",
            dateFormat: "MM/DD/YYYY",
            startOfWeek: "monday"
        };
    } catch (error) {
        console.error('Error loading settings:', error);
        return null;
    }
};

export const saveSettings = async (settings) => {
    try {
        await window.storage.set(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
        return true;
    } catch (error) {
        console.error('Error saving settings:', error);
        return false;
    }
};

export const getStreakData = async () => {
    try {
        const result = await window.storage.get(STORAGE_KEYS.STREAK);
        return result ? JSON.parse(result.value) : { currentStreak: 0, lastLoggedDate: null, longestStreak: 0 };
    } catch (error) {
        console.error('Error loading streak data', error);
        return { currentStreak: 0, lastLoggedDate: null, longestStreak: 0 };
    }
}

export const saveStreakData = async (data) => {
    try {
        await window.storage.set(STORAGE_KEYS.STREAK, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error saving streak data', error);
        return false;
    }
}
