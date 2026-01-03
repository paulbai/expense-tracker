import { startOfWeek, startOfMonth, isSameMonth, isSameWeek, parseISO } from 'date-fns';

export const calculateMonthTotal = (expenses) => {
    const now = new Date();
    return expenses.reduce((total, expense) => {
        const expenseDate = parseISO(expense.date);
        if (isSameMonth(expenseDate, now)) {
            return total + Number(expense.amount);
        }
        return total;
    }, 0);
};

export const calculateWeeklyTotal = (expenses) => {
    const now = new Date();
    return expenses.reduce((total, expense) => {
        const expenseDate = parseISO(expense.date);
        if (isSameWeek(expenseDate, now)) {
            return total + Number(expense.amount);
        }
        return total;
    }, 0);
};

export const getThisMonthExpensesCount = (expenses) => {
    const now = new Date();
    return expenses.filter(expense => isSameMonth(parseISO(expense.date), now)).length;
};

export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-SL', {
        style: 'currency',
        currency: 'SLE',
    }).format(amount);
};
