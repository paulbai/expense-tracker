import { DEFAULT_SETTINGS, STORAGE_KEYS } from './constants';

export class StorageError extends Error {
    constructor(message, cause) {
        super(message);
        this.name = 'StorageError';
        this.cause = cause;
    }
}

const createBrowserStorageAdapter = () => ({
    get: async (key) => {
        const value = window.localStorage.getItem(key);
        return value === null ? null : { value };
    },
    set: async (key, value) => {
        window.localStorage.setItem(key, value);
    },
    remove: async (key) => {
        window.localStorage.removeItem(key);
    }
});

const getStorage = () => {
    if (typeof window === 'undefined') {
        throw new StorageError('Storage is only available in a browser.');
    }

    if (!window.storage) {
        window.storage = createBrowserStorageAdapter();
    }

    return window.storage;
};

const parseStoredJson = (result, fallback, key) => {
    if (!result?.value) return fallback;

    try {
        return JSON.parse(result.value);
    } catch (error) {
        throw new StorageError(`Saved ${key} data could not be read.`, error);
    }
};

const read = async (key, fallback) => {
    try {
        const result = await getStorage().get(key);
        return parseStoredJson(result, fallback, key);
    } catch (error) {
        if (error instanceof StorageError) throw error;
        throw new StorageError(`Unable to read ${key}.`, error);
    }
};

const write = async (key, value) => {
    try {
        await getStorage().set(key, JSON.stringify(value));
    } catch (error) {
        throw new StorageError(`Unable to save ${key}.`, error);
    }
};

const remove = async (key) => {
    try {
        await getStorage().remove(key);
    } catch (error) {
        throw new StorageError(`Unable to remove ${key}.`, error);
    }
};

const isExpenseArray = (value) => Array.isArray(value);

const isValidDateString = (value) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return false;
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
};

const normaliseExpenses = (expenses) => expenses.map((expense) => ({
    ...expense,
    note: typeof expense.note === 'string' ? expense.note : ''
}));

const hasValidExpenseShape = (expense) => (
    expense
    && typeof expense === 'object'
    && typeof expense.id === 'string'
    && expense.id.length > 0
    && Number.isFinite(Number(expense.amount))
    && Number(expense.amount) > 0
    && typeof expense.category === 'string'
    && expense.category.length > 0
    && isValidDateString(expense.date)
    && typeof expense.note === 'string'
);

export const getExpenses = async () => {
    const expenses = await read(STORAGE_KEYS.EXPENSES, []);
    if (!isExpenseArray(expenses)) {
        throw new StorageError('Saved expenses are not in a valid format.');
    }
    const normalisedExpenses = normaliseExpenses(expenses);
    if (!normalisedExpenses.every(hasValidExpenseShape)) {
        throw new StorageError('Saved expenses contain an invalid entry.');
    }
    return normalisedExpenses;
};

export const saveExpenses = async (expenses) => {
    if (!isExpenseArray(expenses)) {
        throw new StorageError('Expenses must be saved as a list.');
    }
    await write(STORAGE_KEYS.EXPENSES, expenses);
    return true;
};

export const getSettings = async () => {
    const settings = await read(STORAGE_KEYS.SETTINGS, {});
    if (!settings || Array.isArray(settings) || typeof settings !== 'object') {
        throw new StorageError('Saved settings are not in a valid format.');
    }
    return { ...DEFAULT_SETTINGS, ...settings };
};

export const saveSettings = async (settings) => {
    await write(STORAGE_KEYS.SETTINGS, { ...DEFAULT_SETTINGS, ...settings });
    return true;
};

export const saveStreakData = async (data) => {
    await write(STORAGE_KEYS.STREAK, data);
    return true;
};

export const getUserProfile = async () => {
    const profile = await read(STORAGE_KEYS.USER_PROFILE, null);
    if (profile !== null && (Array.isArray(profile) || typeof profile !== 'object')) {
        throw new StorageError('Saved profile is not in a valid format.');
    }
    return profile;
};

export const saveUserProfile = async (profile) => {
    await write(STORAGE_KEYS.USER_PROFILE, profile);
    return true;
};

export const removeUserProfile = async () => {
    await remove(STORAGE_KEYS.USER_PROFILE);
    return true;
};

export const clearExpenseData = async () => {
    await Promise.all([
        remove(STORAGE_KEYS.EXPENSES),
        remove(STORAGE_KEYS.STREAK)
    ]);
    return true;
};
