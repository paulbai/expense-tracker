import {
    differenceInCalendarDays,
    format,
    isSameMonth,
    isSameWeek,
    isValid,
    parseISO,
    startOfDay,
    subDays
} from 'date-fns';

const toValidDate = (value) => {
    const date = value instanceof Date ? value : parseISO(value);
    return isValid(date) ? date : null;
};

const toDayKey = (date) => format(startOfDay(date), 'yyyy-MM-dd');

export const calculateMonthTotal = (expenses, referenceDate = new Date()) => {
    return expenses.reduce((total, expense) => {
        const expenseDate = toValidDate(expense.date);
        if (expenseDate && isSameMonth(expenseDate, referenceDate)) {
            return total + Number(expense.amount);
        }
        return total;
    }, 0);
};

export const calculateWeeklyTotal = (expenses, weekStartsOn = 1, referenceDate = new Date()) => {
    return expenses.reduce((total, expense) => {
        const expenseDate = toValidDate(expense.date);
        if (expenseDate && isSameWeek(expenseDate, referenceDate, { weekStartsOn })) {
            return total + Number(expense.amount);
        }
        return total;
    }, 0);
};

export const getThisMonthExpensesCount = (expenses, referenceDate = new Date()) => {
    return expenses.filter((expense) => {
        const date = toValidDate(expense.date);
        return date && isSameMonth(date, referenceDate);
    }).length;
};

export const calculateDateTotal = (expenses, date) => {
    const targetDate = toValidDate(date);
    if (!targetDate) return 0;

    return expenses.reduce((total, expense) => {
        const expenseDate = toValidDate(expense.date);
        return expenseDate && toDayKey(expenseDate) === toDayKey(targetDate)
            ? total + Number(expense.amount)
            : total;
    }, 0);
};

export const calculateStreak = (expenses, referenceDate = new Date()) => {
    const referenceDay = startOfDay(referenceDate);
    const dateKeys = [...new Set(
        expenses
            .map((expense) => toValidDate(expense.date))
            .filter((date) => date && differenceInCalendarDays(referenceDay, date) >= 0)
            .map(toDayKey)
    )].sort();

    if (dateKeys.length === 0) {
        return { currentStreak: 0, longestStreak: 0, lastLoggedDate: null };
    }

    const loggedDays = new Set(dateKeys);
    const todayKey = toDayKey(referenceDay);
    const yesterday = subDays(referenceDay, 1);
    let cursor = loggedDays.has(todayKey) ? referenceDay : yesterday;
    let currentStreak = 0;

    while (loggedDays.has(toDayKey(cursor))) {
        currentStreak += 1;
        cursor = subDays(cursor, 1);
    }

    let longestStreak = 1;
    let runningStreak = 1;
    for (let index = 1; index < dateKeys.length; index += 1) {
        const previous = parseISO(dateKeys[index - 1]);
        const current = parseISO(dateKeys[index]);
        runningStreak = differenceInCalendarDays(current, previous) === 1
            ? runningStreak + 1
            : 1;
        longestStreak = Math.max(longestStreak, runningStreak);
    }

    return {
        currentStreak,
        longestStreak,
        lastLoggedDate: dateKeys.at(-1)
    };
};

export const formatCurrency = (amount, currency = 'SLE', locale = 'en-SL') => {
    const numericAmount = Number(amount) || 0;

    try {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency
        }).format(numericAmount);
    } catch {
        return new Intl.NumberFormat('en', {
            style: 'currency',
            currency: 'USD'
        }).format(numericAmount);
    }
};

export const formatExpenseDate = (value, dateFormat = 'dd/MM/yyyy') => {
    const date = toValidDate(value);
    if (!date) return 'Invalid date';

    const supportedFormats = ['dd/MM/yyyy', 'MM/dd/yyyy', 'yyyy-MM-dd'];
    return format(date, supportedFormats.includes(dateFormat) ? dateFormat : 'dd/MM/yyyy');
};

export const getMonthLabel = (referenceDate = new Date()) => format(referenceDate, 'MMMM yyyy');
